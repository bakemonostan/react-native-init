import type { MetadataRoute } from "next";

import { getCanonicalOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getCanonicalOrigin();
  if (!base) return [];

  const root = `${base}/`;

  return [
    {
      url: root,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/create`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
