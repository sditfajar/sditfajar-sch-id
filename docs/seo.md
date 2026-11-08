# SEO — Website Resmi & SPMB SDIT Fajar Depok

Panduan implementasi SEO untuk seluruh halaman proyek (Next.js 16 App Router, React 19). Dokumen pendamping: [`og.md`](./og.md) (OpenGraph & gambar pratinjau tautan).

Semua path relatif terhadap root repositori. Kode memakai **Metadata API** bawaan Next.js, tanpa library tambahan.

------   ---

## 1. Ringkasan Strategi

| Rute | Diindeks? | Title | Canonical | Masuk sitemap |
|---|---|---|---|---|
| `/` | Ya | SDIT Fajar Depok – Sekolah Islam Terpadu Tahfidz Qur'an | `/` | Ya |
| `/spmb` | Ya | Pendaftaran Murid Baru (SPMB) Online | `/spmb` | Ya |
| `/berhasil/[id]` | **Tidak** (noindex) | Pendaftaran Berhasil | – | Tidak |
| `/admin/login` | **Tidak** (noindex) | Masuk Panitia | – | Tidak |
| `/admin/*` | **Tidak** (noindex) | Panel Panitia SPMB | – | Tidak |
| `/api/*` | **Tidak** | – | – | Tidak |
| 404 | Noindex otomatis oleh Next.js | – | – | Tidak |

Prinsip utama:

1. **Hanya `/` dan `/spmb` yang boleh diindeks.** Halaman lain berisi data pribadi (NIK, nama calon siswa) atau area internal.
2. **Jangan pernah menaruh data pendaftar di metadata** (title, description, OG) pada `/berhasil/[id]`.
3. **Canonical diset per halaman, bukan di root layout.** Jika diset di root, semua halaman yang tidak menimpanya akan mengaku canonical ke beranda.
4. `openGraph` dan `twitter` pada Next.js **menggantikan** (shallow merge), bukan digabung dalam. Karena itu ada helper `pageMetadata()` di bawah agar field wajib tidak hilang.
5. Satu `<h1>` per halaman, teks utama dirender di Server Component.

---

## 2. Berkas yang Dibuat / Diubah

```
src/
├── app/
│   ├── layout.tsx                  # UBAH: metadata dasar, viewport, lang="id"
│   ├── robots.ts                   # BARU
│   ├── sitemap.ts                  # BARU
│   ├── icon.png                    # BARU/pastikan ada (favicon, kelipatan 48px)
│   ├── apple-icon.png              # BARU/pastikan ada (180x180)
│   ├── (public)/
│   │   ├── page.tsx                # UBAH: metadata beranda + JSON-LD
│   │   ├── spmb/page.tsx           # UBAH: metadata SPMB + breadcrumb JSON-LD
│   │   └── berhasil/[id]/page.tsx  # UBAH: noindex
│   └── admin/
│       ├── layout.tsx              # BARU (atau gabungkan): noindex seluruh /admin
│       └── login/page.tsx          # UBAH: title
├── components/seo/json-ld.tsx      # BARU
└── lib/
    ├── seo.ts                      # BARU: konfigurasi & helper
    └── json-ld.ts                  # BARU: skema data terstruktur
next.config.ts                      # UBAH: header X-Robots-Tag
e2e/seo.spec.ts                     # BARU: pengujian otomatis
```

---

## 3. Variabel Lingkungan

Tambahkan ke `.env.local` dan **Vercel → Environment Variables**:

```ini
# Wajib: domain produksi, tanpa trailing slash
NEXT_PUBLIC_SITE_URL="https://spmb.sditfajar.sch.id"

# Opsional: kode verifikasi Google Search Console (metode meta tag)
NEXT_PUBLIC_GSC_VERIFICATION=""
```

Pastikan `NEXT_PUBLIC_SITE_URL` di produksi adalah domain final. Nilai ini dipakai untuk `metadataBase`, canonical, sitemap, dan JSON-LD. Kalau masih `localhost`, semua URL absolut akan salah.

---

## 4. Konfigurasi Pusat — `src/lib/seo.ts`

