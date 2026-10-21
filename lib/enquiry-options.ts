import { wholesaleEnquiryTypes } from "./wholesale.ts";

export const contactEnquiryTypes = [
  "General Enquiry",
  "Tea Collection / Product Enquiry",
  "Wholesale / Bulk Supply",
  "Specialty Tea Enquiry",
  "Custom Blending",
  "Private-Label Supply",
  "Other",
] as const;

export const quantityOptions = [
  "Not decided yet",
  "Under 100 kg",
  "100-500 kg",
  "500 kg-1 tonne",
  "1-5 tonnes",
  "More than 5 tonnes",
  "Other / to discuss",
] as const;

export const supplyEnquiryTypes = new Set<string>([
  "Wholesale / Bulk Supply",
  "Specialty Tea Enquiry",
  "Custom Blending",
  "Private-Label Supply",
  ...wholesaleEnquiryTypes,
]);

export const allEnquiryTypes = [
  ...contactEnquiryTypes,
  ...wholesaleEnquiryTypes,
] as const;
