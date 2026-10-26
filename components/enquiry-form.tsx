"use client";

import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { contactEnquiryTypes, quantityOptions, supplyEnquiryTypes } from "../lib/enquiry-options";
import { wholesaleEnquiryTypes } from "../lib/wholesale";
import "./enquiry-form.css";

type EnquiryFormProps = {
  wholesale?: boolean;
  variant?: "contact" | "default";
  defaultType?: string;
  productContext?: string;
};

type FieldName = "name" | "email" | "phone" | "business" | "type" | "quantity" | "destination" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type SubmissionState = "idle" | "submitting" | "success" | "error";
type ServiceState = "checking" | "available" | "unavailable";

const failureMessage = "We couldn't submit your enquiry right now. Please try again or contact us directly.";

function value(form: FormData, name: FieldName | "companyWebsite") {
  return String(form.get(name) || "").trim();
}

function validate(form: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = value(form, "name");
  const email = value(form, "email");
  const phone = value(form, "phone");
  const business = value(form, "business");
  const type = value(form, "type");
  const quantity = value(form, "quantity");
  const destination = value(form, "destination");
  const message = value(form, "message");

  if (name.length < 2) errors.name = "Enter your full name.";
  else if (name.length > 100) errors.name = "Use 100 characters or fewer.";
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (phone.length > 40) errors.phone = "Use 40 characters or fewer.";
  if (business.length > 120) errors.business = "Use 120 characters or fewer.";
  if (!type) errors.type = "Choose an enquiry type.";
  if (quantity.length > 80) errors.quantity = "Use 80 characters or fewer.";
  if (destination.length > 160) errors.destination = "Use 160 characters or fewer.";
  if (message.length < 10) errors.message = "Please add a little more detail.";
  else if (message.length > 4000) errors.message = "Use 4,000 characters or fewer.";
  return errors;
}

