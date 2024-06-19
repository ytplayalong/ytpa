import CookieConsentBanner from "@/app/components/cookie";
import NavigationBar from "@/app/components/navbar";
import { Inter } from "next/font/google";
import { baseMetadata } from "../util/meta";

const inter = Inter({ subsets: ["latin"] });

export const metadata = baseMetadata;

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
