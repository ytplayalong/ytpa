import { Inter } from "next/font/google";
import Link from "next/link";
import { MdCopyright } from "react-icons/md";

import CookieConsentBanner from "@/app/components/cookie";
import CookieSettings from "@/app/components/cookieSettings";
import NavigationBar from "@/app/components/navbar";
import ServiceWorkerRegistration from "@/app/components/serviceWorker";
import { RESSOURCES } from "@/i18n";
import I18nProvider from "@/i18n/provider";

// The generic fallbacks are also used where the web font is not available,
// e.g. in the popup of native selects (they would be shown in a serif font).
const inter = Inter({
  subsets: ["latin"],
  fallback: ["system-ui", "sans-serif"],
});

import { getMetadata, SITE_NAME, SITE_URL, validLocale } from "../util/meta";

type LocaleParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocaleParams) {
  // The pages set their own canonical and language alternates
  return getMetadata((await params).locale, { noAlternates: true });
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode } & LocaleParams>) {
  const currentYear = new Date().getFullYear();
  const locale = validLocale((await params).locale);

  // Structured data about the site and the organization
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: locale,
        description: (RESSOURCES as any)[locale].translation.metaDescription,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "YTPA",
        url: SITE_URL,
        logo: `${SITE_URL}/android-chrome-512x512.png`,
      },
    ],
  }).replaceAll("<", "\\u003c");
  return (
    <html lang={locale}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <I18nProvider locale={locale}>
          <ServiceWorkerRegistration />
          <CookieConsentBanner />
          <NavigationBar />
          {children}
          <div className="container">
            <div
              style={{
                textAlign: "center",
                paddingTop: "2em",
                paddingBottom: "2em",
              }}
            >
              <MdCopyright /> <Link href="/">YTPA.ch</Link> {currentYear} · <CookieSettings />
            </div>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
