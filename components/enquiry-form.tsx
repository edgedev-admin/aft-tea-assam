"use client";

import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";

type EnquiryFormProps = { wholesale?: boolean; variant?: "contact" | "default" };
const enquiryTypes = ["General Enquiry", "Assam Black Tea", "Speciality Tea", "Golden Pearl", "Wholesale / Bulk Supply", "Manufacturing / Business Enquiry", "Other"];

export function EnquiryForm({ wholesale = false, variant = "default" }: EnquiryFormProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const contactVariant = variant === "contact";
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); if (!form.get("name") || !form.get("email") || !form.get("type") || !form.get("message")) { setError(true); setMessage("Please complete your name, email, enquiry type and message before submitting."); return; } setError(false); setMessage("This form is ready for a backend connection; no enquiry has been sent yet."); }
  return <form className="aft-enquiry-form" onSubmit={submit} noValidate><label>Full Name<input name="name" autoComplete="name" required/></label><label>Email Address<input name="email" type="email" autoComplete="email" required/></label>{(contactVariant || wholesale) && <label>Business / Organisation<input name="business" autoComplete="organization"/></label>}<label>Enquiry Type<select name="type" required defaultValue=""><option value="" disabled>Select an enquiry type</option>{enquiryTypes.map((type) => <option key={type}>{type}</option>)}</select></label>{(contactVariant || wholesale) && <><label>Estimated Quantity<input name="quantity"/></label><label>Destination / Location<input name="destination"/></label></>}<label className="wide">Project Details / Message<textarea name="message" rows={contactVariant ? 4 : 5} required/></label><button type="submit">{contactVariant ? <>Send Enquiry <ArrowUpRight size={15}/></> : "Submit enquiry"}</button><p className={error ? "error" : ""} aria-live="polite">{message}</p></form>;
}
