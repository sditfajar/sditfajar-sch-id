import { renderOg } from "@/lib/og";

export const alt = "Pendaftaran Murid Baru (SPMB) Online SDIT Fajar Depok";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    badge: "SPMB Online",
    title: "Pendaftaran Murid Baru",
    subtitle: "Isi formulir 3 langkah, unggah bukti bayar, dan unduh kartu registrasi.",
  });
}
