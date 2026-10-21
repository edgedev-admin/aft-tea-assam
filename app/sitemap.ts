import type { MetadataRoute } from "next";
import { products } from "../lib/products";

const baseUrl = "https://www.afttechnotrade.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/contact", "/craft", "/gallery", "/projects", "/teas", "/wholesale"];
  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.7 })),
    ...products.map((product) => ({ url: `${baseUrl}/teas/${product.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 }))
  ];
}
