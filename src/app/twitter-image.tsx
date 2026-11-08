import { renderOg } from "@/lib/og";

export const alt =
  "SDIT Fajar Depok - Membina Generasi Qur'ani yang Cerdas, Mandiri, dan Berakhlak Mulia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    title: "Membina Generasi Qur'ani",
    subtitle: "Cerdas, Mandiri, dan Berakhlak Mulia",
  });
}
