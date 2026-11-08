"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { User, Heart } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { TextInput } from "@/components/ui/TextInput";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { EDUCATION_OPTIONS, type RegistrationFormData } from "@/lib/validation/registration";

export function StepParent() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const studentAddress = watch("student_address");
  const parentAddress = watch("parent_address");

  const [sameAddressChecked, setSameAddressChecked] = React.useState<boolean>(() => {
    return !!studentAddress && studentAddress === parentAddress;
  });

  const handleSameAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSameAddressChecked(isChecked);
    if (isChecked) {
      setValue("parent_address", studentAddress || "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Data Ayah */}
      <div className="space-y-4 rounded-3xl bg-white border border-[#DAE2FD]/80 shadow-[0_4px_20px_rgba(29,78,216,0.03)] p-3.5 sm:p-5 md:p-6">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
          <div className="h-8 w-8 rounded-xl bg-[#E2E7FF] text-[#1D4ED8] flex items-center justify-center shadow-2xs">
            <User className="h-4 w-4" aria-hidden="true" />
          </div>
          <h4 className="text-sm font-extrabold text-[#0F172A]">
            Data Ayah Kandung / Wali
          </h4>
        </div>

        <Field
          label="Nama Lengkap Ayah"
          required
          error={errors.father_name?.message}
        >
          {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
            <TextInput
              id={id}
              {...register("father_name")}
              placeholder="Sesuai KTP / KK"
              autoComplete="name"
              enterKeyHint="next"
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          )}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Pendidikan Tertinggi Ayah"
            required
            error={errors.father_education?.message}
          >
            {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
              <Select
                id={id}
                placeholder="Pilih tingkat pendidikan..."
                options={EDUCATION_OPTIONS}
                {...register("father_education")}
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaInvalid}
              />
            )}
          </Field>

          <Field
            label="Pekerjaan Ayah"
            required
            error={errors.father_job?.message}
          >
            {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
              <TextInput
                id={id}
                {...register("father_job")}
                placeholder="Contoh: Karyawan Swasta, PNS, Wiraswasta"
                enterKeyHint="next"
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaInvalid}
              />
            )}
          </Field>
        </div>
      </div>

      {/* Data Ibu */}
      <div className="space-y-4 rounded-3xl bg-white border border-[#DAE2FD]/80 shadow-[0_4px_20px_rgba(29,78,216,0.03)] p-3.5 sm:p-5 md:p-6">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
          <div className="h-8 w-8 rounded-xl bg-[#FFE2EC] text-[#BE123C] flex items-center justify-center shadow-2xs">
            <Heart className="h-4 w-4" aria-hidden="true" />
          </div>
          <h4 className="text-sm font-extrabold text-[#0F172A]">
            Data Ibu Kandung
          </h4>
        </div>

        <Field
          label="Nama Lengkap Ibu"
          required
          error={errors.mother_name?.message}
        >
          {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
            <TextInput
              id={id}
              {...register("mother_name")}
              placeholder="Sesuai KTP / KK"
              autoComplete="name"
              enterKeyHint="next"
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          )}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Pendidikan Tertinggi Ibu"
            required
            error={errors.mother_education?.message}
          >
            {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
              <Select
                id={id}
                placeholder="Pilih tingkat pendidikan..."
                options={EDUCATION_OPTIONS}
                {...register("mother_education")}
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaInvalid}
              />
            )}
          </Field>

          <Field
            label="Pekerjaan Ibu"
            required
            error={errors.mother_job?.message}
          >
            {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
              <TextInput
                id={id}
                {...register("mother_job")}
                placeholder="Contoh: Ibu Rumah Tangga, Guru, Dokter"
                enterKeyHint="next"
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaInvalid}
              />
            )}
          </Field>
        </div>
      </div>

      {/* Alamat Orang Tua */}
      <div className="space-y-4 rounded-3xl bg-white border border-[#DAE2FD]/80 shadow-[0_4px_20px_rgba(29,78,216,0.03)] p-3.5 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#FFDBCA] text-[#9D4300] flex items-center justify-center shadow-2xs">
              <User className="h-4 w-4" aria-hidden="true" />
            </div>
            <h4 className="text-sm font-extrabold text-[#0F172A]">
              Alamat Tempat Tinggal Orang Tua
            </h4>
          </div>

          {/* Opsi Samakan Alamat dengan Calon Siswa */}
          <Checkbox
            id="same-address-checkbox"
            checked={sameAddressChecked}
            onChange={handleSameAddressToggle}
            label={
              <span className="text-xs font-semibold text-slate-700">
                Sama dengan alamat calon siswa
              </span>
            }
            className="py-0 min-h-0"
          />
        </div>

        <Field
          label="Alamat Lengkap Orang Tua"
          required
          hint="Cantumkan nama jalan, RT/RW, kelurahan, dan kecamatan"
          error={errors.parent_address?.message}
        >
          {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
            <Textarea
              id={id}
              rows={3}
              placeholder="Alamat domisili orang tua saat ini..."
              {...register("parent_address")}
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          )}
        </Field>
      </div>
    </div>
  );
}