```ts
import type { Metadata } from 'next'

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
export const siteUrl = rawUrl.replace(/\/+$/, '')

export const siteConfig = {
  name: 'SDIT Fajar Depok',
  shortName: 'SDIT Fajar',
  legalName: 'Sekolah Dasar Islam Terpadu (SDIT) Fajar',
  defaultTitle: "SDIT Fajar Depok – Sekolah Islam Terpadu Tahfidz Qur'an",
  description:
    "SD Islam Terpadu di Tapos, Depok: tahfidz & tahsin, Kurikulum Merdeka, dan pembiasaan ibadah untuk generasi Qur'ani yang cerdas, mandiri, dan berakhlak mulia.",
  motto: "Membina Generasi Qur'ani yang Cerdas, Mandiri, dan Berakhlak Mulia",
  locale: 'id_ID',
  language: 'id-ID',
  email: 'sditfajar@gmail.com',
  phone: '+62-877-3786-0657',
  instagram: 'https://www.instagram.com/sdit_fajar/',
  logoPath: '/logo.png', // ASUMSI: sesuaikan dengan nama berkas logo di /public
  address: {
    street: 'Jl. Jati III No.40 RT.007/007, Kel. Jatijajar, Kec. Tapos',
    city: 'Kota Depok',
    region: 'Jawa Barat',
    postalCode: '16451',
    country: 'ID',
  },
  keywords: [
    'SDIT Fajar Depok',
    'SD Islam Terpadu Depok',
    'SDIT Tapos Depok',
    'sekolah tahfidz Depok',
    'SPMB SDIT Fajar',
    'pendaftaran SD Islam Depok',
    'PPDB SDIT Depok',
    'sekolah dasar Islam Jatijajar',
  ],
} as const

/** Ubah path relatif menjadi URL absolut. */
export function absoluteUrl(path = '/') {
  return new URL(path, `${siteUrl}/`).toString()
}

type PageMetaInput = {
  /** Tanpa nama sekolah; template di root layout menambahkannya. */
  title: string
  description: string
  /** Path canonical, contoh: '/spmb' */
  path: string
}

/**
 * Metadata halaman publik yang bisa diindeks.
 * Mengisi ulang openGraph/twitter secara lengkap karena Next.js
 * menimpa (bukan menggabungkan) objek tersebut dari layout induk.
 */
export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  }
}
```

> Berkas `src/lib/config.ts` yang sudah ada juga menyimpan data statis sekolah. Jika ingin satu sumber kebenaran, `siteConfig` di atas bisa digabung ke sana.

---

## 5. Root Layout — `src/app/layout.tsx`

Tambahkan/ubah bagian berikut. Bagian font (`Plus Jakarta Sans`) dan `globals.css` yang sudah ada dibiarkan.

```tsx
import type { Metadata, Viewport } from 'next'
import { siteConfig, siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'education',
  // JANGAN set `alternates.canonical` di sini (lihat prinsip no. 3).
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    // Gambar diisi otomatis dari src/app/opengraph-image.tsx (lihat og.md)
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#065f46', // ASUMSI: ganti dengan warna utama brand sekolah
}
```

Pastikan tag `<html>` memakai bahasa Indonesia:

```tsx
<html lang="id">
```

**Favicon.** Letakkan `icon.png` (kelipatan 48px, mis. 192×192 atau 512×512) dan `apple-icon.png` (180×180) di `src/app/`. Next.js otomatis membuat tag `<link rel="icon">`. Google menampilkan favicon di hasil pencarian seluler.

---

## 6. Beranda — `src/app/(public)/page.tsx`

Beranda **tidak** menimpa `openGraph`, sehingga mewarisi OG dari root layout beserta gambarnya. Cukup title absolut dan canonical.

```tsx
import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/json-ld'
import { schoolJsonLd } from '@/lib/json-ld'
import { siteConfig } from '@/lib/seo'

export const metadata: Metadata = {
  // `absolute` melewati template "%s | SDIT Fajar Depok" agar tidak dobel
  title: { absolute: siteConfig.defaultTitle },
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={schoolJsonLd()} />
      {/* ...konten beranda yang sudah ada... */}
    </>
  )
}
```

---

## 7. SPMB — `src/app/(public)/spmb/page.tsx`

```tsx
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbJsonLd } from '@/lib/json-ld'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Pendaftaran Murid Baru (SPMB) Online',
  description:
    'Daftar murid baru SDIT Fajar Depok secara online: formulir 3 langkah, unggah bukti bayar, dan unduh kartu registrasi. Cek gelombang dan biaya pendaftaran.',
  path: '/spmb',
})

export default function SpmbPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Beranda', path: '/' },
          { name: 'SPMB Online', path: '/spmb' },
        ])}
      />
      {/* ...konten SPMB yang sudah ada... */}
    </>
  )
}
```

Halaman ini punya gambar OG sendiri di folder yang sama (`opengraph-image.tsx`, lihat `og.md`).

