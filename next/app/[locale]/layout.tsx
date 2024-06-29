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
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <CookieConsentBanner />
        <NavigationBar />
        {children}
        <div
          className="container"
          style={{ margin: 0, textAlign: "center", padding: "2em 0 2em 0" }}
        >
          <MdCopyright /> <a href="https://ytpa.ch">YTPA.ch</a> {currentYear}
        </div>
      </body>
    </html>
  );
}
