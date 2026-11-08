import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: absoluteUrl("/spmb"),
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
