import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  return siteUrl
    ? [{ url: siteUrl, changeFrequency: "monthly", priority: 1 }]
    : [];
}
