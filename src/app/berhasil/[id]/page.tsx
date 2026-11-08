import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { CheckCircle2, MessageCircle, Home, AlertCircle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRegistrationState } from "@/lib/actions/registration-state";
import { SCHOOL_CONFIG } from "@/lib/config";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HomeNavbar, HomeFooter } from "@/components/home";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Pendaftaran Berhasil",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

interface BerhasilPageProps {
  params: Promise<{ id: string }>;
}

export default async function BerhasilPage({ params }: BerhasilPageProps) {
  const { id } = await params;

  // 1. Validasi UUID format
  const uuidParsed = z.string().uuid().safeParse(id);
  if (!uuidParsed.success) {
    notFound();
  }

  // 2. Ambil data minimal pendaftar via Supabase Admin
  const supabase = createAdminClient();
  const { data: registration, error } = await supabase
    .from("registrations")
    .select("id, reg_number, student_name, wave, status")
    .eq("id", id)
    .maybeSingle();

  if (error || !registration) {
    notFound();
  }

  // 3. Ambil data tahun ajaran aktif
  const regState = await getRegistrationState();
  const academicYear = regState.academicYear || SCHOOL_CONFIG.defaultAcademicYear;

  // 4. Siapkan pesan WhatsApp konfirmasi
  const waContact = SCHOOL_CONFIG.contacts.fadil;
  const waMessage = `Assalamu'alaikum Warahmatullahi Wabarakatuh, Panitia SPMB SDIT Fajar. Saya telah melakukan pendaftaran online atas nama *${registration.student_name}* dengan Nomor Registrasi: *${registration.reg_number}*. Mohon informasi verifikasinya. Terima kasih.`;
  const waUrl = `${waContact.waLink}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FF] text-[#0F172A] font-[family-name:var(--font-plus-jakarta)] selection:bg-[#FFDBCA] selection:text-[#783200]">
      {/* Ambient Organic Glows */}
      <div
        className="fixed -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#FFDBCA]/40 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="fixed top-1/2 -left-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#DCE1FF]/50 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Navbar Halaman Utama */}
      <HomeNavbar academicYear={academicYear} />

      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
        <div className="w-full max-w-xl mx-auto space-y-6 animate-enter">
          {/* Kartu Konfirmasi */}
          <div className="rounded-3xl bg-white border border-[#DAE2FD]/80 shadow-[0_8px_30px_rgba(29,78,216,0.06)] p-6 sm:p-8 text-center space-y-6">
            {/* Ikon Berhasil */}
            <div className="h-16 w-16 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto transition-transform">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] text-balance">
                Pendaftaran Berhasil Dikirim!
              </h1>
              <p className="text-sm text-[#434655] text-pretty max-w-md mx-auto">
                Alhamdulillah, formulir pendaftaran calon siswa baru {SCHOOL_CONFIG.name} telah kami terima dan masuk ke dalam antrean verifikasi panitia.
              </p>
            </div>

            {/* Kotak Nomor Registrasi */}
            <div className="bg-[#F2F3FF]/60 rounded-2xl p-5 border border-[#DAE2FD]/80 space-y-3 text-left">
              <div>
                <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                  Nomor Registrasi
                </span>
                <span className="font-mono font-extrabold text-2xl sm:text-3xl text-[#1D4ED8] tabular-nums tracking-wide block mt-0.5">
                  {registration.reg_number}
                </span>
              </div>

              <div className="pt-3 border-t border-[#DAE2FD]/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Nama Calon Siswa:</span>
                  <span className="font-bold text-[#0F172A] block">
                    {registration.student_name}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Gelombang Pendaftaran:</span>
                  <span className="font-semibold text-[#0F172A] block">
                    Gelombang {registration.wave}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Status Formulir:</span>
                <StatusBadge status={registration.status} />
              </div>
            </div>

            {/* Pengingat Simpan */}
            <div className="flex items-start gap-2.5 text-left bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-pretty font-medium">
                Harap simpan atau ambil tangkapan layar (screenshot) nomor registrasi di atas sebagai tanda bukti pendaftaran Anda.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="space-y-3 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] py-3 px-4 text-sm sm:text-base font-bold shadow-sm flex items-center justify-center gap-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 outline-none transition-all cursor-pointer select-none"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Konfirmasi via WhatsApp</span>
              </a>

              <Link
                href="/"
                className="w-full min-h-[44px] py-2.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 rounded-full bg-[#F2F3FF] text-[#0F172A] hover:bg-[#E2E7FF] border border-[#DAE2FD] transition-all cursor-pointer select-none"
              >
                <Home className="h-4 w-4" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>

          {/* Footer Kecil */}
          <p className="text-center text-xs text-slate-500 font-medium">
            Sistem Penerimaan Murid Baru (SPMB) {SCHOOL_CONFIG.fullName}
          </p>
        </div>
      </main>

      {/* Footer Resmi */}
      <HomeFooter />
    </div>
  );
}
