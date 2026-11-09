import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteUrl } from "@/lib/seo";

// Disalin dari src/app/globals.css baris 83-95:
// Playful Tactile Design Tokens (SDIT Fajar Stitch)
export const brand = {
  primary: "#1D4ED8", // globals.css line 84: --fajar-primary
  primaryDark: "#0037B0", // globals.css line 85: --fajar-primary-dark
  secondary: "#F97316", // globals.css line 86: --fajar-secondary
  secondaryDark: "#9D4300", // globals.css line 87: --fajar-secondary-dark
  tertiary: "#10B981", // globals.css line 88: --fajar-tertiary
  tertiaryDark: "#047857", // globals.css line 89: --fajar-tertiary-dark
  canvas: "#FAF8FF", // globals.css line 90: --fajar-canvas
  surfaceLow: "#F2F3FF", // globals.css line 91: --fajar-surface-low
  surfaceHigh: "#E2E7FF", // globals.css line 92: --fajar-surface-high
  surfaceHighest: "#DAE2FD", // globals.css line 93: --fajar-surface-highest
  dark: "#0F172A", // globals.css line 94: --fajar-dark
  muted: "#434655", // globals.css line 95: --fajar-muted
  white: "#FFFFFF",
} as const;

type OgInput = {
  title: string;
  subtitle?: string;
  /** Label kecil berbentuk pil taktil di atas judul, mis. "SPMB Online" */
  badge?: string;
};

async function loadFonts() {
  try {
    const [medium, extraBold] = await Promise.all([
      readFile(
        join(
          process.cwd(),
          "src",
          "assets",
          "fonts",
          "PlusJakartaSans-Medium.ttf"
        )
      ),
      readFile(
        join(
          process.cwd(),
          "src",
          "assets",
          "fonts",
          "PlusJakartaSans-ExtraBold.ttf"
        )
      ),
    ]);
    return [
      {
        name: "Plus Jakarta Sans",
        data: medium,
        weight: 500 as const,
        style: "normal" as const,
      },
      {
        name: "Plus Jakarta Sans",
        data: extraBold,
        weight: 800 as const,
        style: "normal" as const,
      },
    ];
  } catch {
    return null; // Fallback otomatis ke font default bawaan Satori
  }
}

async function loadLogo() {
  try {
    const logoPath = join(process.cwd(), "public", "logo.png");
    const file = await readFile(logoPath);
    return `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function renderOg({ title, subtitle, badge }: OgInput) {
  const [fonts, logo] = await Promise.all([loadFonts(), loadLogo()]);
  let host = "www.sditfajar.sch.id";
  try {
    host = new URL(siteUrl).host;
  } catch {
    // fallback host default
  }

  const options =
    fonts && fonts.length > 0
      ? { width: 1200, height: 630, fonts }
      : { width: 1200, height: 630 };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "54px 64px",
          backgroundColor: brand.canvas,
          color: brand.dark,
          fontFamily: fonts ? "Plus Jakarta Sans" : "sans-serif",
        }}
      >
        {/* Dekorasi Bentuk Organik Playful Tactile */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: "440px",
            height: "440px",
            right: "-120px",
            top: "-150px",
            borderRadius: "50%",
            backgroundColor: "#FFDBCA",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: "360px",
            height: "360px",
            left: "-140px",
            bottom: "-160px",
            borderRadius: "50%",
            backgroundColor: brand.surfaceHighest,
            opacity: 0.9,
          }}
        />

        {/* Kepala: Logo Taktil + Identitas Sekolah */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {logo ? (
            <div
              style={{
                display: "flex",
                width: "82px",
                height: "82px",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "22px",
                backgroundColor: brand.white,
                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
                marginRight: "20px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                width={66}
                height={66}
                alt=""
                style={{ display: "flex", objectFit: "contain" }}
              />
            </div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: "30px",
                fontWeight: 800,
                color: brand.primary,
                letterSpacing: "0.02em",
              }}
            >
              SDIT Fajar Depok
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "19px",
                fontWeight: 600,
                color: brand.muted,
                marginTop: "2px",
              }}
            >
              Sekolah Dasar Islam Terpadu Tahfidz Qur&apos;an
            </div>
          </div>
        </div>

        {/* Isi: Kartu Taktil Utama (Badge + Judul + Subjudul) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: brand.white,
            padding: "36px 42px",
            borderRadius: "28px",
            boxShadow:
              "0 0 0 1px rgba(0, 0, 0, 0.06), 0 12px 28px -6px rgba(29, 78, 216, 0.12)",
          }}
        >
          {badge ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "8px 20px",
                marginBottom: "16px",
                borderRadius: "999px",
                backgroundColor: brand.secondary,
                color: brand.white,
                boxShadow: `0 4px 0 ${brand.secondaryDark}`,
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "0.04em",
              }}
            >
              {badge}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: "50px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: brand.dark,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                marginTop: "14px",
                fontSize: "23px",
                lineHeight: 1.35,
                color: brand.muted,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Kaki: Host Domain + Indikator Taktil */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "20px",
            fontWeight: 700,
            color: brand.muted,
            paddingTop: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={brand.primary}>
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
            <span>{host}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              backgroundColor: brand.surfaceLow,
              border: `1px solid ${brand.surfaceHigh}`,
              color: brand.primaryDark,
              fontSize: "17px",
              fontWeight: 700,
            }}
          >
            Membina Generasi Qur&apos;ani
          </div>
        </div>
      </div>
    ),
    options
  );
}
