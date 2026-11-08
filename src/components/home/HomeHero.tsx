import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Sprout,
  Trophy,
  Users,
  Award,
} from "lucide-react";
import { SCHOOL_CONFIG } from "@/lib/config";

interface HomeHeroProps {
  academicYear?: string;
}

const TRUST_BADGES = [
  {
    icon: BadgeCheck,
    color: "text-[#F97316]",
    label: "Akreditasi A Unggul",
  },
  {
    icon: BookOpen,
    color: "text-[#10B981]",
    label: "Tahfidz Metode Mutqin",
  },
  {
    icon: Sprout,
    color: "text-[#1D4ED8]",
    label: "Pendidikan Karakter Adab",
  },
  {
    icon: Trophy,
    color: "text-[#F97316]",
    label: "50+ Prestasi Kota & Provinsi",
  },
];

export function HomeHero({ academicYear = SCHOOL_CONFIG.defaultAcademicYear }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#DCE1FF]/30 via-[#FAF8FF] to-[#FAF8FF] pt-28 sm:pt-36 lg:pt-40 pb-12 lg:pb-20 px-4 sm:px-6">
      {/* Ambient Organic Glows */}
      <div
        className="absolute -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#FFDBCA]/50 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -left-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#DCE1FF]/60 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Headlines & CTAs */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
          {/* Floating Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[#1D4ED8] text-xs sm:text-sm font-bold">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse" />
            <span>Penerimaan Murid Baru T.A. {academicYear} Dibuka</span>
          </div>

          {/* Main Title (H1 Semantik & Alami untuk SEO Kata Kunci Utama) */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] text-balance">
            <span className="block text-lg sm:text-xl lg:text-2xl font-bold text-[#1D4ED8] mb-1.5 sm:mb-2 tracking-normal">
              SDIT Fajar Depok – Sekolah Dasar Islam Terpadu
            </span>
            Membentuk Generasi{" "}
            <span className="text-[#1D4ED8] relative inline-block whitespace-nowrap">
              Qur&apos;ani
              <svg
                className="absolute -bottom-2.5 left-0 w-full text-[#F97316] h-3.5"
                preserveAspectRatio="none"
                viewBox="0 0 100 12"
                aria-hidden="true"
              >
                <path
                  d="M0,7 Q50,0 100,7"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
            </span>{" "}
            yang Cerdas, Mandiri &amp; Berakhlak Mulia
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-[#434655] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Pilihan sekolah di Depok yang memadukan Kurikulum Merdeka nasional, program tahfidz &amp; tahsin,
            dan pembinaan adab Islami dalam suasana belajar ramah anak yang menyenangkan dan aman.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 sm:pt-2">
            <Link
              href="/spmb"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-base font-bold bg-[#F97316] text-[#0F172A] shadow-[0_4px_0_#9d4300] sm:shadow-[0_5px_0_#9d4300] hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#9d4300] transition-all min-h-[44px] sm:min-h-[48px] whitespace-nowrap"
            >
              <span>Daftar SPMB Sekarang</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            </Link>

            <a
              href="#profil-sekolah"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-7 py-3 sm:py-4 rounded-full text-xs sm:text-base font-bold bg-white text-[#1D4ED8] shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors min-h-[44px] sm:min-h-[48px] whitespace-nowrap"
            >
              <span>Profil Sekolah</span>
            </a>
          </div>

          {/* Trust Badges - Mobile: Single Row Flex with Slow Auto-scroll (Marquee) */}
          <div className="pt-0.5 sm:hidden relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]">
            <div className="animate-marquee-slow flex items-center gap-2 py-0.5 select-none">
              {TRUST_BADGES.map((badge, idx) => (
                <span
                  key={`badge-m1-${idx}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[#0F172A] text-xs font-semibold shrink-0 whitespace-nowrap"
                >
                  <badge.icon className={`w-4 h-4 ${badge.color} shrink-0`} />
                  {badge.label}
                </span>
              ))}
              {/* Duplicate loop for seamless infinite scroll */}
              {TRUST_BADGES.map((badge, idx) => (
                <span
                  key={`badge-m2-${idx}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[#0F172A] text-xs font-semibold shrink-0 whitespace-nowrap"
                  aria-hidden="true"
                >
                  <badge.icon className={`w-4 h-4 ${badge.color} shrink-0`} />
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* Trust Badges - Desktop & Tablet: Static Elegant Wrap */}
          <div className="hidden sm:flex pt-4 flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5">
            {TRUST_BADGES.map((badge, idx) => (
              <span
                key={`badge-d-${idx}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[#0F172A] text-xs font-semibold"
              >
                <badge.icon className={`w-4 h-4 ${badge.color} shrink-0`} />
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Graphic & Floating Stickers */}
        <div className="lg:col-span-5 relative mt-2 sm:mt-6 lg:mt-0">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Ambient Backing Glow & Decorative Tilt Frame */}
            <div
              className="absolute -inset-2 sm:-inset-3 bg-gradient-to-tr from-[#1D4ED8]/15 via-[#DAE2FD]/40 to-[#FFDBCA]/40 rounded-[2rem] sm:rounded-[2.5rem] transform -rotate-1 scale-[0.98] pointer-events-none"
              aria-hidden="true"
            />

            {/* Photo Frame Container */}
            <div className="relative rounded-3xl bg-[#DAE2FD]/80 p-2.5 sm:p-3.5 shadow-xl border border-[#C4C5D7]/50 backdrop-blur-sm z-10">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:h-[400px] w-full">
                <img
                  src="/images/hero-students.jpg"
                  alt="Siswa-siswi ceria SDIT Fajar Depok belajar dengan bahagia di sekolah"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Floating Stickers (Positioned outside overflow-hidden, elevated to z-20 so never clipped) */}
            {/* Floating Sticker 1: Hafalan */}
            <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-5 z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-100/90 flex items-center gap-2.5 sm:gap-3 hover:-translate-y-0.5 transition-transform duration-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center shrink-0 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="pr-1 sm:pr-2">
                <p className="text-base sm:text-lg font-extrabold text-[#0F172A] leading-none">
                  98%
                </p>
                <p className="text-[11px] sm:text-xs font-semibold text-[#434655] mt-0.5">
                  Target Hafalan Juz 30
                </p>
              </div>
            </div>

            {/* Floating Sticker 2: Rasio Guru & Siswa */}
            <div className="absolute bottom-10 -right-2 sm:bottom-12 sm:-right-4 z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-100/90 flex items-center gap-2.5 sm:gap-3 hover:-translate-y-0.5 transition-transform duration-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFEDD5] text-[#9D4300] flex items-center justify-center shrink-0 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div className="pr-1 sm:pr-2">
                <p className="text-base sm:text-lg font-extrabold text-[#0F172A] leading-none">
                  1:15
                </p>
                <p className="text-[11px] sm:text-xs font-semibold text-[#434655] mt-0.5">
                  Rasio Ideal Guru : Siswa
                </p>
              </div>
            </div>

            {/* Floating Sticker 3: Alumni Berprestasi */}
            <div className="absolute -bottom-3 left-4 sm:-bottom-4 sm:left-8 z-20 bg-[#1D4ED8] text-white px-3.5 sm:px-4 py-2 rounded-full shadow-lg border border-blue-400/30 flex items-center gap-2 hover:-translate-y-0.5 transition-transform duration-200">
              <Award className="w-4 h-4 text-[#F97316] shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">500+ Alumni Berprestasi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
