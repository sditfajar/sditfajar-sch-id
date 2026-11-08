import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Navbar & Client-Side Routing Consistency across Public Pages", () => {
  const rootDir = process.cwd();

  it("HomeNavbar menggunakan next/link dan Next.js client-side navigation", () => {
    const navbarPath = path.join(rootDir, "src/components/home/HomeNavbar.tsx");
    const content = fs.readFileSync(navbarPath, "utf-8");

    // Pastikan menggunakan Link dari next/link dan usePathname dari next/navigation
    expect(content).toContain('import Link from "next/link";');
    expect(content).toContain('import { usePathname } from "next/navigation";');
    expect(content).toContain("<Link");

    // Pastikan tautan seksi mengarah ke rute client-side beranda
    expect(content).toContain('href: "/"');
    expect(content).toContain('href: "/#profil-sekolah"');
    expect(content).toContain('href: "/#program-unggulan"');
    expect(content).toContain('href: "/#kurikulum"');
    expect(content).toContain('href: "/#ekstrakurikuler"');
    expect(content).toContain('href: "/#sejarah"');
    expect(content).toContain('href="/spmb"');
  });

  it("Halaman /spmb menggunakan HomeNavbar dengan tahun ajaran dinamis", () => {
    const spmbPagePath = path.join(rootDir, "src/app/spmb/page.tsx");
    const content = fs.readFileSync(spmbPagePath, "utf-8");

    // Pastikan HomeNavbar diimpor dan digunakan
    expect(content).toContain('from "@/components/home"');
    expect(content).toContain("HomeNavbar");
    expect(content).toContain("<HomeNavbar academicYear={academicYear} />");

    // Pastikan padding atas diterapkan agar tidak tertutup fixed navbar
    expect(content).toMatch(/pt-28\s+sm:pt-36\s+lg:pt-40/);
  });

  it("Halaman /berhasil/[id] menggunakan HomeNavbar dan HomeFooter", () => {
    const berhasilPagePath = path.join(rootDir, "src/app/berhasil/[id]/page.tsx");
    const content = fs.readFileSync(berhasilPagePath, "utf-8");

    expect(content).toContain('from "@/components/home"');
    expect(content).toContain("<HomeNavbar academicYear={academicYear} />");
    expect(content).toContain("<HomeFooter />");
  });

  it("HomeFooter menerapkan router.push untuk navigasi client-side tanpa reload halaman", () => {
    const footerPath = path.join(rootDir, "src/components/home/HomeFooter.tsx");
    const content = fs.readFileSync(footerPath, "utf-8");

    expect(content).toContain('import { useRouter, usePathname } from "next/navigation";');
    expect(content).toContain('router.push("/spmb")');
    expect(content).not.toContain('window.location.href = "/spmb"');
  });
});
