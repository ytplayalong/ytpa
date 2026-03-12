import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is needed somehow. But do not place body / html tags here.
  return children;
}

export { baseMetadata as metadata } from "./util/meta";
