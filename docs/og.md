# OpenGraph — Website Resmi & SPMB SDIT Fajar Depok

Panduan implementasi OpenGraph (pratinjau tautan) untuk seluruh halaman proyek (Next.js 16 App Router). Dokumen pendamping: [`seo.md`](./seo.md). Helper `pageMetadata()` dan `siteConfig` yang dipakai di sini didefinisikan di `seo.md` bagian 4.

Hasil akhirnya: saat tautan situs dibagikan di **WhatsApp** (kanal utama wali murid), Facebook, Telegram, LinkedIn, atau X, muncul kartu berisi gambar 1200×630, judul, dan deskripsi yang rapi dan konsisten.

---

## 1. Spesifikasi

| Properti | Nilai | Catatan |
|---|---|---|
| `og:image` | 1200 × 630 px (rasio 1,91:1) | PNG atau JPG. Pertahankan di bawah 300 KB agar WhatsApp mau menampilkannya |
| `og:title` | ≤ 60–70 karakter | Sudah termasuk nama sekolah |
| `og:description` | 100–160 karakter | Sama dengan meta description |
| `og:type` | `website` | |
| `og:locale` | `id_ID` | |
| `og:site_name` | `SDIT Fajar Depok` | |
| `og:url` | URL absolut halaman | Dari `metadataBase` + path |
| `og:image:alt` | Deskripsi gambar | Dari `export const alt` |
| `twitter:card` | `summary_large_image` | X memakai `og:image` jika `twitter:image` tidak ada |

Zona aman gambar: sisakan margin ≥ 60 px di semua sisi. Sebagian aplikasi memotong tepi dan membulatkan sudut.

---

## 2. Peta OG Semua Halaman

| Rute | Judul OG | Gambar OG | Sumber |
|---|---|---|---|
| `/` | SDIT Fajar Depok – Sekolah Islam Terpadu Tahfidz Qur'an | Gambar default (motto sekolah) | Root layout + `src/app/opengraph-image.tsx` |
| `/spmb` | Pendaftaran Murid Baru (SPMB) Online \| SDIT Fajar Depok | Gambar khusus SPMB | `pageMetadata()` + `src/app/(public)/spmb/opengraph-image.tsx` |
| `/berhasil/[id]` | Mewarisi default | Mewarisi default | Root layout. **Tanpa data pribadi** |
| `/admin/login` | Mewarisi default | Mewarisi default | Root layout. Halaman noindex |
| `/admin/*` | Mewarisi default | Mewarisi default | Root layout. Halaman noindex |
| 404 | Mewarisi default | Mewarisi default | Root layout |

Aturan penentu:

- **Halaman yang memakai `openGraph` sendiri** (seperti `/spmb`) harus punya `opengraph-image.tsx` **di folder yang sama**. Next.js menimpa objek `openGraph` dari induk secara utuh, jadi ini cara paling aman agar `og:image` tidak hilang.
- **Halaman yang tidak menyentuh `openGraph`** (beranda, `/berhasil`, admin) otomatis mewarisi OG dari root layout beserta gambarnya.
- Gambar OG untuk `/berhasil/[id]` **sengaja generik**. Nama siswa, nomor registrasi, dan NIK tidak boleh muncul di gambar atau teks OG, karena tautan itu bisa diteruskan ke orang lain.

---

## 3. Berkas yang Dibuat

```
public/
└── logo.png                                  # ASUMSI: logo persegi, min. 256x256 (sudah ada?)
src/
├── assets/fonts/
│   ├── PlusJakartaSans-Medium.ttf            # BARU (opsional tapi disarankan)
│   └── PlusJakartaSans-ExtraBold.ttf         # BARU (opsional tapi disarankan)
├── app/
│   ├── opengraph-image.tsx                   # BARU: gambar default (beranda & fallback)
│   └── (public)/spmb/opengraph-image.tsx     # BARU: gambar halaman SPMB
└── lib/og.tsx                                # BARU: template & helper
e2e/og.spec.ts                                # BARU: pengujian otomatis
```

Metadata OG di root layout dan `/spmb` sudah dibahas di `seo.md` (bagian 5 dan 7). Berkas ini fokus pada gambarnya.

---

## 4. Aset: Font & Logo

**Font.** Situs memakai *Plus Jakarta Sans*. Agar gambar OG senada, unduh berkas **TTF** dari Google Fonts (lisensi OFL) dan simpan:

