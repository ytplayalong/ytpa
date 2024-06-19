import CookieConsentBanner from "@/app/components/cookie";
import NavigationBar from "@/app/components/navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const baseData = {
  title: "YouTube Play-Along",
  description:
    "YouTube Play-Along Web Application. Sheet music synchronized with YouTube videos.",
};
const imgUrl =
  "https://raw.githubusercontent.com/ytplayalong/ytpa/b10db2fb142978d9126ca9c7869aaba4a2fd9479/next/public/Logo_120_63.png";

export const metadata: Metadata = {
  ...baseData,
  openGraph: {
    ...baseData,
    url: "https://ytpa.ch",
    siteName: "YTPA",
    type: "website",
    images: [
      {
        url: imgUrl,
        secureUrl: imgUrl,
        width: 1200,
        height: 630,
        alt: "Preview image for YTPA",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <CookieConsentBanner />
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}
