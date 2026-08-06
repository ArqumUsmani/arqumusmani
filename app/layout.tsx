import type { Metadata, Viewport } from "next";
import { Inter_Tight, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SpecRail } from "@/components/layout/SpecRail";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SITE_CONFIG } from "@/lib/site-config";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Single-weight display serif, italic only — reserved for the one-off accent
// phrases on the About sections. Not part of the type scale, don't reach for
// it elsewhere.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/notes/rss.xml",
    },
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    type: "website",
    locale: SITE_CONFIG.locale,
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

// Runs before first paint, before hydration — reads the `theme` cookie (set
// by ThemeToggle) and falls back to system preference. This is what makes
// dark mode flash-free without making every static page dynamic: no server
// cookies() read, just a synchronous script ahead of any visible content.
const THEME_INIT_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);var t=m?decodeURIComponent(m[1]):null;if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <SmoothScroll />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-16 bg-ink px-4 py-3 font-mono text-mono-label uppercase text-paper transition-transform duration-300 focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        {/* tabIndex={-1}: an anchor jump to #main-content scrolls to a <main>
            but never focuses it (only naturally-focusable elements receive
            DOM focus), which strands keyboard users right back at the skip
            link on the next Tab. This makes it a valid, one-time focus target. */}
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
        <SpecRail />
        <Analytics />
      </body>
    </html>
  );
}
