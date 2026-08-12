import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SITE_CONFIG } from "@/lib/site-config";

// Body/UI text — replaces Inter Tight.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Display/headline face — self-hosted because General Sans isn't on Google
// Fonts. Same display:swap + fallback discipline as the Google-served faces,
// so there's still no layout shift while it loads.
const generalSans = localFont({
  src: [
    { path: "./fonts/general-sans/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/general-sans/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/general-sans/GeneralSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/general-sans/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Legacy accent face, still used by the About page's one italic phrase until
// that page's own redesign phase lands — not part of the new type system,
// don't reach for it in new work.
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
// by ThemeToggle). Dark is the default now regardless of system preference
// (the redesign's primary theme); an explicit "light" cookie is the only
// way to opt out. Still flash-free: synchronous script ahead of any visible
// content, no server cookies() read needed.
const THEME_INIT_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);var t=m?decodeURIComponent(m[1]):null;if(t!=="light"){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${generalSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
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
        <Analytics />
      </body>
    </html>
  );
}
