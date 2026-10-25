import { Metadata } from "next";

import { defaultLocale, LANGUAGES, RESSOURCES } from "@/i18n";

const title = "YouTube Play-Along";
const imgUrl =
  "https://raw.githubusercontent.com/ytplayalong/ytpa/b10db2fb142978d9126ca9c7869aaba4a2fd9479/next/public/Logo_120_63.png";

/** The locale if it is a supported one, else the default locale. */
export const validLocale = (locale: string | undefined) =>
  locale !== undefined && LANGUAGES.includes(locale) ? locale : defaultLocale;

/** Metadata (title, description, preview) in the language of the page. */
export const getMetadata = (locale?: string): Metadata => {
  const lang = validLocale(locale);
  const description = (RESSOURCES as any)[lang].translation.metaDescription;
  const baseData = { title, description };
  return {
    ...baseData,
    openGraph: {
      ...baseData,
      locale: lang,
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
};

export const baseMetadata = getMetadata();
