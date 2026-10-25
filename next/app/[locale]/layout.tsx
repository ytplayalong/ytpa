import { Inter } from "next/font/google";
import Link from "next/link";
import { MdCopyright } from "react-icons/md";

import CookieConsentBanner from "@/app/components/cookie";
import NavigationBar from "@/app/components/navbar";

// The generic fallbacks are also used where the web font is not available,
// e.g. in the popup of native selects (they would be shown in a serif font).
const inter = Inter({
  subsets: ["latin"],
  fallback: ["system-ui", "sans-serif"],
});

import { getMetadata, validLocale } from "../util/meta";

type LocaleParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocaleParams) {
  return getMetadata((await params).locale);
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode } & LocaleParams>) {
  const currentYear = new Date().getFullYear();
  const locale = validLocale((await params).locale);
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
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
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
            <MdCopyright /> <Link href="/">YTPA.ch</Link> {currentYear}
          </div>
        </div>
      </body>
    </html>
  );
}
