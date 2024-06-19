import CookieConsentBanner from "@/app/components/cookie";
import NavigationBar from "@/app/components/navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouTube Play-Along",
  description: "YouTube Play-Along Web Application",
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
