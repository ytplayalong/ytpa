import "./globals.css";

import { baseMetadata } from "./util/meta";

export const metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is needed somehow. But do not place body / html tags here.
  return children;
}
