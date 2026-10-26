import type { BusinessContact } from "./company.ts";

export type WhatsAppContext = { kind: "general" } | { kind: "wholesale" } | { kind: "product"; productName: string };

export const generalWhatsAppMessage = "Hello AFT Techno Trade, I visited your website and would like to know more about your Assam tea products. Please assist me.";
export const wholesaleWhatsAppMessage = "Hello AFT Techno Trade, I am interested in wholesale Assam tea supply. I would like to discuss available tea grades, approximate quantities, pricing, packaging and delivery options. Please guide me through the enquiry process.";

export function whatsappMessage(context: WhatsAppContext) {
  if (context.kind === "wholesale") return wholesaleWhatsAppMessage;
  if (context.kind === "product") {
    const name = context.productName.trim();
    if (!name) throw new Error("A product name is required for a product enquiry.");
    return `Hello AFT Techno Trade, I am interested in ${name}. Please share more information about this tea and the enquiry process.`;
  }
  return generalWhatsAppMessage;
}

export function whatsappContextForPath(pathname: string, productName?: string): WhatsAppContext {
  if (productName) return { kind: "product", productName };
  if (pathname === "/wholesale" || pathname.startsWith("/wholesale/")) return { kind: "wholesale" };
  return { kind: "general" };
}

export function whatsappUrl(contact: Pick<BusinessContact, "international">, context: WhatsAppContext = { kind: "general" }) {
  if (!/^[1-9]\d{7,14}$/.test(contact.international)) throw new Error("Use an international phone number containing digits only.");
  return `https://wa.me/${contact.international}?text=${encodeURIComponent(whatsappMessage(context))}`;
}
