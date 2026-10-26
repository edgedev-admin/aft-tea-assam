export type BusinessContact = {
  id: string;
  label: string;
  display: string;
  international: string;
};

export const businessContacts = [
  { id: "business-primary", label: "Business Contact 1", display: "+91 94357 46167", international: "919435746167" },
  { id: "business-secondary", label: "Business Contact 2", display: "+91 70860 47498", international: "917086047498" },
] as const satisfies readonly BusinessContact[];

export function phoneHref(contact: BusinessContact) {
  return `tel:+${contact.international}`;
}

export const COMPANY_CONTACT = {
  name: "AFT Techno Trade",
  utilityLabel: "AFT TECHNO TRADE · UPPER ASSAM",
  email: "hmtea2019@gmail.com",
  emailHref: "mailto:hmtea2019@gmail.com",
  phone: businessContacts[0].display,
  phoneHref: phoneHref(businessContacts[0]),
  location: "Dikom & Lahowal, near Dibrugarh Airport",
  postalAddress: "Dibrugarh, Assam, India, 786010",
} as const;
