import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk Panitia",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