- `src/assets/fonts/PlusJakartaSans-Medium.ttf`
- `src/assets/fonts/PlusJakartaSans-ExtraBold.ttf`

Format yang didukung generator gambar hanya TTF, OTF, dan WOFF. **WOFF2 tidak didukung.** Jika berkas font tidak ditemukan, template otomatis memakai font bawaan sehingga build tidak gagal.

**Logo.** Taruh logo persegi (PNG, minimal 256×256) di `public/logo.png`. Jika berkas tidak ada, gambar tetap dibuat tanpa logo.

---

## 5. Template — `src/lib/og.tsx`

```tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { siteUrl } from '@/lib/seo'

// ASUMSI: sesuaikan dengan palet warna brand sekolah
export const brand = {
  bgFrom: '#064e3b',
  bgTo: '#047857',
  accent: '#facc15',
  text: '#ffffff',
  muted: '#d1fae5',
} as const

type OgInput = {
  title: string
  subtitle?: string
  /** Label kecil berbentuk pil di atas judul, mis. "SPMB Online" */
  badge?: string
}

const readAsset = (relativePath: string) => readFile(join(process.cwd(), relativePath))

async function loadFonts() {
  try {
    const [medium, extraBold] = await Promise.all([
      readAsset('src/assets/fonts/PlusJakartaSans-Medium.ttf'),
      readAsset('src/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    ])
    return [
      { name: 'Plus Jakarta Sans', data: medium, weight: 500 as const, style: 'normal' as const },
      { name: 'Plus Jakarta Sans', data: extraBold, weight: 800 as const, style: 'normal' as const },
    ]
  } catch {
    return [] // pakai font bawaan
  }
}

async function loadLogo() {
  try {
    const file = await readAsset('public/logo.png')
    return `data:image/png;base64,${file.toString('base64')}`
  } catch {
    return null
  }
}

export async function renderOg({ title, subtitle, badge }: OgInput) {
  const [fonts, logo] = await Promise.all([loadFonts(), loadLogo()])
  const host = new URL(siteUrl).host

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          color: brand.text,
          fontFamily: fonts.length ? 'Plus Jakarta Sans' : undefined,
          background: `linear-gradient(135deg, ${brand.bgFrom} 0%, ${brand.bgTo} 100%)`,
        }}
      >
        {/* Kepala: logo + nama sekolah */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              width={88}
              height={88}
              alt=""
              style={{ borderRadius: 20, marginRight: 24 }}
            />
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 36, fontWeight: 800 }}>SDIT Fajar Depok</div>
            <div style={{ display: 'flex', fontSize: 24, color: brand.muted }}>
              Sekolah Dasar Islam Terpadu
            </div>
          </div>
        </div>

        {/* Isi: badge, judul, subjudul */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {badge ? (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                padding: '8px 24px',
                marginBottom: 24,
                borderRadius: 999,
                background: brand.accent,
                color: '#3f2d00',
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {badge}
            </div>
          ) : null}
          <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: 'flex',
                marginTop: 20,
                fontSize: 32,
                lineHeight: 1.35,
                color: brand.muted,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Kaki: domain + garis aksen */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 26,
            color: brand.muted,
          }}
        >
          <div style={{ display: 'flex' }}>{host}</div>
          <div
            style={{ display: 'flex', width: 160, height: 8, borderRadius: 4, background: brand.accent }}
          />
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  )
}
```

Aturan template (batasan generator gambar):

- Setiap `<div>` yang punya lebih dari satu anak wajib `display: 'flex'`. Itu sebabnya hampir semua elemen di atas memilikinya.
- Hanya subset CSS yang didukung: flexbox ya, **CSS grid tidak**.
- Gambar harus berupa data URI atau URL absolut (itulah alasan logo dibaca sebagai base64).
- Jangan set `export const runtime = 'edge'` pada berkas `opengraph-image`. Template membaca berkas lokal lewat `node:fs`, yang butuh runtime Node.js (bawaan).

---

## 6. Gambar Default — `src/app/opengraph-image.tsx`

Dipakai beranda dan semua halaman yang tidak punya gambar sendiri.

