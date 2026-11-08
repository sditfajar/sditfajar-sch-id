import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Panel Panitia SPMB",
    template: "%s | Panel SPMB",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

