import { describe, it, expect, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
  }),
  Plus_Jakarta_Sans: () => ({
    variable: "--font-plus-jakarta",
  }),
}));

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { metadata } from "@/app/layout";

describe("Metadata & SEO Configuration (Fase 8)", () => {
  it("robots.ts mengizinkan root dan melarang admin/api/dev", () => {
    const robotsConfig = robots();
    expect(robotsConfig).toBeDefined();
    expect(robotsConfig.rules).toBeDefined();

    const rules = Array.isArray(robotsConfig.rules)
      ? robotsConfig.rules[0]
      : robotsConfig.rules;

    expect(rules.allow).toBe("/");

    const disallow = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];
    expect(disallow).toContain("/admin");
    expect(disallow).toContain("/admin/");
    expect(disallow).toContain("/admin/*");
    expect(disallow).toContain("/berhasil/");
    expect(disallow).toContain("/api/");
    expect(disallow).toContain("/dev/");

    expect(robotsConfig.sitemap).toBeDefined();
    expect(typeof robotsConfig.sitemap).toBe("string");
    expect(robotsConfig.sitemap).toContain("/sitemap.xml");
  });

  it("sitemap.ts mendaftarkan rute utama '/' dan rute pendaftaran '/spmb'", () => {
    const sitemapEntries = sitemap();
    expect(Array.isArray(sitemapEntries)).toBe(true);
    expect(sitemapEntries.length).toBe(2);

    const rootEntry = sitemapEntries[0];
    expect(rootEntry.url).toMatch(/\/$/);
    expect(rootEntry.priority).toBe(1.0);
    expect(rootEntry.changeFrequency).toBe("daily");
    expect(rootEntry.lastModified).toBeInstanceOf(Date);

    const spmbEntry = sitemapEntries[1];
    expect(spmbEntry.url).toMatch(/\/spmb$/);
    expect(spmbEntry.priority).toBe(0.9);
    expect(spmbEntry.changeFrequency).toBe("daily");
    expect(spmbEntry.lastModified).toBeInstanceOf(Date);
  });

  it("layout.tsx mengonfigurasi icons menuju /favicon.ico", () => {
    expect(metadata.icons).toBeDefined();
    const icons = metadata.icons as { icon?: string; shortcut?: string; apple?: string };
    expect(icons.icon).toBe("/favicon.ico");
    expect(icons.shortcut).toBe("/favicon.ico");
  });
});