```tsx
import { renderOg } from '@/lib/og'

export const alt =
  "SDIT Fajar Depok - Membina Generasi Qur'ani yang Cerdas, Mandiri, dan Berakhlak Mulia"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return renderOg({
    title: "Membina Generasi Qur'ani",
    subtitle: 'Cerdas, Mandiri, dan Berakhlak Mulia',
  })
}
```

`size` dan `contentType` sengaja ditulis sebagai nilai literal, bukan impor dari helper, supaya Next.js dapat membacanya saat build.

---

## 7. Gambar SPMB — `src/app/(public)/spmb/opengraph-image.tsx`

```tsx
import { renderOg } from '@/lib/og'

export const alt = 'Pendaftaran Murid Baru (SPMB) Online SDIT Fajar Depok'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return renderOg({
    badge: 'SPMB Online',
    title: 'Pendaftaran Murid Baru',
    subtitle: 'Isi formulir 3 langkah, unggah bukti bayar, dan unduh kartu registrasi.',
  })
}
```

Gambar ini statis (dibuat saat build). Sengaja **tidak memuat tahun ajaran, gelombang, atau biaya**, karena nilai itu diubah admin lewat `/admin/pengaturan` dan gambar akan basi.

Metadata teksnya diisi lewat `pageMetadata()` di `src/app/(public)/spmb/page.tsx` (lihat `seo.md` bagian 7). Jangan menulis `images` secara manual di sana. Berkas `opengraph-image.tsx` otomatis menambahkan `og:image`, `og:image:width`, `og:image:height`, dan `og:image:alt`.

---

## 8. Halaman Lain: `/berhasil/[id]` dan `/admin/*`

Tidak perlu berkas OG tambahan. Mereka mewarisi OG default dari root layout. Yang penting:

1. Jangan mengekspor `openGraph` di halaman-halaman ini. Mengekspornya menimpa warisan dan memaksa Anda menambah `opengraph-image` sendiri.
2. Jangan membuat `opengraph-image` dinamis yang membaca data pendaftar (nama, nomor registrasi, NIK). Gambar OG bersifat publik bagi siapa pun yang memegang tautannya, tanpa login.
3. Status `noindex` pada halaman-halaman ini diatur di `seo.md` (bagian 8). OG tetap berfungsi untuk pratinjau saat tautan dibagikan, tetapi halaman tidak muncul di hasil pencarian.

---

## 9. Menambah Halaman Baru

Untuk setiap halaman publik baru (mis. `/program-tahfidz`):

1. Di `page.tsx`, pakai `pageMetadata({ title, description, path })`.
2. Buat `opengraph-image.tsx` di folder yang sama dengan menyalin berkas SPMB, lalu ubah `alt`, `badge`, `title`, `subtitle`.
3. Tambahkan URL ke `src/app/sitemap.ts`.
4. Tambahkan rute ke daftar uji di `e2e/og.spec.ts`.

Jika tidak ingin membuat gambar khusus, halaman cukup tidak mendefinisikan `openGraph` dan akan memakai gambar default. Dengan cara ini, `og:title` dan `og:description` tetap milik root layout, bukan milik halaman.

---

## 10. Pengujian

### Cek manual

```bash
pnpm build && pnpm start

curl -s http://localhost:3000/ | grep -oiE '<meta property="og:[^>]*'
curl -s http://localhost:3000/spmb | grep -oiE '<meta property="og:[^>]*'

# Gambar harus 200, image/png, dan idealnya < 300 KB
curl -sI http://localhost:3000/opengraph-image | grep -iE 'HTTP|content-type|content-length'
```

URL gambar sebenarnya diambil dari tag `og:image` di HTML (Next.js dapat menambah suffix hash), jadi salin nilainya dari hasil `curl` pertama.

### Otomatis — `e2e/og.spec.ts`

Sesuaikan lokasi dengan `testDir` Playwright. Pastikan `NEXT_PUBLIC_SITE_URL` saat pengujian sama dengan `baseURL` Playwright, karena `og:image` berupa URL absolut dari `metadataBase`.

