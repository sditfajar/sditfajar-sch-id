"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useFormContext, Controller } from "react-hook-form";
import { CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { CopyButton } from "@/components/ui/CopyButton";
import { UploadProof } from "@/components/registration/UploadProof";
import { ReviewSummary } from "@/components/registration/ReviewSummary";
import type { RegistrationFormData } from "@/lib/validation/registration";
import type { PaymentSettings } from "@/lib/actions/registration-state";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((m) => m.Turnstile),
  {
    ssr: false,
    loading: () => (
      <div className="h-[65px] flex items-center justify-center text-xs text-slate-500">
        Memuat verifikasi keamanan...
      </div>
    ),
  }
);

export interface StepPaymentProps {
  onEditStep: (stepNumber: number) => void;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  paymentSettings?: PaymentSettings;
  onTurnstileSuccess: (token: string) => void;
  onTurnstileExpire: () => void;
  onTurnstileError: () => void;
  turnstileError?: string | null;
  uploadProgressText?: string | null;
}

/**
 * Format nominal Rupiah
 */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function StepPayment({
  onEditStep,
  file,
  onFileSelect,
  paymentSettings,
  onTurnstileSuccess,
  onTurnstileExpire,
  onTurnstileError,
  turnstileError,
  uploadProgressText,
}: StepPaymentProps) {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const currentValues = getValues();

  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  const bankName = paymentSettings?.bank || "Bank Syariah Indonesia (BSI)";
  const accountNo = paymentSettings?.accountNo || "712-345-6789";
  const accountName = paymentSettings?.accountName || "SDIT Fajar SPMB";
  const amount = paymentSettings?.amount ?? 250000;

  return (
    <div className="space-y-6 text-left">
      {/* 1. Kartu Rekening Pembayaran */}
      <div className="rounded-3xl bg-white border border-[#DAE2FD]/80 shadow-[0_4px_20px_rgba(29,78,216,0.03)] p-3.5 sm:p-5 md:p-6 transition-all">
        <div className="flex items-center gap-2.5 mb-3 text-[#1D4ED8]">
          <div className="h-8 w-8 rounded-xl bg-[#FFDBCA] text-[#9D4300] flex items-center justify-center shadow-2xs">
            <CreditCard className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-extrabold text-[#0F172A]">
            Instruksi Pembayaran Biaya Formulir
          </h4>
        </div>
        <p className="text-xs text-[#434655] mb-3 text-pretty">
          Silakan lakukan transfer biaya pendaftaran formulir ke nomor rekening resmi SDIT Fajar berikut:
        </p>

        <div className="bg-[#F2F3FF] rounded-2xl p-3.5 sm:p-4 space-y-2.5 border border-[#DAE2FD] text-xs">
          <div className="flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="text-[#434655] font-medium">Bank Tujuan:</span>
            <span className="font-bold text-[#0F172A]">{bankName}</span>
          </div>
          <div className="flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="text-[#434655] font-medium">Nomor Rekening:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-[#0F172A] tabular-nums text-sm sm:text-base">
                {accountNo}
              </span>
              <CopyButton text={accountNo} />
            </div>
          </div>
          <div className="flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="text-[#434655] font-medium">Atas Nama:</span>
            <span className="font-semibold text-slate-800">{accountName}</span>
          </div>
          <div className="flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap pt-2 border-t border-[#DAE2FD]">
            <span className="text-[#434655] font-medium">Nominal Biaya:</span>
            <span className="font-black text-[#1D4ED8] tabular-nums text-base sm:text-lg">
              {formatRupiah(amount)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Upload Bukti Bayar */}
      <div className="space-y-2.5 rounded-3xl bg-white border border-[#DAE2FD]/80 shadow-[0_4px_20px_rgba(29,78,216,0.03)] p-3.5 sm:p-5 md:p-6">
        <div className="text-sm font-extrabold text-[#0F172A] flex items-center justify-between">
          <span>
            Unggah Foto Bukti Transfer <span className="text-red-500">*</span>
          </span>
        </div>
        <UploadProof
          file={file}
          onFileSelect={onFileSelect}
          error={errors.payment_proof_file?.message as string | undefined}
        />

        {/* Indikator Progres Indeterminate */}
        {uploadProgressText && (
          <div className="flex items-center gap-2 text-xs text-[#1D4ED8] bg-blue-50/80 p-2.5 rounded-xl border border-blue-200 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-[#1D4ED8] animate-ping" />
            <span className="font-semibold">{uploadProgressText}</span>
          </div>
        )}
      </div>

      {/* 3. Ringkasan Isian */}
      <div className="space-y-2 pt-1">
        <h4 className="text-sm font-extrabold text-[#0F172A]">
          Periksa Kembali Data Anda
        </h4>
        <p className="text-xs text-[#434655] text-pretty">
          Pastikan semua informasi sudah benar sebelum mengirimkan pendaftaran.
        </p>
        <ReviewSummary data={currentValues} onEditStep={onEditStep} />
      </div>

      {/* 4. Pernyataan Persetujuan & PDP */}
      <div className="rounded-3xl bg-white border border-[#DAE2FD]/80 shadow-[0_4px_20px_rgba(29,78,216,0.03)] p-3.5 sm:p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-2.5 text-[#10B981]">
          <div className="h-8 w-8 rounded-xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center shadow-2xs">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-extrabold text-[#0F172A]">
            Pernyataan Kebenaran Data &amp; Privasi
          </h4>
        </div>

        <Controller
          name="consented"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="consent-checkbox"
              checked={field.value === true}
              onChange={(e) => field.onChange(e.target.checked ? true : false)}
              error={!!errors.consented}
              label={
                <span className="text-xs font-semibold text-[#0F172A] leading-relaxed">
                  Saya menyatakan data yang diisi benar dan menyetujui data ini diproses oleh
                  SDIT Fajar untuk keperluan SPMB.
                </span>
              }
              description="Data yang Anda berikan dilindungi sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi dan hanya digunakan untuk keperluan seleksi SPMB SDIT Fajar."
            />
          )}
        />

        {errors.consented && (
          <div
            role="alert"
            className="text-xs text-red-600 font-medium flex items-center gap-1.5 pt-1"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errors.consented.message}</span>
          </div>
        )}
      </div>

      {/* 5. Cloudflare Turnstile */}
      <div className="pt-2 flex flex-col items-center justify-center min-h-[75px]">
        <Turnstile
          siteKey={siteKey}
          onSuccess={onTurnstileSuccess}
          onExpire={onTurnstileExpire}
          onError={onTurnstileError}
          options={{
            theme: "light",
            size: "flexible",
          }}
        />

        {turnstileError && (
          <div
            role="alert"
            className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{turnstileError}</span>
          </div>
        )}
      </div>

      {/* Honeypot anti-spam tersembunyi */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website-url">Biarkan kolom ini kosong</label>
        <input
          id="website-url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>
    </div>
  );
}
