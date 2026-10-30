"use client";

import { useEffect } from "react";

import { LANGUAGES } from "@/i18n";
import usePathTranslation from "@/i18n/hook";

import { SITE_NAME, SITE_URL } from "../util/meta";
import { intToKey, ScoreInfo } from "../util/util";

/** Key and time signature of a piece as text, e.g. "2#" and "6/8". */
export const pieceKeyText = (sc: ScoreInfo) => sc.keys.map(intToKey).join(", ");
export const pieceTimeText = (sc: ScoreInfo) =>
  sc.times.map(([beats, type]) => `${beats}/${type}`).join(", ");

/** Sets title, description, canonical and language alternates of the page for
 * the piece (the page is the same for all pieces, the piece is in the query).
 *
 * The values are set on the client, search engines run JavaScript. Everything
 * is reset when the page is left.
 */
export default function PieceSeo({ scoreInfo }: { scoreInfo: ScoreInfo }) {
  const { t, currentLang } = usePathTranslation();

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const info = { name: scoreInfo.name, artist: scoreInfo.artist };
    const title = `${t("pieceTitle", info)} | ${SITE_NAME}`;
    const description = t("pieceDescription", {
      ...info,
      key: pieceKeyText(scoreInfo),
      time: pieceTimeText(scoreInfo),
    });

    // Title. Next.js sets the title of the page again after the page was
    // shown, so keep it as long as the piece is shown.
    const oldTitle = document.title;
    const applyTitle = () => {
      if (document.title !== title) {
        document.title = title;
      }
    };
    applyTitle();
    const observer = new MutationObserver(applyTitle);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    cleanups.push(() => {
      observer.disconnect();
      document.title = oldTitle;
    });

    // Meta tags: use the existing tag, or add one
    const setMeta = (attr: "name" | "property", key: string, value: string) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      const created = el === null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      const oldValue = el.getAttribute("content");
      el.setAttribute("content", value);
      cleanups.push(() => {
        if (created) {
          el.remove();
        } else if (oldValue !== null) {
          el.setAttribute("content", oldValue);
        }
      });
    };
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    // Canonical and the other languages
    const pieceUrl = (lang: string) =>
      `${SITE_URL}/${lang}/piece?scoreId=${scoreInfo.videoId}`;
    const addLink = (rel: string, href: string, hreflang?: string) => {
      const el = document.createElement("link");
      el.rel = rel;
      el.href = href;
      if (hreflang) el.hreflang = hreflang;
      document.head.appendChild(el);
      cleanups.push(() => el.remove());
    };
    addLink("canonical", pieceUrl(currentLang));
    setMeta("property", "og:url", pieceUrl(currentLang));
    for (const lang of LANGUAGES) {
      addLink("alternate", pieceUrl(lang), lang);
    }
    addLink("alternate", pieceUrl("en"), "x-default");

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [scoreInfo, currentLang, t]);

  return null;
}
