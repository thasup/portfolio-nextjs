import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import {
  sarabun,
  fraunces,
  instrumentSerif,
  inter,
  jetbrainsMono,
} from "@/lib/fonts";
import { ThemeProvider } from "next-themes";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { ChatbaseScript } from "@/components/ChatbaseScript";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ModalProvider } from "@/components/modal/ModalContext";
import { ModalShell } from "@/components/modal/ModalShell";
import { siteConfig } from "@/data/siteConfig";
import { Toaster } from "sonner";
import "@/styles/globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    title: {
      default: `${siteConfig.name} — ${t("title")}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: t("description"),
    metadataBase: new URL(siteConfig.siteUrl),
    openGraph: {
      title: `${siteConfig.name} — ${t("title")}`,
      description: t("description"),
      url: siteConfig.siteUrl,
      siteName: siteConfig.name,
      type: "website",
      locale: locale === "th" ? "th_TH" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${t("title")}`,
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const chatbaseEmbedId = process.env.NEXT_PUBLIC_CHATBASE_EMBED_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID;

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} ${sarabun.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`app antialiased ${
          locale === "th" ? "font-sarabun leading-loose" : ""
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>
              <ScrollProgress />
              <Navbar />
              <main className="app-inner">{children}</main>
              <Footer />
              <ModalShell />
              <Toaster
                position="top-center"
                richColors
                closeButton
                toastOptions={{
                  style: {
                    background: "var(--color-canvas)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-ink)",
                  },
                }}
              />
              <Analytics />
            </ModalProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
        {chatbaseEmbedId && <ChatbaseScript embedId={chatbaseEmbedId} />}
      </body>
    </html>
  );
}
