import { Metadata } from "next";

const baseData = {
  title: "YouTube Play-Along",
  description:
    "Sheet music synchronized with YouTube videos for you to play along with your favorite musical instrument.",
};
const imgUrl =
  "https://raw.githubusercontent.com/ytplayalong/ytpa/b10db2fb142978d9126ca9c7869aaba4a2fd9479/next/public/Logo_120_63.png";

export const baseMetadata: Metadata = {
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
