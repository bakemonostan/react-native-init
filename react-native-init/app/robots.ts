import type { MetadataRoute } from "next";

import { getCanonicalOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
