import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/admin/*",
        "/berhasil/",
        "/berhasil/*",
        "/api/",
        "/api/*",
        "/dev/",
        "/dev/*",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
