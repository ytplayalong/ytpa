import { Metadata } from "next";

import { defaultLocale, LANGUAGES, RESSOURCES } from "@/i18n";

export const SITE_URL = "https://ytpa.ch";
export const SITE_NAME = "YouTube Play-Along";

// Preview image (Open Graph / Twitter), a file in public/
const previewImage = {
  url: "/Logo_120_63.png",
  width: 1479,
  height: 777,
  alt: "Preview image for YTPA",
};

// Language and country of the languages for Open Graph
const ogLocales: { [lang: string]: string } = {
  en: "en_US",
  es: "es_ES",
  de: "de_DE",
};

/** The locale if it is a supported one, else the default locale. */
export const validLocale = (locale: string | undefined) =>
  locale !== undefined && LANGUAGES.includes(locale) ? locale : defaultLocale;

const translation = (lang: string): { [key: string]: string } =>
  (RESSOURCES as any)[lang].translation;

export type PageMetaOptions = {
  /** Path of the page without the language, e.g. "/listall" ("" is the home page). */
  path?: string;
  /** Key of the translation with the title of the page, default: the site name. */
  titleKey?: string;
  /** Key of the translation with the description, default: the one of the site. */
  descriptionKey?: string;
  /** Pages without value for search engines (account, settings, ...). */
  noindex?: boolean;
  /** No canonical / alternate links (pages that set them on the client). */
  noAlternates?: boolean;
};

/** Metadata (title, description, canonical and language alternates, previews)
 * in the language of the page.
 */
export const getMetadata = (
  locale?: string,
  options: PageMetaOptions = {},
): Metadata => {
  const lang = validLocale(locale);
  const tr = translation(lang);
  const path = options.path ?? "";

  const pageTitle = options.titleKey ? tr[options.titleKey] : undefined;
  const title = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
  const description = tr[options.descriptionKey ?? "metaDescription"];
  const url = `/${lang}${path}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: options.noAlternates
      ? undefined
      : {
          canonical: url,
          languages: {
            ...Object.fromEntries(LANGUAGES.map((l) => [l, `/${l}${path}`])),
            "x-default": `/${defaultLocale}${path}`,
          },
        },
    robots: options.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      locale: ogLocales[lang] ?? lang,
      alternateLocale: LANGUAGES.filter((l) => l !== lang).map(
        (l) => ogLocales[l] ?? l,
      ),
      url,
      siteName: "YTPA",
      type: "website",
      images: [previewImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [previewImage.url],
    },
  };
};

type LocaleParams = { params: Promise<{ locale: string }> };

/** `generateMetadata` for a page: `export const generateMetadata = pageMetadata({...})`. */
export const pageMetadata =
  (options: PageMetaOptions) =>
  async ({ params }: LocaleParams) =>
    getMetadata((await params).locale, options);

// Used by the root layout, there is no language and no page
export const baseMetadata = getMetadata(undefined, { noAlternates: true });
