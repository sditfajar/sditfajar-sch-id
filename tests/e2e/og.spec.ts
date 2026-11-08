import { test, expect } from "@playwright/test";

const pages = ["/", "/spmb", "/admin/login"];

for (const path of pages) {
  test(`OpenGraph lengkap di ${path}`, async ({ page, request }) => {
    await page.goto(path);
    const og = (prop: string) => page.locator(`meta[property="${prop}"]`);

    await expect(og("og:title")).toHaveAttribute("content", /SDIT Fajar/);
    await expect(og("og:description")).toHaveAttribute("content", /.+/);
    await expect(og("og:type")).toHaveAttribute("content", "website");
    await expect(og("og:locale")).toHaveAttribute("content", "id_ID");
    await expect(og("og:site_name")).toHaveAttribute("content", "SDIT Fajar Depok");
    await expect(og("og:image:width")).toHaveAttribute("content", "1200");
    await expect(og("og:image:height")).toHaveAttribute("content", "630");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );

    // Gambar benar-benar bisa diunduh, bertipe PNG, dan cukup ringan untuk WhatsApp (< 300 KB)
    const imageUrl = await og("og:image").getAttribute("content");
    expect(imageUrl).toMatch(/^https?:\/\//);
    const imagePath =
      new URL(imageUrl!).pathname + (new URL(imageUrl!).search || "");
    const res = await request.get(imagePath);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
    expect((await res.body()).length).toBeLessThan(300 * 1024);
  });
}

