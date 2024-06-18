import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/globals.css";
import NavigationBar from "./components/navbar";
import CookieConsentBanner from "./components/cookie";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouTube Play-Along",
  description: "YouTube Play-Along Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <CookieConsentBanner />
        <NavigationBar />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
