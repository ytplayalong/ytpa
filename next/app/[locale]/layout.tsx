import CookieConsentBanner from "@/app/components/cookie";
import NavigationBar from "@/app/components/navbar";
import { Inter } from "next/font/google";
import { baseMetadata } from "../util/meta";
import { MdCopyright } from "react-icons/md";

const inter = Inter({ subsets: ["latin"] });

export const metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const currentYear = new Date().getFullYear();
  return (
    <html lang="en">
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
            <MdCopyright /> <a href="https://ytpa.ch">YTPA.ch</a> {currentYear}
          </div>
        </div>
      </body>
    </html>
  );
}
