import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { getBaseUrl } from "@/lib/utils";
import { getSiteSettings } from "@/lib/data";
import { cookies } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = getBaseUrl();

  // No fallbacks - if settings is missing, these will be undefined or empty
  const name = settings?.name ?? "";
  const title = settings?.seoTitle ?? name;
  const description = settings?.seoDescription ?? settings?.heroBio ?? "";
  const keywords = settings?.seoKeywords
    ? settings.seoKeywords.split(",").map((k) => k.trim())
    : [];
  const ogImage = settings?.ogImage ?? `${baseUrl}/api/og?title=${encodeURIComponent(name)}`;

  return {
    title: {
      default: title,
      template: `%s | ${name}`,
    },
    description,
    metadataBase: new URL(baseUrl),
    keywords,
    authors: [{ name, url: baseUrl }],
    creator: name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title,
      description,
      siteName: name,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = getBaseUrl();
  const settings = await getSiteSettings();
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "dark";
  
  const name = settings?.name ?? "";
  const description = settings?.seoDescription ?? settings?.heroBio ?? "";

  const websiteSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: baseUrl,
    description,
  });

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-theme={theme} suppressHydrationWarning>
      <head>
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteSchema }}
        />
        <Script
          id="theme-color-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const colorThemes = {
                  "Amber": { light: "#b45309", dark: "#fbbf24" },
                  "Blue": { light: "#2563eb", dark: "#3b82f6" },
                  "Purple": { light: "#7c3aed", dark: "#8b5cf6" },
                  "Green": { light: "#059669", dark: "#10b981" },
                  "Red": { light: "#dc2626", dark: "#ef4444" },
                  "Pink": { light: "#db2777", dark: "#ec4899" },
                  "Orange": { light: "#ea580c", dark: "#f97316" },
                  "Teal": { light: "#0d9488", dark: "#14b8a6" },
                };
                function adjustColor(hex, amount) {
                  const num = parseInt(hex.replace("#", ""), 16);
                  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
                  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
                  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
                  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
                }
                const colorTheme = localStorage.getItem("colorTheme") || "Amber";
                const isDark = document.documentElement.dataset.theme === "dark";
                const theme = colorThemes[colorTheme];
                if (theme) {
                  const color = isDark ? theme.dark : theme.light;
                  document.documentElement.style.setProperty("--color-primary-val", color);
                  document.documentElement.style.setProperty("--color-primary-hover-val", adjustColor(color, -20));
                }
              } catch (e) {}
            `
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
