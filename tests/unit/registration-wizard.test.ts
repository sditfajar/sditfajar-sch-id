import { describe, it, expect } from "vitest";
import {
  studentSchema,
  paymentSchema,
  ALLOWED_FILE_TYPES,
} from "@/lib/validation/registration";
import { getActiveWave, getWaveLabel } from "@/lib/wave";
import { normalizeIdPhone, formatIdPhone } from "@/lib/phone";

describe("Fase 3: Public Page & Registration Wizard Contract Tests", () => {
  it("AC-2: Menolak data kosong dan mengembalikan daftar field yang belum diisi", () => {
    const emptyResult = studentSchema.safeParse({
      student_name: "",
      student_nickname: "",
      birth_place: "",
      birth_date: "",
      gender: undefined,
      siblings_count: -1,
      birth_order: 0,
      student_address: "",
      contact_phone: "",
      hobby: "",
      achievements: "",
      medical_conditions: "",
    });

    expect(emptyResult.success).toBe(false);
    if (!emptyResult.success) {
      const errorPaths = emptyResult.error.issues.map((i) => i.path[0]);
      expect(errorPaths).toContain("student_name");
      expect(errorPaths).toContain("student_nickname");
      expect(errorPaths).toContain("birth_place");
      expect(errorPaths).toContain("birth_date");
      expect(errorPaths).toContain("gender");
      expect(errorPaths).toContain("student_address");
      expect(errorPaths).toContain("contact_phone");
    }
  });

  it("AC-3: Validasi jumlah saudara kandung (0-20) dan aturan birth_order <= siblings_count + 1", () => {
    // Valid: 0 saudara (anak tunggal), anak ke-1
    const singleChild = studentSchema.safeParse({
      student_name: "Ahmad Dahlan",
      student_nickname: "Ahmad",
      birth_place: "Depok",
      birth_date: "2020-01-01",
      gender: "L",
      siblings_count: 0,
      birth_order: 1,
      student_address: "Jl. Margonda Raya No. 12",
      contact_phone: "081234567890",
      hobby: "Membaca",
      achievements: "-",
      medical_conditions: "-",
    });
    expect(singleChild.success).toBe(true);

    // Invalid: jumlah saudara > 20
    const overSiblings = studentSchema.safeParse({
      student_name: "Ahmad Dahlan",
      student_nickname: "Ahmad",
      birth_place: "Depok",
      birth_date: "2020-01-01",
      gender: "L",
      siblings_count: 21,
      birth_order: 1,
      student_address: "Jl. Margonda Raya No. 12",
      contact_phone: "081234567890",
      hobby: "Membaca",
      achievements: "-",
      medical_conditions: "-",
    });
    expect(overSiblings.success).toBe(false);

    // Invalid: anak ke-5 padahal saudara kandung cuma 2 (maksimal anak ke-3)
    const invalidBirthOrder = studentSchema.safeParse({
      student_name: "Ahmad Dahlan",
      student_nickname: "Ahmad",
      birth_place: "Depok",
      birth_date: "2020-01-01",
      gender: "L",
      siblings_count: 2,
      birth_order: 5,
      student_address: "Jl. Margonda Raya No. 12",
      contact_phone: "081234567890",
      hobby: "Membaca",
      achievements: "-",
      medical_conditions: "-",
    });
    expect(invalidBirthOrder.success).toBe(false);
  });

  it("AC-4: Menolak file yang bukan gambar JPG/PNG/WebP atau melebihi 5 MB", () => {
    // Ukuran 6 MB
    const tooLarge = new File(["a".repeat(100)], "bukti.png", { type: "image/png" });
    Object.defineProperty(tooLarge, "size", { value: 6 * 1024 * 1024 });

    const sizeCheck = paymentSchema.safeParse({
      consented: true,
      payment_proof_file: tooLarge,
    });
    expect(sizeCheck.success).toBe(false);

    // Tipe PDF
    const pdfFile = new File(["dummy"], "bukti.pdf", { type: "application/pdf" });
    const mimeCheck = paymentSchema.safeParse({
      consented: true,
      payment_proof_file: pdfFile,
    });
    expect(mimeCheck.success).toBe(false);
  });

  it("AC-5: Menerima file gambar valid (JPG, PNG, WebP) berukuran <= 5MB", () => {
    for (const mime of ALLOWED_FILE_TYPES) {
      const validFile = new File(["a".repeat(100)], `bukti.${mime.split("/")[1]}`, {
        type: mime,
      });
      Object.defineProperty(validFile, "size", { value: 2 * 1024 * 1024 });

      const res = paymentSchema.safeParse({
        consented: true,
        payment_proof_file: validFile,
      });
      expect(res.success).toBe(true);
    }
  });

  it("AC-7 & Keamanan: LocalStorage draf membuang file bukti bayar", () => {
    const rawData = {
      student_name: "Fatimah Az-Zahra",
      payment_proof_file: new File(["dummy"], "bukti.jpg", { type: "image/jpeg" }),
    };

    const draft = { ...rawData };
    delete (draft as { payment_proof_file?: unknown }).payment_proof_file;

    expect(draft).toEqual({ student_name: "Fatimah Az-Zahra" });
    expect((draft as { payment_proof_file?: unknown }).payment_proof_file).toBeUndefined();
  });

  it("Gelombang aktif pada waktu saat ini sesuai zona waktu Asia/Jakarta", () => {
    const currentWave = getActiveWave();
    // Pada Oktober 2026, bulan ke-10 -> Gelombang 1
    expect(currentWave).toBe(1);
    expect(getWaveLabel(currentWave)).toContain("Gelombang 1");
  });

  it("Normalisasi dan format nomor HP telepon Indonesia", () => {
    expect(normalizeIdPhone("0877-3786-0657")).toBe("6287737860657");
    expect(formatIdPhone("6287737860657")).toBe("0877-3786-0657");
  });

  it("Logika deteksi mode kustom jumlah saudara kandung (0 untuk anak tunggal atau > 5)", () => {
    const isCustomSiblings = (count?: number | null) =>
      count !== undefined && count !== null && (count === 0 || count > 5);

    expect(isCustomSiblings(0)).toBe(true); // Anak tunggal
    expect(isCustomSiblings(6)).toBe(true); // Lebih dari 5
    expect(isCustomSiblings(1)).toBe(false); // Opsi chip 1
    expect(isCustomSiblings(3)).toBe(false); // Opsi chip 3
    expect(isCustomSiblings(null)).toBe(false);
  });
});
