import type { NextConfig } from "next";

const isVercelPreview = process.env.VERCEL_ENV === "preview";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    deviceSizes: [360, 430, 512, 640, 720, 750, 768, 780, 800, 860, 1080, 1440, 1536, 1920],
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "framerusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "afttechnotrade.com" }], destination: "https://www.afttechnotrade.com/:path*", permanent: true }];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ...(isVercelPreview ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] : []),
      ],
    }];
  },
};
export default nextConfig;