### Opsional: title dengan tahun ajaran dinamis

Tahun ajaran aktif disimpan di tabel `settings` (diubah admin). Title berisi tahun ajaran biasanya lebih relevan untuk pencarian ("SPMB 2026/2027"). Ganti `export const metadata` dengan `generateMetadata`:

```tsx
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
// ASUMSI: nama fungsi di bawah hanya contoh. Ganti dengan fungsi pembaca
// pengaturan SPMB yang sudah ada di repo (mis. di src/lib/actions atau supabase).
import { getActiveAcademicYear } from '@/lib/settings'

export async function generateMetadata(): Promise<Metadata> {
  const year = await getActiveAcademicYear().catch(() => null)
  return pageMetadata({
    title: year
      ? `SPMB ${year} – Pendaftaran Murid Baru Online`
      : 'Pendaftaran Murid Baru (SPMB) Online',
    description:
      'Daftar murid baru SDIT Fajar Depok secara online: formulir 3 langkah, unggah bukti bayar, dan unduh kartu registrasi. Cek gelombang dan biaya pendaftaran.',
    path: '/spmb',
  })
}
```

Jangan memasukkan tahun ajaran ke gambar OG statis, karena akan basi saat admin mengganti tahun ajaran.

---

## 8. Halaman Privat

### `/berhasil/[id]` — `src/app/(public)/berhasil/[id]/page.tsx`

```tsx
import type { Metadata } from 'next'

// Statis & generik. JANGAN pakai nama siswa / nomor registrasi / NIK di sini.
export const metadata: Metadata = {
  title: 'Pendaftaran Berhasil',
  robots: { index: false, follow: false, nocache: true },
}
```

Metadata hanya bisa diekspor dari Server Component. Jika `page.tsx` ini memakai `'use client'`, pindahkan logika klien ke komponen terpisah.

### `/admin/*` — `src/app/admin/layout.tsx`

Buat berkas ini jika belum ada, atau gabungkan ke layout yang sudah ada:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Panel Panitia SPMB',
    template: '%s | Panel SPMB',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

### `/admin/login` — `src/app/admin/login/page.tsx`

```tsx
export const metadata = { title: 'Masuk Panitia' }
```

---

## 9. Data Terstruktur (JSON-LD)

### `src/components/seo/json-ld.tsx`

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" agar string di dalam data tidak bisa menutup tag <script>
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

### `src/lib/json-ld.ts`

```ts
import { absoluteUrl, siteConfig, siteUrl } from './seo'

export function schoolJsonLd() {
  const a = siteConfig.address
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: absoluteUrl('/'),
        name: siteConfig.name,
        inLanguage: siteConfig.language,
        publisher: { '@id': `${siteUrl}/#school` },
      },
      {
        '@type': 'ElementarySchool',
        '@id': `${siteUrl}/#school`,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        alternateName: [siteConfig.shortName],
        description: siteConfig.description,
        slogan: siteConfig.motto,
        url: absoluteUrl('/'),
        logo: absoluteUrl(siteConfig.logoPath),
        image: absoluteUrl(siteConfig.logoPath),
        email: siteConfig.email,
        telephone: siteConfig.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: a.street,
          addressLocality: a.city,
          addressRegion: a.region,
          postalCode: a.postalCode,
          addressCountry: a.country,
        },
        sameAs: [siteConfig.instagram],
        // TODO setelah data tersedia:
        // geo: { '@type': 'GeoCoordinates', latitude: ..., longitude: ... },
        // openingHoursSpecification: [...],
      },
    ],
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
```

Isi data terstruktur harus sama persis dengan yang terlihat di halaman (alamat, telepon, email). Tambahkan `geo` dan `openingHoursSpecification` setelah koordinat dan jam operasional sekolah dipastikan.

---

## 10. Perayapan & Indeks

### `src/app/robots.ts`

```ts
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/berhasil/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
```

### `src/app/sitemap.ts`

```ts
import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