```ts
import { test, expect } from '@playwright/test'

const pages = ['/', '/spmb', '/admin/login']

for (const path of pages) {
  test(`OpenGraph lengkap di ${path}`, async ({ page, request }) => {
    await page.goto(path)
    const og = (prop: string) => page.locator(`meta[property="${prop}"]`)

    await expect(og('og:title')).toHaveAttribute('content', /SDIT Fajar/)
    await expect(og('og:description')).toHaveAttribute('content', /.+/)
    await expect(og('og:type')).toHaveAttribute('content', 'website')
    await expect(og('og:locale')).toHaveAttribute('content', 'id_ID')
    await expect(og('og:site_name')).toHaveAttribute('content', 'SDIT Fajar Depok')
    await expect(og('og:image:width')).toHaveAttribute('content', '1200')
    await expect(og('og:image:height')).toHaveAttribute('content', '630')
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    )

    // Gambar benar-benar bisa diunduh, bertipe PNG, dan cukup ringan untuk WhatsApp
    const imageUrl = await og('og:image').getAttribute('content')
    expect(imageUrl).toMatch(/^https?:\/\//)
    const res = await request.get(imageUrl!)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
    expect((await res.body()).length).toBeLessThan(300 * 1024)
  })
}
```

Halaman `/berhasil/[id]` tidak ikut diuji di sini karena butuh id pendaftaran valid. Cukup periksa manual satu kali bahwa `og:title` dan `og:image` ada dan tidak memuat data pribadi.

### Validator pratinjau tautan

- **WhatsApp**: kirim tautan ke chat sendiri atau grup uji. WhatsApp menyimpan cache pratinjau cukup lama, jadi pengujian ulang di tautan yang sama sering menampilkan versi lama. Gunakan tautan dengan query berbeda (mis. `/spmb?v=2`) saat menguji perubahan.
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/ (tombol *Scrape Again* untuk membersihkan cache).
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **opengraph.xyz**: pratinjau multi-platform sekaligus.

---

## 11. Pemecahan Masalah

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| `og:image` tidak ada di satu halaman | Halaman itu mengekspor `openGraph` sendiri tanpa `opengraph-image` di foldernya | Buat `opengraph-image.tsx` di folder halaman, atau hapus `openGraph` dari halaman |
| `og:image` berisi `localhost` | `NEXT_PUBLIC_SITE_URL` salah di environment produksi | Set ke domain final di Vercel, lalu redeploy |
| Pratinjau tidak muncul di WhatsApp | Gambar terlalu besar, URL tidak bisa diakses publik, atau cache lama | Cek ukuran < 300 KB, buka URL gambar di jendela privat, uji dengan query baru |
| Teks gambar memakai font standar | Berkas font tidak ditemukan atau formatnya WOFF2 | Pastikan TTF ada di `src/assets/fonts/` dengan nama persis seperti di `og.tsx` |
| Gambar tanpa logo | `public/logo.png` tidak ada | Tambahkan logo atau ubah path di `loadLogo()` |
| Build error "Only flex supported" atau layout berantakan | `<div>` dengan banyak anak tanpa `display: 'flex'` | Tambahkan `display: 'flex'` pada elemen itu |
| Judul terpotong atau meluber | Teks terlalu panjang untuk 68 px | Persingkat judul (maks. ± 40 karakter), pindahkan sisanya ke subjudul |

---

## 12. Checklist Rilis

- [ ] `NEXT_PUBLIC_SITE_URL` di produksi sudah berupa domain final.
- [ ] `og:image` di `/` dan `/spmb` dapat dibuka langsung, bertipe PNG, dan < 300 KB.
- [ ] Tidak ada data pribadi di gambar atau teks OG pada `/berhasil/[id]`.
- [ ] Judul ≤ 60–70 karakter dan deskripsi 100–160 karakter di semua halaman publik.
- [ ] Uji tautan `/` dan `/spmb` di WhatsApp, Facebook Debugger, dan LinkedIn Post Inspector.
- [ ] `pnpm lint`, `pnpm typecheck`, dan `pnpm test:e2e` lolos.
- [ ] Halaman baru yang ditambahkan nanti sudah mengikuti langkah di bagian 9.

---

## 13. Asumsi yang Perlu Dicek

Dokumentasi proyek tidak menyebut hal-hal berikut, jadi nilainya adalah tebakan:

- `public/logo.png`: nama dan format berkas logo.
- Palet warna di `brand` (hijau tua + emas): ganti dengan warna resmi sekolah.
- Berkas font Plus Jakarta Sans harus diunduh dan diletakkan manual.
- Teks gambar ("Membina Generasi Qur'ani", subjudul SPMB) bisa disesuaikan dengan kebutuhan humas sekolah.
