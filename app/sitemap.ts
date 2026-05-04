import type { MetadataRoute } from "next";
import { ALL_GUIDES } from "@/lib/guides";
import { SITE } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "",
    "/tools/amazon-listing-optimizer",
    "/tools/tiktok-shop-optimizer",
    "/tools/shopify-product-optimizer",
    "/guides",
    "/about",
    "/privacy",
    "/terms",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1.0 : 0.8,
  }));

  const guideEntries: MetadataRoute.Sitemap = ALL_GUIDES.map((g) => ({
    url: `${SITE.url}/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: g.kind === "editorial" ? 0.7 : 0.6,
  }));

  return [...staticEntries, ...guideEntries];
}