// Untuk halaman statis, nilai ini adalah waktu build.
const lastModified = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/spmb'), lastModified, changeFrequency: 'weekly', priority: 0.9 },
  ]
}
```

Jangan memasukkan `/admin`, `/berhasil/*`, atau tautan anchor (`/#visi-misi`) ke sitemap.

### Header `X-Robots-Tag` — `next.config.ts`

Lapisan pengaman tambahan di luar meta tag. Gabungkan ke konfigurasi yang sudah ada (sesuaikan jika berkasnya `next.config.mjs`):

```ts
import type { NextConfig } from 'next'

const noIndexHeaders = [
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/admin/:path*', headers: noIndexHeaders },
      { source: '/berhasil/:path*', headers: noIndexHeaders },
      { source: '/api/:path*', headers: noIndexHeaders },
    ]
  },
}

export default nextConfig
```

Catatan: halaman yang diblokir di `robots.txt` tidak akan dibaca ulang oleh Google, sehingga meta `noindex`-nya tidak terlihat. Untuk `/admin` dan `/berhasil` ini aman karena tidak ada tautan publik ke sana. Meta `noindex` + header tetap dipasang sebagai cadangan jika aturan robots suatu saat diubah.

---

## 11. Checklist SEO On-Page & Teknis

**Konten & struktur**
- [ ] Tepat satu `<h1>` per halaman. Beranda: nama sekolah + kata kunci utama (mis. "SDIT Fajar Depok").
- [ ] Hierarki heading berurutan (`h1` → `h2` → `h3`), tanpa lompat level.
- [ ] Landmark semantik: `<header>`, `<nav>`, `<main>`, `<footer>`.
- [ ] Alamat, telepon, dan email di footer sama persis dengan di JSON-LD dan Google Business Profile.
- [ ] Di halaman `/spmb`, sebut istilah "SPMB" dan sekali secara natural kata "PPDB" (mis. "SPMB, sebelumnya dikenal sebagai PPDB"), karena istilah lama masih banyak dicari orang tua.

**Gambar & performa (Core Web Vitals)**
- [ ] Semua gambar memakai `next/image` dengan `alt` deskriptif (bukan "gambar1"). Gambar dekoratif: `alt=""`.
- [ ] Gambar hero (elemen LCP) memakai `priority` dan `sizes` yang benar.
- [ ] Jangan beri animasi fade-in (`initial={{ opacity: 0 }}`) pada elemen LCP seperti judul hero. Itu menunda LCP.
- [ ] Iframe Google Maps di footer: `loading="lazy"` dan atribut `title`.
- [ ] Skrip Cloudflare Turnstile hanya dimuat saat tahap 3 formulir, bukan di semua halaman.
- [ ] Tombol WhatsApp melayang dan banner tidak menggeser tata letak (hindari CLS): beri ukuran tetap.
- [ ] Target Lighthouse (seluler): Performance ≥ 90, Accessibility ≥ 95, SEO = 100.

**Navigasi & tautan**
- [ ] Tautan internal memakai `<Link>` dari `next/link` (bukan `<a>`) agar crawlable dan cepat.
- [ ] Teks tautan deskriptif ("Daftar SPMB Online", bukan "klik di sini").
- [ ] Tombol CTA "Daftar" di beranda mengarah ke `/spmb`.

---

## 12. SEO Lokal & Off-Page

Untuk sekolah, pencarian "SD Islam dekat saya" dan "SDIT Depok" sangat dipengaruhi sinyal lokal.

1. **Google Business Profile**: klaim dan verifikasi profil "SDIT Fajar". Isi kategori (mis. *Sekolah Dasar Islam*), alamat, jam operasional, telepon, tautan situs (`/`), tautan pendaftaran (`/spmb`), foto kegiatan, dan balas ulasan.
2. **Konsistensi NAP** (Nama, Alamat, Telepon): tulis persis sama di situs, Google Business Profile, Instagram, dan direktori lain.
3. **Tautan masuk (backlink)**: cantumkan URL situs di bio Instagram `@sdit_fajar`, profil sekolah di direktori resmi pendidikan, situs yayasan/jaringan SDIT, dan berita kegiatan sekolah.
4. **Konten rutin**: berita kegiatan, prestasi tahfidz, pengumuman gelombang SPMB. Konten segar mendorong perayapan ulang.

---

## 13. Google Search Console & Bing

1. Daftarkan properti di [Google Search Console](https://search.google.com/search-console). Gunakan verifikasi DNS (properti domain), atau isi `NEXT_PUBLIC_GSC_VERIFICATION` untuk metode meta tag.
2. Kirim sitemap: `https://<domain>/sitemap.xml`.
3. Gunakan **URL Inspection** → *Request Indexing* untuk `/` dan `/spmb` setelah rilis.
4. Pantau laporan *Pages* (pastikan `/admin` dan `/berhasil` berstatus tidak diindeks), *Core Web Vitals*, dan *Performance* (kueri yang membawa pengunjung).
5. Impor properti ke **Bing Webmaster Tools** dari Search Console.

---

## 14. Pengujian

### Cek manual setelah build

```bash
pnpm build && pnpm start

# Title, description, canonical, robots
curl -s http://localhost:3000/ | grep -oiE '<title>[^<]*|<meta name="(description|robots)"[^>]*|<link rel="canonical"[^>]*'
curl -s http://localhost:3000/spmb | grep -oiE '<title>[^<]*|<link rel="canonical"[^>]*'

# Halaman privat harus noindex
curl -s http://localhost:3000/admin/login | grep -oiE '<meta name="robots"[^>]*'
curl -sI http://localhost:3000/admin/login | grep -i x-robots-tag

# robots.txt & sitemap
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/sitemap.xml
```

Validator eksternal:
- Rich Results Test: https://search.google.com/test/rich-results (uji URL produksi untuk JSON-LD)
- Schema Markup Validator: https://validator.schema.org
- PageSpeed Insights: https://pagespeed.web.dev

### Otomatis — `e2e/seo.spec.ts`

Sesuaikan lokasi dengan `testDir` di konfigurasi Playwright. Jalankan dengan `pnpm test:e2e`.

```ts
import { test, expect } from '@playwright/test'

const indexable = [
  { path: '/', title: /SDIT Fajar Depok/, canonical: /\/$/ },
  { path: '/spmb', title: /Pendaftaran Murid Baru|SPMB/, canonical: /\/spmb$/ },
]

const noindex = ['/admin/login']

for (const p of indexable) {
  test(`SEO dasar ${p.path}`, async ({ page }) => {
    await page.goto(p.path)

    await expect(page).toHaveTitle(p.title)
    await expect(page.locator('html')).toHaveAttribute('lang', 'id')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /^.{70,170}$/,
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', p.canonical)
    await expect(page.locator('h1')).toHaveCount(1) // sesuaikan bila halaman memang punya >1

    const noindexMeta = page.locator('meta[name="robots"][content*="noindex"]')
    expect(await noindexMeta.count()).toBe(0)
  })
}

for (const path of noindex) {
  test(`noindex ${path}`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  })
}

test('robots.txt memblokir area privat dan menunjuk sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt')
  expect(res.ok()).toBeTruthy()
  const body = await res.text()
  expect(body).toContain('Disallow: /admin')
  expect(body).toContain('Sitemap:')
})

test('sitemap hanya berisi halaman publik', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.ok()).toBeTruthy()
  const body = await res.text()
  expect(body).toContain('/spmb')
  expect(body).not.toContain('/admin')
  expect(body).not.toContain('/berhasil')
})
```

---

## 15. Rekomendasi Pengembangan Konten

Saat ini seluruh profil sekolah berada di satu halaman (`/`) dengan banyak bagian. Mesin pencari memberi peringkat per URL, jadi memecah bagian penting menjadi halaman sendiri membuka lebih banyak peluang kata kunci:

| Halaman usulan | Kata kunci sasaran |
|---|---|
| `/profil` (sejarah, visi-misi) | profil SDIT Fajar Depok, sejarah SDIT Fajar |
| `/program-tahfidz` | sekolah tahfidz Depok, program tahsin SD |
| `/kurikulum` | Kurikulum Merdeka SD Islam Terpadu |
| `/ekstrakurikuler` | ekskul Hizbul Wathan, panahan, futsal SD Depok |
| `/kontak` | alamat SDIT Fajar, SD Islam Tapos Depok |
| `/berita` | kegiatan SDIT Fajar, prestasi siswa |

Setiap halaman baru wajib: `pageMetadata()` + gambar OG (lihat `og.md`), entri di `sitemap.ts`, dan tautan dari navbar/footer.

---

## 16. Asumsi yang Perlu Dicek

Dokumentasi proyek tidak menyebut hal-hal berikut, jadi nilainya adalah tebakan yang perlu disesuaikan:

- `siteConfig.logoPath = '/logo.png'`: ganti dengan nama berkas logo sebenarnya di `/public`.
- `themeColor: '#065f46'`: ganti dengan warna utama brand.
- `getActiveAcademicYear` (bagian 7, opsional): ganti dengan fungsi pembaca pengaturan yang ada di repo.
- Domain produksi pada `.env`: contoh memakai `https://spmb.sditfajar.sch.id` dari dokumentasi. Jika beranda profil memakai domain lain, gunakan domain itu.
- `next.config.ts` dan lokasi `testDir` Playwright: sesuaikan dengan struktur repo.
- Koordinat peta dan jam operasional untuk JSON-LD belum tersedia.
