"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Stepper, type StepItem } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StepStudent } from "@/components/registration/StepStudent";
import { StepParent } from "@/components/registration/StepParent";
import { StepPayment } from "@/components/registration/StepPayment";
import {
  registrationSchema,
  ALLOWED_FILE_TYPES,
  type RegistrationFormData,
} from "@/lib/validation/registration";
import { createClient } from "@/lib/supabase/client";
import { requestUploadUrl } from "@/lib/actions/upload";
import { createRegistration } from "@/lib/actions/registration";
import type { PaymentSettings } from "@/lib/actions/registration-state";

const DRAFT_STORAGE_KEY = "SPMB:draft:v1";

const STEPS: StepItem[] = [
  { number: 1, title: "Data Calon Siswa", shortTitle: "Siswa" },
  { number: 2, title: "Data Orang Tua", shortTitle: "Orang Tua" },
  { number: 3, title: "Pembayaran & Konfirmasi", shortTitle: "Bayar" },
];

const STEP_1_FIELDS: (keyof RegistrationFormData)[] = [
  "student_name",
  "student_nickname",
  "birth_place",
  "birth_date",
  "gender",
  "siblings_count",
  "birth_order",
  "student_address",
  "contact_phone",
  "hobby",
  "achievements",
  "medical_conditions",
];

const STEP_2_FIELDS: (keyof RegistrationFormData)[] = [
  "father_name",
  "mother_name",
  "father_education",
  "mother_education",
  "father_job",
  "mother_job",
  "parent_address",
];

interface UploadedProofCache {
  fileSignature: string;
  path: string;
  mime: string;
  size: number;
}

export interface RegistrationWizardProps {
  paymentSettings?: PaymentSettings;
}

