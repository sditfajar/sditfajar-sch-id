import type { Metadata } from "next";
import { SCHOOL_CONFIG } from "@/lib/config";
import { getRegistrationState } from "@/lib/actions/registration-state";
import { JsonLd } from "@/components/seo/json-ld";
import { schoolJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/seo";
import {
  HomeNavbar,
  HomeHero,
  HomeWavyDivider,
  HomeProfile,
  HomeVisiMisi,
  HomePrograms,
  HomeCurriculum,
  HomeExtracurricular,
  HomeHistory,
  HomeCtaBanner,
  HomeFooter,
  HomeFloatingWa,
} from "@/components/home";

export const metadata: Metadata = {
  // `absolute` melewati template "%s | SDIT Fajar Depok" agar tidak dobel
  title: { absolute: siteConfig.defaultTitle },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const regState = await getRegistrationState();
  const academicYear = regState.academicYear || SCHOOL_CONFIG.defaultAcademicYear;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FF] text-[#0F172A] font-[family-name:var(--font-plus-jakarta)] selection:bg-[#FFDBCA] selection:text-[#783200]">
      {/* Skema Data Terstruktur ElementarySchool & WebSite */}
      <JsonLd data={schoolJsonLd()} />

      {/* 1. Header & Navigation (Fixed topbar + sticky main nav + mobile hamburger drawer) */}
      <HomeNavbar academicYear={academicYear} />

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col">
        {/* 2. Hero Section */}
        <HomeHero academicYear={academicYear} />

        {/* Wavy Divider 1: Transition into Profil Section */}
        <HomeWavyDivider fillColor="text-[#F2F3FF]" />

        {/* 3. Profil Sekolah & Motto Kami */}
        <HomeProfile />

        {/* Wavy Divider 2: Transition into Visi & Misi */}
        <HomeWavyDivider fillColor="text-[#F2F3FF]" inverted />

        {/* 4. Visi & Misi (Featured Visi Card + 6 Misi Cards) */}
        <HomeVisiMisi />

        {/* 5. Program Unggulan & Morning Activity */}
        <HomePrograms />

        {/* 6. Konsep Pembelajaran / Kurikulum */}
        <HomeCurriculum />

        {/* 7. Ekstrakurikuler */}
        <HomeExtracurricular />

        {/* 8. Sejarah SDIT Fajar Depok */}
        <HomeHistory />

        {/* 9. CTA Banner Pendaftaran PPDB */}
        <HomeCtaBanner academicYear={academicYear} />
      </main>

      {/* 10. Footer Resmi */}
      <HomeFooter />

      {/* 11. Floating WhatsApp Button ("Tanya Admin") */}
      <HomeFloatingWa />
    </div>
  );
}
