import type { Metadata, Viewport } from "next";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme";
import { siteConfig, siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "education",
  // JANGAN set `alternates.canonical` di sini agar tidak tertimpa ke semua sub-halaman
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1D4ED8", // Warna utama Playful Tactile SDIT Fajar
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.location.pathname;var clean=p.length>1&&p.endsWith('/')?p.slice(0,-1):p;var isLocked=clean===''||clean==='/'||clean==='/spmb'||clean.indexOf('/spmb/')===0;var theme='light';if(!isLocked){var stored=localStorage.getItem('theme');if(stored==='dark'||stored==='light'){theme=stored;}}var root=document.documentElement;root.setAttribute('data-theme',theme);if(theme==='dark'){root.classList.add('dark');root.classList.remove('light');root.style.colorScheme='dark';}else{root.classList.add('light');root.classList.remove('dark');root.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${plusJakartaSans.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