export function RegistrationWizard({ paymentSettings }: RegistrationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [paymentFile, setPaymentFile] = React.useState<File | null>(null);
  const [uploadedProof, setUploadedProof] = React.useState<UploadedProofCache | null>(null);
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const [turnstileError, setTurnstileError] = React.useState<string | null>(null);
  const [uploadProgressText, setUploadProgressText] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [stepErrorSummary, setStepErrorSummary] = React.useState<string | null>(null);

  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as unknown as Resolver<RegistrationFormData>,
    mode: "onTouched",
    defaultValues: {
      student_name: "",
      student_nickname: "",
      birth_place: "",
      birth_date: "",
      gender: undefined,
      siblings_count: 1,
      birth_order: 1,
      student_address: "",
      contact_phone: "",
      hobby: "",
      achievements: "-",
      medical_conditions: "-",
      father_name: "",
      mother_name: "",
      father_education: undefined,
      mother_education: undefined,
      father_job: "",
      mother_job: "",
      parent_address: "",
      consented: false as unknown as true,
      honeypot: "",
    },
  });

  const {
    trigger,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { isDirty },
  } = methods;

  // 1. Memulihkan draf dari localStorage saat pertama kali dimuat
  React.useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object") {
          // Isi kembali kolom form kecuali objek file
          Object.entries(parsed).forEach(([key, val]) => {
            if (key !== "payment_proof_file" && key !== "honeypot" && val !== undefined) {
              setValue(key as keyof RegistrationFormData, val as never, {
                shouldValidate: false,
                shouldDirty: false,
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn("[SPMB] Gagal memulihkan draf form:", e);
    }
  }, [setValue]);

  // 2. Auto-save draf formulir ke localStorage (tanpa file) via subscription
  React.useEffect(() => {
    const subscription = watch((formValues) => {
      if (!isDirty || isSubmitting) return;

      const dataToSave: Record<string, unknown> = { ...formValues };
      delete dataToSave.payment_proof_file;
      delete dataToSave.honeypot;

      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (e) {
        console.warn("[SPMB] Penyimpanan draf penuh:", e);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, isDirty, isSubmitting]);

  // 3. Peringatan browser saat tab ingin ditutup bila ada perubahan belum tersimpan
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  // Callback pemilihan berkas bukti bayar
  const handleFileSelect = (file: File | null) => {
    setPaymentFile(file);
    if (!file || (uploadedProof && uploadedProof.fileSignature !== `${file.name}-${file.size}-${file.lastModified}`)) {
      setUploadedProof(null);
    }
    setValue("payment_proof_file", file as unknown as File, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Navigasi ke langkah berikutnya dengan validasi per langkah
  const handleNextStep = async () => {
    setStepErrorSummary(null);

    if (currentStep === 1) {
      const isValid = await trigger(STEP_1_FIELDS);
      if (!isValid) {
        setStepErrorSummary("Harap periksa kembali isian data calon siswa bertanda merah.");
        const firstErrorEl = document.querySelector("[aria-invalid='true']");
        firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      const isValid = await trigger(STEP_2_FIELDS);
      if (!isValid) {
        setStepErrorSummary("Harap lengkapi seluruh data orang tua kandung / wali yang wajib diisi.");
        const firstErrorEl = document.querySelector("[aria-invalid='true']");
        firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Navigasi mundur ke langkah sebelumnya
  const handlePrevStep = () => {
    setStepErrorSummary(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Lompat langsung ke langkah yang sudah pernah diisi
  const handleEditStep = (stepNumber: number) => {
    setStepErrorSummary(null);
    if (stepNumber >= 1 && stepNumber <= 3) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Callback token Turnstile
  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setTurnstileError(null);
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken(null);
    setTurnstileError("Sesi verifikasi keamanan kadaluarsa. Silakan centang kembali.");
  };

  const handleTurnstileError = () => {
    setTurnstileToken(null);
    setTurnstileError("Gagal memverifikasi Turnstile. Silakan muat ulang halaman.");
  };

  // Handler submit utama form pendaftaran (Langkah 3)
  const onSubmit: SubmitHandler<RegistrationFormData> = async (formData) => {
    setStepErrorSummary(null);
    setTurnstileError(null);

    // 1. Validasi keberadaan file bukti pembayaran
    if (!paymentFile && !uploadedProof) {
      setError("payment_proof_file", {
        type: "manual",
        message: "Bukti transfer pembayaran formulir wajib diunggah.",
      });
      setStepErrorSummary("Bukti transfer pembayaran formulir wajib diunggah.");
      return;
    }

    // 2. Validasi token keamanan Turnstile
    if (!turnstileToken) {
      setTurnstileError("Silakan selesaikan verifikasi keamanan Turnstile di bawah.");
      setStepErrorSummary("Silakan selesaikan verifikasi keamanan Turnstile sebelum mengirim.");
      return;
    }

    setIsSubmitting(true);

    try {
      let proofResult: UploadedProofCache;

      if (uploadedProof) {
        proofResult = uploadedProof;
      } else {
        const fileToUpload = paymentFile!;
        setUploadProgressText("Menyiapkan saluran unggah aman...");

        const uploadInit = await requestUploadUrl({
          mime: fileToUpload.type,
          size: fileToUpload.size,
        });

        if (!uploadInit.success || !uploadInit.data) {
          throw new Error(uploadInit.message || "Gagal mendapatkan izin unggah berkas.");
        }

        const { path, token } = uploadInit.data;
        setUploadProgressText("Mengunggah foto bukti transfer...");

        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .uploadToSignedUrl(path, token, fileToUpload, {
            contentType: fileToUpload.type,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Gagal mengunggah ke penyimpanan: ${uploadError.message}`);
        }

        proofResult = {
          fileSignature: `${fileToUpload.name}-${fileToUpload.size}-${fileToUpload.lastModified}`,
          path,
          mime: fileToUpload.type,
          size: fileToUpload.size,
        };
        setUploadedProof(proofResult);
      }

      setUploadProgressText("Menyimpan data pendaftaran ke sistem...");

      const submitResult = await createRegistration({
        student_name: formData.student_name,
        student_nickname: formData.student_nickname,
        birth_place: formData.birth_place,
        birth_date: formData.birth_date,
        gender: formData.gender,
        siblings_count: formData.siblings_count,
        birth_order: formData.birth_order,
        student_address: formData.student_address,
        contact_phone: formData.contact_phone,
        hobby: formData.hobby,
        achievements: formData.achievements,
        medical_conditions: formData.medical_conditions,
        father_name: formData.father_name,
        mother_name: formData.mother_name,
        father_education: formData.father_education,
        mother_education: formData.mother_education,
        father_job: formData.father_job,
        mother_job: formData.mother_job,
        parent_address: formData.parent_address,
        consented: true,
        honeypot: formData.honeypot,
        payment_proof_path: proofResult.path,
        payment_proof_mime: proofResult.mime as (typeof ALLOWED_FILE_TYPES)[number],
        payment_proof_size: proofResult.size,
        turnstile_token: turnstileToken,
      });

      if (!submitResult.success || !submitResult.id) {
        throw new Error(submitResult.message || "Pendaftaran gagal diproses oleh server.");
      }

      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (e) {
        console.warn("Gagal membersihkan draf:", e);
      }

      router.push(`/berhasil/${submitResult.id}`);
    } catch (err: unknown) {
      console.error("[SPMB] Submit Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan sistem yang tidak terduga.";
      setStepErrorSummary(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadProgressText(null);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="relative w-full"
      >
        {/* Indikator Progres Langkah */}
        <div className="mb-6">
          <Stepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step < currentStep) {
                handleEditStep(step);
              }
            }}
          />
        </div>

        {/* Ringkasan Pesan Error jika Ada Masalah */}
        {stepErrorSummary && (
          <Alert
            role="alert"
            variant="destructive"
            className="mb-5 border-red-200 bg-red-50 text-red-700 text-xs font-semibold flex items-start gap-2.5"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <AlertDescription>{stepErrorSummary}</AlertDescription>
          </Alert>
        )}

        {/* Konten Langkah Aktif */}
        <div className="min-h-[400px] transition-opacity duration-200">
          {currentStep === 1 && <StepStudent />}
          {currentStep === 2 && <StepParent />}
          {currentStep === 3 && (
            <StepPayment
              onEditStep={handleEditStep}
              file={paymentFile}
              onFileSelect={handleFileSelect}
              paymentSettings={paymentSettings}
              onTurnstileSuccess={handleTurnstileSuccess}
              onTurnstileExpire={handleTurnstileExpire}
              onTurnstileError={handleTurnstileError}
              turnstileError={turnstileError}
              uploadProgressText={uploadProgressText}
            />
          )}
        </div>

        {/* Tombol Aksi di Bawah Form (Playful Tactile Stitch: tombol chunky 3D) */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center gap-3">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={isSubmitting}
              iconLeft={<ArrowLeft className="h-4 w-4" />}
              aria-label="Kembali ke form sebelumnya"
              className="w-full sm:w-auto h-12 px-6 rounded-2xl border-2 border-slate-200 bg-white text-[#0F172A] font-bold shadow-[0_3px_0_#cbd5e1] hover:bg-slate-50 active:translate-y-0.5 active:shadow-[0_1px_0_#cbd5e1] transition-all cursor-pointer"
            >
              <span>Sebelumnya</span>
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              type="button"
              variant="default"
              onClick={handleNextStep}
              iconRight={<ArrowRight className="h-4 w-4" />}
              aria-label={
                currentStep === 1
                  ? "Lanjut ke data orang tua"
                  : "Lanjut ke form pembayaran dan konfirmasi"
              }
              className={cn(
                "w-full sm:w-auto h-12 px-7 rounded-2xl bg-[#1D4ED8] hover:brightness-105 text-white font-bold shadow-[0_4px_0_#173fa8] active:translate-y-1 active:shadow-[0_1px_0_#173fa8] transition-all sm:ml-auto cursor-pointer",
                currentStep === 1 ? "sm:min-w-[220px]" : "sm:min-w-[180px]"
              )}
            >
              <span>
                {currentStep === 1 ? "Lanjut ke Data Orang Tua" : "Lanjut"}
              </span>
            </Button>
          ) : (
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              disabled={isSubmitting}
              iconRight={!isSubmitting ? <Send className="h-4 w-4" /> : undefined}
              aria-label="Kirim formulir pendaftaran SPMB"
              className="w-full sm:w-auto sm:ml-auto h-12 px-8 rounded-2xl bg-[#F97316] hover:brightness-105 text-[#0F172A] font-extrabold shadow-[0_4px_0_#9d4300] active:translate-y-1 active:shadow-[0_1px_0_#9d4300] transition-all cursor-pointer text-sm sm:text-base"
            >
              Kirim Pendaftaran
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
