import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Commercial & Residential Cleaning in Vermont`,
    template: `%s · ${site.name}`,
  },
  description:
    "Commercial janitorial, carpet extraction, floor care and residential cleaning across Burlington and the Champlain Valley. Free quotes and written scopes of work.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    url: site.url,
  },
  robots: { index: true, follow: true },
};

/**
 * Applies the stored theme before first paint so there is no flash of the
 * wrong colour scheme. Runs synchronously and is intentionally tiny.
 */
const themeScript = `(function(){try{var s=localStorage.getItem("cvc-theme");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
