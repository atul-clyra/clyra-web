import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const SITE_URL = "https://heyclyra.com";
const TITLE = "Clyra | Plan it. Teach it. Know who got it.";
const DESCRIPTION =
  "Clyra connects the lesson, the homework and the result, then builds the next step for every student.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Clyra",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Clyra: the teaching and learning loop, closed" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@heyclyra",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0C120F",
  colorScheme: "dark",
};

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clyra",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  email: "hi@heyclyra.com",
  description: "The teaching and learning loop for modern schools.",
  sameAs: [
    "https://www.instagram.com/heyclyra",
    "https://www.tiktok.com/@heyclyra",
    "https://www.linkedin.com/company/heyclyra",
    "https://x.com/heyclyra",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${instrumentSerif.variable} ${plexMono.variable}`}>
      <head>
        <link rel="preload" href="/assets/world/scene-01-poster.webp" as="image" type="image/webp" />
        <script
          type="application/ld+json"
          // Static, build-time JSON; no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
        />
      </head>
      <body className="c-body-root">{children}</body>
    </html>
  );
}
