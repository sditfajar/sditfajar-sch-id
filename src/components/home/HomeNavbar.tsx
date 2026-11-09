"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Menu, X, ArrowRight } from "lucide-react";
import { SCHOOL_CONFIG } from "@/lib/config";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface HomeNavbarProps {
  academicYear?: string;
}

export function HomeNavbar({ academicYear = SCHOOL_CONFIG.defaultAcademicYear }: HomeNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  // State untuk sliding active indicator
  const [activeId, setActiveId] = useState<string>("");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isReady, setIsReady] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Inisialisasi activeId dari window.location.hash setelah mount (hindari hydration mismatch)
  useEffect(() => {
    const syncInitialActiveId = () => {
      if (pathname === "/") {
        const hash = window.location.hash.replace("#", "");
        const validSections = [
          "profil-sekolah",
          "program-unggulan",
          "kurikulum",
          "ekstrakurikuler",
          "sejarah",
        ];
        if (validSections.includes(hash)) {
          setActiveId(hash);
        } else {
          setActiveId("");
        }
      } else {
        setActiveId("");
      }
    };

    const rafId = requestAnimationFrame(syncInitialActiveId);
    return () => cancelAnimationFrame(rafId);
  }, [pathname]);

  // Pengukuran posisi & lebar item aktif
  useIsomorphicLayoutEffect(() => {
    if (pathname !== "/") {
      setIsReady(false);
      return;
    }

    const targetEl = itemRefs.current.get(activeId);
    if (targetEl) {
      setIndicatorStyle({
        left: targetEl.offsetLeft,
        width: targetEl.offsetWidth,
      });

      if (!isReady) {
        // Matikan transisi saat pengukuran awal pertama kali mount
        const raf = requestAnimationFrame(() => {
          setIsReady(true);
        });
        return () => cancelAnimationFrame(raf);
      }
    }
  }, [activeId, pathname, isReady]);

  // Observer untuk resize & perubahan font agar indikator tetap presisi
  useEffect(() => {
    if (pathname !== "/" || !navRef.current) return;

    const handleResize = () => {
      const targetEl = itemRefs.current.get(activeId);
      if (targetEl) {
        setIndicatorStyle({
          left: targetEl.offsetLeft,
          width: targetEl.offsetWidth,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(navRef.current);

    window.addEventListener("resize", handleResize);
    document.fonts?.ready?.then(handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [activeId, pathname]);

  // Scroll-spy untuk memperbarui activeId saat pengguna scroll manual
  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = [
      "profil-sekolah",
      "program-unggulan",
      "kurikulum",
      "ekstrakurikuler",
      "sejarah",
    ];

    let ticking = false;

    const handleScrollSpy = () => {
      if (isProgrammaticScroll.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (isProgrammaticScroll.current) {
            ticking = false;
            return;
          }

          const scrollY = window.scrollY;

          // Jika scroll di bagian atas (hero section), aktifkan Beranda
          if (scrollY < 200) {
            setActiveId("");
            ticking = false;
            return;
          }

          // Cek apakah sudah di bagian paling bawah halaman
          const isAtBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 60;

          if (isAtBottom) {
            setActiveId("sejarah");
            ticking = false;
            return;
          }

          // Threshold offset navbar (~160px)
          const offsetThreshold = 160;
          let current = "";

          for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (el) {
              const top = el.offsetTop - offsetThreshold;
              if (scrollY >= top) {
                current = id;
              }
            }
          }

          setActiveId(current);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();

    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Tutup menu dropdown saat klik di luar area dropdown atau menekan tombol Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const waNumber = SCHOOL_CONFIG.contacts.fadil.display;
  const waUrl = SCHOOL_CONFIG.contacts.fadil.waLink;

  const navLinks = [
    { label: "Beranda", href: "/", sectionId: "" },
    { label: "Profil", href: "/#profil-sekolah", sectionId: "profil-sekolah" },
    { label: "Program", href: "/#program-unggulan", sectionId: "program-unggulan" },
    { label: "Kurikulum", href: "/#kurikulum", sectionId: "kurikulum" },
    { label: "Ekstrakurikuler", href: "/#ekstrakurikuler", sectionId: "ekstrakurikuler" },
    { label: "Sejarah", href: "/#sejarah", sectionId: "sejarah" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    setMobileMenuOpen(false);

    // Kunci scroll-spy sementara agar indikator tidak melompat selama smooth scroll
    isProgrammaticScroll.current = true;
    setActiveId(sectionId);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const unlockScroll = () => {
      isProgrammaticScroll.current = false;
      window.removeEventListener("scrollend", unlockScroll);
    };

    window.addEventListener("scrollend", unlockScroll, { once: true });
    scrollTimeoutRef.current = setTimeout(unlockScroll, 800);

    // Jika sudah di halaman utama ("/"), gunakan smooth scroll langsung tanpa reload
    if (pathname === "/") {
      if (!sectionId) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) {
          window.history.pushState(null, "", "/");
        }
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${sectionId}`);
        }
      }
    }
    // Jika di luar halaman utama ("/spmb", dll.), Next.js Link melakukan client-side routing ke "/#sectionId"
  };

  const renderBannerSegment = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center gap-6 sm:gap-8 px-4 shrink-0 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <span className="bg-[#F97316] text-[#0F172A] px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-sm">
          PPDB {academicYear}
        </span>
        <span className="text-white/95 text-xs font-semibold">
          Penerimaan Peserta Didik Baru Telah Dibuka! Kuota Terbatas.
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs font-medium text-white/90">
        <a
          href={`tel:${SCHOOL_CONFIG.contacts.fadil.phone}`}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#F97316]" aria-hidden="true" />
          <span>{waNumber}</span>
        </a>
        <span className="text-white/30">•</span>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-white transition-colors underline decoration-white/40 hover:decoration-white"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" aria-hidden="true" />
          <span>WhatsApp: {waNumber}</span>
        </a>
      </div>

      <span className="text-white/40 font-bold select-none">•</span>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md backdrop-saturate-150 border-b border-slate-200/50 shadow-[0_4px_20px_rgba(15,23,42,0.07)]"
          : "bg-white/95 border-b border-slate-100 shadow-none"
      }`}
    >
      {/* Top Announcement Bar: Single-line Continuous Sliding Loop (Marquee) */}
      <div
        className={`bg-[#1D4ED8] text-white overflow-hidden flex items-center relative border-b border-blue-600/40 select-none transition-all duration-300 ease-in-out ${
          isScrolled ? "h-0 opacity-0 border-b-transparent pointer-events-none" : "h-8 sm:h-9 opacity-100"
        }`}
        aria-label="Pengumuman PPDB"
      >
        <div className="animate-marquee flex items-center">
          {renderBannerSegment("banner-1")}
          {renderBannerSegment("banner-2")}
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ease-in-out ${
          isScrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
        }`}
      >
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
          <div
            className={`relative rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-all duration-300 ${
              isScrolled ? "w-8 h-8 sm:w-10 sm:h-10" : "w-9 h-9 sm:w-11 sm:h-11"
            }`}
          >
            <Image
              src="/logo.png"
              alt="Logo SDIT Fajar Depok"
              width={44}
              height={44}
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-extrabold text-[#1D4ED8] leading-tight tracking-tight transition-all duration-300 ${
                isScrolled ? "text-sm sm:text-lg" : "text-base sm:text-xl"
              }`}
            >
              SDIT FAJAR
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 leading-tight">
              Kota Depok
            </span>
          </div>
        </Link>

        {/* Desktop Navigation (>= 1025px) */}
        <nav
          ref={navRef}
          className="relative hidden lg:flex items-center gap-1 bg-[#F2F3FF]/70 p-1.5 rounded-full border border-[#DAE2FD]/60"
        >
          {/* Sliding Active Pill Indicator */}
          <span
            aria-hidden="true"
            className={`absolute inset-y-1.5 left-0 rounded-full bg-[#1D4ED8] shadow-sm pointer-events-none z-0 motion-reduce:transition-none ${
              isReady
                ? "transition-[transform,width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                : "transition-none"
            } ${
              pathname === "/" && isReady && indicatorStyle.width > 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
            }}
          />

          {navLinks.map((item) => {
            const isActive = pathname === "/" && activeId === item.sectionId;
            return (
              <Link
                key={item.label}
                ref={(el) => {
                  if (el) {
                    itemRefs.current.set(item.sectionId, el);
                  } else {
                    itemRefs.current.delete(item.sectionId);
                  }
                }}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.sectionId)}
                aria-current={isActive ? (item.sectionId === "" ? "page" : "location") : undefined}
                className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-slate-600 hover:text-[#1D4ED8] hover:bg-white/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Buttons (Desktop) & Hamburger Toggle (Mobile/Tablet) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold bg-[#F2F3FF] text-[#0F172A] hover:bg-[#E2E7FF] transition-colors min-h-[44px]"
          >
            Kontak Kami
          </a>

          <Link
            href="/spmb"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#F97316] text-[#0F172A] shadow-[0_2.5px_0_#9d4300] sm:shadow-[0_4px_0_#9d4300] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_1px_0_#9d4300] sm:active:shadow-[0_2px_0_#9d4300] transition-all min-h-[36px] sm:min-h-[42px] shrink-0 whitespace-nowrap"
          >
            <span>
              <span className="inline sm:hidden">Daftar SPMB</span>
              <span className="hidden sm:inline">Daftar SPMB Online</span>
            </span>
            <ArrowRight className="w-4 h-4 hidden sm:inline" />
          </Link>

          {/* Hamburger Menu Toggle (Mobile & Tablet: <= 1024px) */}
          <button
            ref={hamburgerButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] ${
              mobileMenuOpen
                ? "bg-[#1D4ED8] text-white shadow-sm ring-2 ring-[#1D4ED8]/30"
                : "bg-[#F2F3FF] text-slate-700 hover:text-[#1D4ED8] hover:bg-[#E2E7FF]"
            }`}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu Overlay with Glassmorphism */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden fixed inset-0 bg-slate-900/25 backdrop-blur-sm z-40 transition-all duration-300 ${
            isScrolled ? "top-[56px] sm:top-[64px]" : "top-[96px] sm:top-[116px]"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            ref={menuRef}
            className="mx-3 sm:mx-6 mt-2.5 sm:mt-3 bg-white/85 backdrop-blur-xl backdrop-saturate-150 rounded-3xl border border-white/60 shadow-[0_20px_50px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 p-4 sm:p-5 max-h-[calc(100vh-120px)] overflow-y-auto space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pt-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Menu Utama
              </span>
              <span className="text-[10px] font-bold text-[#1D4ED8] bg-[#F2F3FF]/80 border border-[#DAE2FD]/70 px-2.5 py-0.5 rounded-full">
                SDIT FAJAR
              </span>
            </div>

            <div className="bg-[#F2F3FF]/60 border border-[#DAE2FD]/60 rounded-2xl p-1.5 flex flex-col gap-1 backdrop-blur-xs">
              {navLinks.map((item) => {
                const isActive = pathname === "/" && activeId === item.sectionId;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.sectionId)}
                    aria-current={isActive ? (item.sectionId === "" ? "page" : "location") : undefined}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all min-h-[44px] ${
                      isActive
                        ? "bg-white text-[#1D4ED8] shadow-xs border border-white/80"
                        : "text-slate-700 hover:text-[#1D4ED8] hover:bg-white/80"
                    }`}
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        isActive ? "text-[#1D4ED8]" : "text-slate-400 group-hover:text-[#1D4ED8]"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-2.5">
              <Link
                href="/spmb"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold bg-[#F97316] text-[#0F172A] shadow-[0_3px_0_#9d4300] hover:brightness-105 active:translate-y-0.5 text-sm min-h-[44px] transition-all"
              >
                <span>Daftar SPMB Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-full font-bold bg-white/80 hover:bg-white text-[#0F172A] border border-slate-200/70 shadow-xs hover:border-[#DAE2FD] text-sm min-h-[44px] transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#10B981]" />
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