function createSubmissionId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function EnquiryForm({ wholesale = false, variant = "default", defaultType = "", productContext }: EnquiryFormProps) {
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [selectedType, setSelectedType] = useState(defaultType);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [serviceState, setServiceState] = useState<ServiceState>("checking");
  const formRef = useRef<HTMLFormElement>(null);
  const [submissionId, setSubmissionId] = useState(createSubmissionId);
  const [formStartedAt] = useState(Date.now);
  const baseId = useId();
  const contactVariant = variant === "contact";
  const enquiryTypes = useMemo<readonly string[]>(() => wholesale ? wholesaleEnquiryTypes : contactEnquiryTypes, [wholesale]);
  const showSupplyFields = wholesale || supplyEnquiryTypes.has(selectedType);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/enquiries", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result: { configured?: boolean }) => {
        setServiceState(result.configured ? "available" : "unavailable");
        if (!result.configured) setNotice("Online enquiry sending is currently unavailable. Please use the phone or email details below.");
      })
      .catch((error) => {
        if ((error as Error)?.name !== "AbortError") {
          setServiceState("unavailable");
          setNotice("Online enquiry sending is currently unavailable. Please use the phone or email details below.");
        }
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!wholesale) return;
    const updateType = (event: Event) => {
      const requestedType = (event as CustomEvent<{ type?: string }>).detail?.type;
      if (requestedType && enquiryTypes.includes(requestedType)) {
        setSelectedType(requestedType);
        setErrors((current) => ({ ...current, type: undefined }));
      }
    };
    window.addEventListener("aft:wholesale-enquiry", updateType);
    return () => window.removeEventListener("aft:wholesale-enquiry", updateType);
  }, [wholesale, enquiryTypes]);

  function focusFirstError(nextErrors: FieldErrors) {
    const firstError = Object.keys(nextErrors)[0];
    const field = firstError ? formRef.current?.elements.namedItem(firstError) : null;
    if (field instanceof HTMLElement) field.focus();
  }

  function clearFieldError(name: FieldName) {
    if (!errors[name]) return;
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current || submissionState === "submitting") return;
    if (serviceState !== "available") {
      setSubmissionState("error");
      setNotice("Online enquiry sending is currently unavailable. Please use the phone or email details below.");
      return;
    }

    const form = new FormData(formRef.current);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setSubmissionState("error");
      setNotice("Review the highlighted fields before sending your enquiry.");
      focusFirstError(nextErrors);
      return;
    }

    setSubmissionState("submitting");
    setNotice("Sending your enquiry. This can take a little longer if the service is waking up.");

    const payload = {
      name: value(form, "name"),
      email: value(form, "email"),
      phone: value(form, "phone"),
      business: value(form, "business"),
      type: value(form, "type"),
      quantity: showSupplyFields ? value(form, "quantity") : "",
      destination: showSupplyFields ? value(form, "destination") : "",
      message: value(form, "message"),
      source: wholesale ? "wholesale" : "contact",
      ...(productContext ? { productContext } : {}),
      companyWebsite: value(form, "companyWebsite"),
      formStartedAt,
    };

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": submissionId },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { ok?: boolean; reference?: string; fieldErrors?: Record<string, string[]>; code?: string };

      if (!response.ok || !result.ok) {
        if (result.fieldErrors) {
          const serverErrors = Object.fromEntries(Object.entries(result.fieldErrors).map(([field, messages]) => [field, messages?.[0]])) as FieldErrors;
          setErrors(serverErrors);
          focusFirstError(serverErrors);
        }
        if (result.code === "rate_limited") setNotice("Too many enquiries were submitted from this connection. Please wait a few minutes or contact us directly.");
        else if (result.code === "service_unavailable") {
          setServiceState("unavailable");
          setNotice("Online enquiry sending is currently unavailable. Please use the phone or email details below.");
        } else setNotice(failureMessage);
        setSubmissionState("error");
        return;
      }

      setSubmissionState("success");
      setNotice(`Thank you. Your enquiry has been received for processing.${result.reference ? ` Reference: ${result.reference}.` : ""}`);
      setSubmissionId(createSubmissionId());
    } catch {
      setSubmissionState("error");
      setNotice(failureMessage);
    }
  }

  const fieldError = (name: FieldName) => errors[name] ? `${baseId}-${name}-error` : undefined;
  const buttonLabel = submissionState === "submitting"
    ? "Sending your enquiry..."
    : serviceState === "checking"
      ? "Checking availability..."
      : serviceState === "unavailable"
        ? "Enquiry sending unavailable"
        : "Send Enquiry";

  return (
    <form className="aft-enquiry-form" ref={formRef} onSubmit={submit} noValidate aria-busy={submissionState === "submitting"}>
      <label htmlFor={`${baseId}-name`}>
        <span className="field-label">Full Name <em>Required</em></span>
        <input id={`${baseId}-name`} name="name" autoComplete="name" maxLength={100} required onChange={() => clearFieldError("name")} aria-invalid={Boolean(errors.name)} aria-describedby={fieldError("name")} />
        <span className="form-field-error" id={`${baseId}-name-error`}>{errors.name || "\u00a0"}</span>
      </label>
      <label htmlFor={`${baseId}-email`}>
        <span className="field-label">Email Address <em>Required</em></span>
        <input id={`${baseId}-email`} name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} required onChange={() => clearFieldError("email")} aria-invalid={Boolean(errors.email)} aria-describedby={fieldError("email")} />
        <span className="form-field-error" id={`${baseId}-email-error`}>{errors.email || "\u00a0"}</span>
      </label>
      {(contactVariant || wholesale) && <>
        <label htmlFor={`${baseId}-phone`}>
          <span className="field-label">Phone / WhatsApp <em>Optional</em></span>
          <input id={`${baseId}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} placeholder="Include country code if outside India" onChange={() => clearFieldError("phone")} aria-invalid={Boolean(errors.phone)} aria-describedby={fieldError("phone")} />
          <span className="form-field-error" id={`${baseId}-phone-error`}>{errors.phone || "\u00a0"}</span>
        </label>
        <label htmlFor={`${baseId}-type`}>
          <span className="field-label">Enquiry Type <em>Required</em></span>
          <select id={`${baseId}-type`} name="type" required value={selectedType} onChange={(event) => { setSelectedType(event.target.value); clearFieldError("type"); }} aria-invalid={Boolean(errors.type)} aria-describedby={fieldError("type")}>
            <option value="" disabled>Select an enquiry type</option>
            {enquiryTypes.map((type) => <option value={type} key={type}>{type}</option>)}
          </select>
          <span className="form-field-error" id={`${baseId}-type-error`}>{errors.type || "\u00a0"}</span>
        </label>
        <label htmlFor={`${baseId}-business`}>
          <span className="field-label">Business / Organisation <em>Optional</em></span>
          <input id={`${baseId}-business`} name="business" autoComplete="organization" maxLength={120} onChange={() => clearFieldError("business")} aria-invalid={Boolean(errors.business)} aria-describedby={fieldError("business")} />
          <span className="form-field-error" id={`${baseId}-business-error`}>{errors.business || "\u00a0"}</span>
        </label>
      </>}
      {!contactVariant && !wholesale && <label htmlFor={`${baseId}-type`}>
        <span className="field-label">Enquiry Type <em>Required</em></span>
        <select id={`${baseId}-type`} name="type" required value={selectedType} onChange={(event) => { setSelectedType(event.target.value); clearFieldError("type"); }} aria-invalid={Boolean(errors.type)} aria-describedby={fieldError("type")}>
          <option value="" disabled>Select an enquiry type</option>
          {enquiryTypes.map((type) => <option value={type} key={type}>{type}</option>)}
        </select>
        <span className="form-field-error" id={`${baseId}-type-error`}>{errors.type || "\u00a0"}</span>
      </label>}
      {showSupplyFields && <>
        <label htmlFor={`${baseId}-quantity`}>
          <span className="field-label">Approximate Quantity <em>Optional</em></span>
          <select id={`${baseId}-quantity`} name="quantity" defaultValue="" onChange={() => clearFieldError("quantity")} aria-invalid={Boolean(errors.quantity)} aria-describedby={fieldError("quantity")}>
            <option value="">Select a range</option>
            {quantityOptions.map((quantity) => <option value={quantity} key={quantity}>{quantity}</option>)}
          </select>
          <span className="form-field-error" id={`${baseId}-quantity-error`}>{errors.quantity || "\u00a0"}</span>
        </label>
        <label htmlFor={`${baseId}-destination`}>
          <span className="field-label">Delivery Destination <em>Optional</em></span>
          <input id={`${baseId}-destination`} name="destination" maxLength={160} placeholder="City, state or country" autoComplete="shipping country-name" onChange={() => clearFieldError("destination")} aria-invalid={Boolean(errors.destination)} aria-describedby={fieldError("destination")} />
          <span className="form-field-error" id={`${baseId}-destination-error`}>{errors.destination || "\u00a0"}</span>
        </label>
      </>}
      <label className="wide" htmlFor={`${baseId}-message`}>
        <span className="field-label">Message <em>Required</em></span>
        <textarea id={`${baseId}-message`} name="message" defaultValue={productContext ? `I would like more information about ${productContext}.` : undefined} rows={contactVariant ? 6 : 7} minLength={10} maxLength={4000} required placeholder={wholesale ? "Share the tea type, preferred grade or cup profile, intended use, packaging needs and any other relevant details." : "Tell us about the tea or business requirement you have in mind."} onChange={() => clearFieldError("message")} aria-invalid={Boolean(errors.message)} aria-describedby={fieldError("message")} />
        <span className="form-field-error" id={`${baseId}-message-error`}>{errors.message || "\u00a0"}</span>
      </label>
      <label className="form-honeypot" aria-hidden="true">Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
      <div className="form-footer wide">
        <p className="form-privacy">By sending this form, you ask AFT Techno Trade to use your details to review and respond to your enquiry. They are not added to a marketing list. Read the <Link href="/privacy">Privacy Notice</Link>.</p>
        <button type="submit" disabled={submissionState === "submitting" || serviceState !== "available"}>
          {submissionState === "submitting" ? <LoaderCircle className="form-spinner" size={17} aria-hidden="true" /> : submissionState === "success" ? <Check size={17} aria-hidden="true" /> : <ArrowUpRight size={17} aria-hidden="true" />}
          {buttonLabel}
        </button>
      </div>
      <p className={`form-status wide ${submissionState}`} role={submissionState === "error" ? "alert" : "status"} aria-live="polite">{notice || "\u00a0"}</p>
    </form>
  );
}
