import type { MetadataRoute } from "next";
import { products } from "../lib/products.ts";
import { SITE_URL } from "../lib/seo.ts";

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.VERCEL_ENV === "preview") return [];
  const staticRoutes = ["", "/about", "/contact", "/craft", "/gallery", "/projects", "/teas", "/wholesale"];
  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.7 })),
    ...products.map((product) => ({ url: `${baseUrl}/teas/${product.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 }))
  ];
}
