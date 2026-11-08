"use client";

import * as React from "react";
import { Edit3, User, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EDUCATION_OPTIONS, type RegistrationFormData } from "@/lib/validation/registration";
import { formatIdPhone } from "@/lib/phone";

export interface ReviewSummaryProps {
  data: Partial<RegistrationFormData>;
  onEditStep: (stepNumber: number) => void;
  className?: string;
}

export function ReviewSummary({ data, onEditStep, className }: ReviewSummaryProps) {
  const getEducationLabel = (val?: string) => {
    return EDUCATION_OPTIONS.find((opt) => opt.value === val)?.label || val || "-";
  };

  const getGenderLabel = (g?: string) => {
    if (g === "L") return "Laki-laki";
    if (g === "P") return "Perempuan";
    return "-";
  };

  return (
    <div className={`space-y-4 text-left ${className || ""}`}>
      {/* Bagian Data Siswa */}
      <div className="rounded-3xl bg-white border border-[#DAE2FD]/80 shadow-[0_4px_20px_rgba(29,78,216,0.03)] p-3.5 sm:p-5 transition-all">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#E2E7FF] text-[#1D4ED8] flex items-center justify-center shadow-2xs">
              <User className="h-4 w-4" aria-hidden="true" />
            </div>
            <h4 className="text-sm font-extrabold text-[#0F172A]">Data Calon Siswa</h4>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditStep(1)}
            className="text-xs min-h-[36px] h-8 text-[#1D4ED8] border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 font-bold px-3 rounded-xl shadow-2xs"
            aria-label="Ubah data calon siswa"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            Ubah
          </Button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
          <div>
            <dt className="text-slate-500 font-medium">Nama Lengkap</dt>
            <dd className="font-bold text-[#0F172A] text-sm mt-0.5">
              {data.student_name || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Nama Panggilan</dt>
            <dd className="text-slate-800 font-medium mt-0.5">{data.student_nickname || "-"}</dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Tempat, Tanggal Lahir</dt>
            <dd className="text-slate-800 font-medium mt-0.5 tabular-nums">
              {data.birth_place ? `${data.birth_place}, ` : ""}
              {data.birth_date || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Jenis Kelamin</dt>
            <dd className="text-slate-800 font-medium mt-0.5">{getGenderLabel(data.gender)}</dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Anak Ke / Jumlah Saudara</dt>
            <dd className="text-slate-800 font-medium mt-0.5 tabular-nums">
              Anak ke-{data.birth_order ?? "-"} dari {data.siblings_count ?? 0} bersaudara
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">No. WhatsApp / HP</dt>
            <dd className="text-slate-800 font-semibold mt-0.5 tabular-nums">
              {data.contact_phone ? formatIdPhone(data.contact_phone) : "-"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500 font-medium">Alamat Tempat Tinggal</dt>
            <dd className="text-slate-800 font-medium mt-0.5 text-pretty leading-relaxed">
              {data.student_address || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Hobi</dt>
            <dd className="text-slate-800 font-medium mt-0.5">{data.hobby || "-"}</dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Prestasi</dt>
            <dd className="text-slate-800 font-medium mt-0.5">{data.achievements || "-"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500 font-medium">Riwayat Penyakit Berat</dt>
            <dd className="text-slate-800 font-medium mt-0.5">{data.medical_conditions || "-"}</dd>
          </div>
        </dl>
      </div>

      {/* Bagian Data Orang Tua */}
      <div className="rounded-3xl bg-white border border-[#DAE2FD]/80 shadow-[0_4px_20px_rgba(29,78,216,0.03)] p-3.5 sm:p-5 transition-all">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#FFDBCA] text-[#9D4300] flex items-center justify-center shadow-2xs">
              <Users className="h-4 w-4" aria-hidden="true" />
            </div>
            <h4 className="text-sm font-extrabold text-[#0F172A]">Data Orang Tua</h4>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditStep(2)}
            className="text-xs min-h-[36px] h-8 text-[#1D4ED8] border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 font-bold px-3 rounded-xl shadow-2xs"
            aria-label="Ubah data orang tua"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            Ubah
          </Button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
          <div>
            <dt className="text-slate-500 font-medium">Nama Ayah</dt>
            <dd className="font-bold text-[#0F172A] text-sm mt-0.5">
              {data.father_name || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Pendidikan Ayah</dt>
            <dd className="text-slate-800 font-medium mt-0.5">
              {getEducationLabel(data.father_education)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Pekerjaan Ayah</dt>
            <dd className="text-slate-800 font-medium mt-0.5">{data.father_job || "-"}</dd>
          </div>
          <div className="border-t border-slate-100 pt-2 sm:border-0 sm:pt-0">
            <dt className="text-slate-500 font-medium">Nama Ibu</dt>
            <dd className="font-bold text-[#0F172A] text-sm mt-0.5">
              {data.mother_name || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Pendidikan Ibu</dt>
            <dd className="text-slate-800 font-medium mt-0.5">
              {getEducationLabel(data.mother_education)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Pekerjaan Ibu</dt>
            <dd className="text-slate-800 font-medium mt-0.5">{data.mother_job || "-"}</dd>
          </div>
          <div className="sm:col-span-2 pt-1 border-t border-slate-100">
            <dt className="text-slate-500 font-medium">Alamat Orang Tua</dt>
            <dd className="text-slate-800 font-medium mt-0.5 text-pretty leading-relaxed">
              {data.parent_address || "-"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
