import type { Metadata, Viewport } from "next";
import { Inter_Tight, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SpecRail } from "@/components/layout/SpecRail";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ausmani.com"),
  title: {
    default: "Arqum Usmani — Lead Product Designer & UI/UX Engineer",
    template: "%s · Arqum Usmani",
  },
  description:
    "Lead Product Designer and UI/UX Engineer based in Islamabad, Pakistan. 5+ years across healthcare, AI products, and SaaS — designing systems and writing the production front-end code that ships them.",
  openGraph: {
    title: "Arqum Usmani — Lead Product Designer & UI/UX Engineer",
    description:
      "Lead Product Designer and UI/UX Engineer based in Islamabad, Pakistan. 5+ years across healthcare, AI products, and SaaS.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-16 bg-ink px-4 py-3 font-mono text-mono-label uppercase text-paper transition-transform duration-300 focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <SpecRail />
      </body>
    </html>
  );
}
