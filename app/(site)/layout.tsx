import type { Metadata, Viewport } from "next";
import { Figtree, JetBrains_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { PrefsProvider } from "@/components/PrefsProvider";
import { Marquee } from "@/components/Marquee";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShortcutsOverlay } from "@/components/Shortcuts";
import { SiteCursor } from "@/components/SiteCursor";
import { introInitScript, themeInitScript } from "@/lib/prefs";
import { IntroPreloader } from "@/components/IntroPreloader";
import { site } from "@/lib/content";

const display = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const sans = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} · Software engineer, Web & Mobile`, template: `${site.name} · %s` },
  description: site.bio,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0c" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: introInitScript }} />
      </head>
      <body
        className="min-h-screen overflow-x-clip bg-bg text-ink"
      >
        <PrefsProvider>
          <IntroPreloader label={site.name} />
          <Marquee />
          <Header />
          {children}
          <Footer />
          <ShortcutsOverlay />
          <SiteCursor />
        </PrefsProvider>
      </body>
    </html>
  );
}
