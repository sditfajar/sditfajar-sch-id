"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Field } from "@/components/ui/Field";
import { TextInput } from "@/components/ui/TextInput";
import { Textarea } from "@/components/ui/Textarea";
import { RadioChips } from "@/components/ui/RadioChips";
import { Button } from "@/components/ui/Button";
import type { RegistrationFormData } from "@/lib/validation/registration";

export function StepStudent() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const siblingsCount = watch("siblings_count");

  // State untuk menangani apakah opsi "Lainnya" dipilih pada radio chips
  const isCustomSiblings =
    siblingsCount !== undefined &&
    siblingsCount !== null &&
    (siblingsCount === 0 || siblingsCount > 5);

  const [customMode, setCustomMode] = React.useState<boolean>(false);
  const isCustomActive = customMode || isCustomSiblings;

  const siblingsRadioValue = React.useMemo(() => {
    if (isCustomActive) return "other";
    if (siblingsCount >= 1 && siblingsCount <= 5) return String(siblingsCount);
    return "";
  }, [siblingsCount, isCustomActive]);

  const handleSiblingsChange = (val: string) => {
    if (val === "other") {
      setCustomMode(true);
      if (siblingsCount === undefined || (siblingsCount >= 1 && siblingsCount <= 5)) {
        setValue("siblings_count", 0, { shouldValidate: true, shouldDirty: true });
      }
    } else {
      setCustomMode(false);
      setValue("siblings_count", parseInt(val, 10), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const todayStr = React.useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  return (
    <div className="space-y-5 text-left">
      {/* Nama Lengkap & Panggilan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field
          label="Nama Lengkap Siswa"
          required
          error={errors.student_name?.message}
          className="sm:col-span-2"
        >
          {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
            <TextInput
              id={id}
              {...register("student_name")}
              placeholder="Sesuai akta kelahiran"
              autoComplete="name"
              enterKeyHint="next"
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          )}
        </Field>

        <Field
          label="Nama Panggilan"
          required
          error={errors.student_nickname?.message}
        >
          {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
            <TextInput
              id={id}
              {...register("student_nickname")}
              placeholder="Contoh: Fatih"
              enterKeyHint="next"
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          )}
        </Field>
      </div>

      {/* Tempat & Tanggal Lahir */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Tempat Lahir"
          required
          error={errors.birth_place?.message}
        >
          {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
            <TextInput
              id={id}
              {...register("birth_place")}
              placeholder="Kota kelahiran, mis. Depok"
              enterKeyHint="next"
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          )}
        </Field>

        <Field
          label="Tanggal Lahir"
          required
          hint="Usia calon siswa antara 4 hingga 12 tahun"
          error={errors.birth_date?.message}
        >
          {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
            <TextInput
              id={id}
              type="date"
              max={todayStr}
              {...register("birth_date")}
              enterKeyHint="next"
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          )}
        </Field>
      </div>

      {/* Jenis Kelamin */}
      <Field
        label="Jenis Kelamin"
        required
        asGroup
        error={errors.gender?.message}
      >
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <RadioChips
              name="gender"
              value={field.value}
              onChange={field.onChange}
              className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap"
              itemClassName="w-full sm:w-auto text-center"
              options={[
                { value: "L", label: "Laki-laki" },
                { value: "P", label: "Perempuan" },
              ]}
            />
          )}
        />
      </Field>

      {/* Jumlah Saudara & Anak Ke- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <Field
          label="Jumlah Saudara Kandung"
          required
          asGroup
          hint="Tidak termasuk calon siswa"
          error={errors.siblings_count?.message}
        >
          <div className="space-y-2">
            <RadioChips
              name="siblings_count_chips"
              value={siblingsRadioValue}
              onChange={handleSiblingsChange}
              className="flex flex-wrap gap-2 w-full"
              itemClassName="min-w-[44px] justify-center"
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "5", label: "5" },
                { value: "other", label: "Lainnya" },
              ]}
            />
            {isCustomActive && (
              <div className="mt-2 flex items-center gap-2">
                <TextInput
                  type="number"
                  min="0"
                  max="20"
                  placeholder="Ketik 0 jika anak tunggal"
                  {...register("siblings_count", { valueAsNumber: true })}
                  className="w-full sm:max-w-xs"
                />
                <span className="text-xs text-muted shrink-0">orang</span>
              </div>
            )}
          </div>
        </Field>

        <Field
          label="Anak Ke-"
          required
          hint="Maksimal jumlah saudara + 1"
          error={errors.birth_order?.message}
        >
          {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
              <TextInput
                id={id}
                type="number"
                min="1"
                max="21"
                placeholder="Contoh: 1"
                {...register("birth_order", { valueAsNumber: true })}
                enterKeyHint="next"
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaInvalid}
              />
          )}
        </Field>
      </div>

      {/* No Telepon / HP */}
      <Field
        label="No. WhatsApp / HP yang Dapat Dihubungi"
        required
        hint="Contoh: 081234567890 (akan dinormalisasi)"
        error={errors.contact_phone?.message}
      >
        {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
          <TextInput
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="08xxxxxxxxxx"
            {...register("contact_phone")}
            enterKeyHint="next"
            aria-describedby={ariaDescribedby}
            aria-invalid={ariaInvalid}
          />
        )}
      </Field>

      {/* Alamat Lengkap Siswa */}
      <Field
        label="Alamat Lengkap Siswa"
        required
        hint="Cantumkan nama jalan, RT/RW, kelurahan, dan kecamatan"
        error={errors.student_address?.message}
      >
        {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
          <Textarea
            id={id}
            rows={3}
            placeholder="Alamat domisili tempat tinggal calon siswa saat ini..."
            {...register("student_address")}
            aria-describedby={ariaDescribedby}
            aria-invalid={ariaInvalid}
          />
        )}
      </Field>

      {/* Hobi Siswa */}
      <Field
        label="Hobi Siswa"
        required
        error={errors.hobby?.message}
      >
        {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
          <TextInput
            id={id}
            placeholder="Contoh: Membaca buku, robotik, renang"
            {...register("hobby")}
            enterKeyHint="next"
            aria-describedby={ariaDescribedby}
            aria-invalid={ariaInvalid}
          />
        )}
      </Field>

      {/* Prestasi Siswa & Tombol Cepat '-' */}
      <Field
        label="Prestasi Siswa yang Pernah Diraih"
        required
        hint="Lomba, tahfidz, akademis, seni, dll. Ketik '-' jika belum ada."
        error={errors.achievements?.message}
      >
        {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
          <div className="space-y-1.5">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setValue("achievements", "-", { shouldValidate: true, shouldDirty: true })}
                className="text-[11px] h-6 px-2.5 text-muted hover:text-foreground font-medium rounded-md"
              >
                Isi &quot;Tidak ada&quot; (-)
              </Button>
            </div>
            <Textarea
              id={id}
              rows={2}
              placeholder="Ketik prestasi atau tekan tombol di atas jika belum ada"
              {...register("achievements")}
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          </div>
        )}
      </Field>

      {/* Riwayat Penyakit Berat & Tombol Cepat '-' */}
      <Field
        label="Riwayat Penyakit Berat yang Pernah/Sedang Diderita"
        required
        hint="Alergi, asma, riwayat operasi, dll. Ketik '-' jika tidak ada."
        error={errors.medical_conditions?.message}
      >
        {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
          <div className="space-y-1.5">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setValue("medical_conditions", "-", { shouldValidate: true, shouldDirty: true })}
                className="text-[11px] h-6 px-2.5 text-muted hover:text-foreground font-medium rounded-md"
              >
                Isi &quot;Tidak ada&quot; (-)
              </Button>
            </div>
            <Textarea
              id={id}
              rows={2}
              placeholder="Ketik kondisi medis khusus atau tekan tombol di atas jika tidak ada"
              {...register("medical_conditions")}
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          </div>
        )}
      </Field>
    </div>
  );
}
