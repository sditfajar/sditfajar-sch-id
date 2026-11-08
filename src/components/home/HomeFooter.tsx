"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Search,
  ExternalLink,
} from "lucide-react";
import { SCHOOL_CONFIG } from "@/lib/config";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function HomeFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    if (query.includes("biaya") || query.includes("daftar") || query.includes("ppdb") || query.includes("spmb")) {
      router.push("/spmb");
      return;
    }

    let targetId = "profil-sekolah";
    if (query.includes("visi") || query.includes("misi")) {
      targetId = "profil-sekolah";
    } else if (query.includes("program") || query.includes("unggul")) {
      targetId = "program-unggulan";
    } else if (query.includes("ekskul") || query.includes("ekstra")) {
      targetId = "ekstrakurikuler";
    } else if (query.includes("sejarah")) {
      targetId = "sejarah";
    }

    if (pathname === "/") {
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${targetId}`);
    }
  };

  const waUrl = SCHOOL_CONFIG.contacts.fadil.waLink;

  return (
    <footer className="w-full bg-[#F2F3FF] text-[#0F172A] pt-14 sm:pt-20 pb-8 sm:pb-12 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 mb-12 sm:mb-16">
          {/* Col 1: About & Search Bar (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo SDIT Fajar Depok"
                  width={36}
                  height={36}
                  className="object-contain p-1"
                />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#1D4ED8]">
                SDIT FAJAR
              </span>
              <span className="text-xs bg-[#ECFDF5] text-[#047857] px-2.5 py-0.5 rounded-full font-bold">
                Kota Depok
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#434655] leading-relaxed max-w-md">
              SDIT Fajar Kota Depok adalah lembaga pendidikan Islam terpadu yang berkomitmen
              mencetak generasi Qurani, cerdas, dan berakhlak mulia. Kami terus berupaya
              menghadirkan lingkungan belajar yang unggul, inspiratif, serta berlandaskan iman dan ilmu.
            </p>

            {/* Search Bar */}
            <div className="pt-2">
              <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="search"
                    suppressHydrationWarning
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari program, profil, info SPMB..."
                    className="w-full bg-white rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold hover:bg-[#173FA8] transition-colors shrink-0 shadow-sm min-h-[44px]"
                >
                  Cari
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Alamat Lengkap & Jam Layanan (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm sm:text-base font-bold text-[#0F172A]">
              Alamat Sekolah
            </h4>
            <a
              href={SCHOOL_CONFIG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2.5 text-[#434655] hover:text-[#1D4ED8] transition-colors"
              title="Buka lokasi di Google Maps"
            >
              <MapPin className="w-5 h-5 text-[#1D4ED8] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="space-y-1">
                <p className="text-xs sm:text-sm leading-relaxed group-hover:underline">
                  {SCHOOL_CONFIG.address}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] group-hover:underline">
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>

            <div className="pt-1 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                <Clock className="w-4 h-4 text-[#1D4ED8]" />
                <span>Jam Layanan:</span>
              </div>
              <p className="text-xs text-[#434655] pl-6 leading-relaxed">
                Senin - Jumat: 07.00 - 15.30 WIB<br />
                Sabtu - Ahad: Libur (Konsultasi via WA)
              </p>
            </div>
          </div>

          {/* Col 3: Kontak & WhatsApp (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm sm:text-base font-bold text-[#0F172A]">
              Kontak &amp; Layanan Informasi
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#434655]">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                <a
                  href={`tel:${SCHOOL_CONFIG.contacts.fadil.phone}`}
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  {SCHOOL_CONFIG.contacts.fadil.display} (Padil Riswandi)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                <a
                  href={`tel:${SCHOOL_CONFIG.contacts.viny.phone}`}
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  {SCHOOL_CONFIG.contacts.viny.display} (Viny Virzana)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                <a
                  href={SCHOOL_CONFIG.contacts.email.mailto}
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  {SCHOOL_CONFIG.contacts.email.address}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                <a
                  href={SCHOOL_CONFIG.contacts.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  Follow Us: <strong className="text-[#0F172A]">{SCHOOL_CONFIG.contacts.instagram.handle}</strong>
                </a>
              </li>
            </ul>

            {/* WhatsApp direct button */}
            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F97316] text-[#0F172A] text-xs sm:text-sm font-bold shadow-sm hover:brightness-105 transition-all min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kontak Melalui WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 sm:pt-8 border-t border-slate-300/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#434655] text-center sm:text-left">
          <div>
            © 2026 SDIT Fajar Depok. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span>Sekolah Dasar Islam Terpadu Fajar</span>
            <span>•</span>
            <span>Tapos, Kota Depok</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
