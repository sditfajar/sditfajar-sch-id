import type { Metadata } from "next";

const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sditfajar.sch.id";
export const siteUrl = rawUrl.replace(/\/+$/, "");

export const siteConfig = {
  name: "SDIT Fajar Depok",
  shortName: "SDIT Fajar",
  legalName: "Sekolah Dasar Islam Terpadu (SDIT) Fajar",
  defaultTitle: "SDIT Fajar Depok – Sekolah Islam Terpadu Tahfidz Qur'an",
  description:
    "SD Islam Terpadu di Tapos, Depok: tahfidz & tahsin, Kurikulum Merdeka, dan pembiasaan ibadah untuk generasi Qur'ani yang cerdas, mandiri, dan berakhlak mulia.",
  motto: "Membina Generasi Qur'ani yang Cerdas, Mandiri, dan Berakhlak Mulia",
  locale: "id_ID",
  language: "id-ID",
  email: "sditfajar@gmail.com",
  phone: "+62-877-3786-0657",
  instagram: "https://www.instagram.com/sdit_fajar/",
  logoPath: "/logo.png",
  address: {
    street: "Jl. Jati III No.40 RT.007/007, Kel. Jatijajar, Kec. Tapos",
    city: "Kota Depok",
    region: "Jawa Barat",
    postalCode: "16451",
    country: "ID",
  },
  keywords: [
    "SDIT",
    "SDIT Depok",
    "sekolah di Depok",
    "SDIT Fajar",
    "Sekolah Dasar Islam Terpadu",
    "SDIT Fajar Depok",
    "SD Islam Terpadu Depok",
    "SDIT Tapos Depok",
    "sekolah tahfidz Depok",
    "SPMB SDIT Fajar",
    "pendaftaran SD Islam Depok",
    "PPDB SDIT Depok",
    "sekolah dasar Islam Jatijajar",
  ],
} as const;

/** Ubah path relatif menjadi URL absolut. */
export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}

type PageMetaInput = {
  /** Tanpa nama sekolah; template di root layout menambahkannya. */
  title: string;
  description: string;
  /** Path canonical, contoh: '/spmb' */
  path: string;
};

/**
 * Metadata halaman publik yang bisa diindeks.
 * Mengisi ulang openGraph/twitter secara lengkap karena Next.js
 * menimpa (bukan menggabungkan) objek tersebut dari layout induk.
 */
export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

