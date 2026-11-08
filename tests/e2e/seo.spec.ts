import { test, expect } from "@playwright/test";

const indexable = [
  { path: "/", title: /SDIT Fajar Depok/, canonical: /(:\d+|\/)$/ },
  { path: "/spmb", title: /Pendaftaran Murid Baru|SPMB/, canonical: /\/spmb$/ },
];

const noindex = ["/admin/login"];

for (const p of indexable) {
  test(`SEO dasar ${p.path}`, async ({ page }) => {
    await page.goto(p.path);

    await expect(page).toHaveTitle(p.title);
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /^.{70,200}$/
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      p.canonical
    );
    await expect(page.locator("h1")).toHaveCount(1);

    const noindexMeta = page.locator('meta[name="robots"][content*="noindex"]');
    expect(await noindexMeta.count()).toBe(0);
  });
}

for (const path of noindex) {
  test(`noindex ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/
    );
  });
}

test("robots.txt memblokir area privat dan menunjuk sitemap", async ({
  request,
}) => {
  const res = await request.get("/robots.txt");
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(body).toContain("Disallow: /admin");
  expect(body).toContain("Sitemap:");
});

test("sitemap hanya berisi halaman publik", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(body).toContain("/spmb");
  expect(body).not.toContain("/admin");
  expect(body).not.toContain("/berhasil");
});
