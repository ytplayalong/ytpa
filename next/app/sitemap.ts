import type { MetadataRoute } from "next";

import { defaultLocale, LANGUAGES } from "@/i18n";

import scores from "./scores.json";
import { SITE_URL } from "./util/meta";

export const dynamic = "force-static"; // The site is a static export

// Pages for search engines, in all languages. The other pages (account,
// settings, ...) are not part of the sitemap.
const pages = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/listall", changeFrequency: "weekly", priority: 0.8 },
] as const;

const alternates = (path: string) => ({
  languages: {
    ...Object.fromEntries(LANGUAGES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
    "x-default": `${SITE_URL}/${defaultLocale}${path}`,
  },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const pageEntries = pages.flatMap(({ path, changeFrequency, priority }) =>
    LANGUAGES.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      changeFrequency,
      priority,
      alternates: alternates(path),
    })),
  );

  // The pieces: the id of the video is in the query
  const pieceEntries = scores.flatMap(({ videoId }) => {
    const path = `/piece?scoreId=${videoId}`;
    return LANGUAGES.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: alternates(path),
    }));
  });

  return [...pageEntries, ...pieceEntries];
}
