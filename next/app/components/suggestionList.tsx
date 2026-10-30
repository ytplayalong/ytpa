"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import usePathTranslation from "@/i18n/hook";

import firebaseManager, { Suggestion, useIsAdmin } from "../firebase";
import { buttonAttrs } from "../util/styles";
import {
  sortSuggestions,
  statusGroup,
  statusLabel,
  useAvailableScores,
} from "../util/suggestions";
import {
  BasicTable,
  clampText,
  tableRowHeight,
  tdStyle,
  thStyle,
  thumbTdStyle,
  thumbThStyle,
  wrapLinkedCell,
} from "../util/tables";
import { Loading } from "./loading";
import { useLoginRequired } from "./loginRequired";

const SuggestionList = () => {
  const { t, getLink } = usePathTranslation();
  const loginRequired = useLoginRequired();
  const isAdmin = useIsAdmin(loginRequired.user);

  return (
    <>
      <h4>{t("suggestions")}</h4>
      {isAdmin && (
        <p>
          <Link
            href={getLink("/suggestions/edit")}
            {...buttonAttrs}
            style={{
              ...buttonAttrs.style,
              boxSizing: "border-box", // <a> is content-box, <button> border-box
              width: "fit-content",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {t("editSuggestions")}
          </Link>
        </p>
      )}
      <SuggestListNoTitle />
    </>
  );
};

export default SuggestionList;

const SuggestListNoTitle = () => {
  const { t, getLink } = usePathTranslation();
  const getAvailable = useAvailableScores();
  const loginRequired = useLoginRequired();
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);

  const loadSuggestions = async () => {
    const suggestions = await firebaseManager.getSongSuggestions();
    setSuggestions(suggestions);
    console.log("Loaded suggestions");
  };

  useEffect(() => {
    if (loginRequired.user) {
      loadSuggestions();
    }
  }, [loginRequired.user]);

  if (loginRequired.user === null) {
    console.log("Not logged-in");
    return loginRequired.component;
  }

  if (suggestions === null || loginRequired.user === undefined) {
    return <Loading addComp={false} />;
  }

  const header = (
    <>
      <th style={{ width: "15%", ...thumbThStyle }}></th>
      <th style={{ width: "35%", ...thStyle }}>{t("name")}</th>
      <th style={{ width: "30%", ...thStyle }}>{t("artist")}</th>
      <th style={{ width: "20%", ...thStyle }}>{t("status")}</th>
    </>
  );

  const makeBody = (list: Suggestion[]) => (
    <>
      {list.map((el) => {
        // Available pieces link to the piece, the others to the YouTube video
        const available = getAvailable(el);
        const ytVideoLink = available
          ? getLink(`/piece?scoreId=${available.videoId}`)
          : `https://www.youtube.com/watch?v=${el.videoUrl}`;
        const newTab = !available;
        return (
          <tr
            key={el.id}
            style={{ cursor: "pointer", height: tableRowHeight }}
            className="hoverlink"
          >
            <td style={thumbTdStyle}>
              {wrapLinkedCell(
                <img
                  height={tableRowHeight}
                  src={`https://img.youtube.com/vi/${el.videoUrl}/default.jpg`}
                  alt={t("thumbnailAlt", { name: el.name, artist: el.artist })}
                ></img>,
                ytVideoLink,
                newTab
              )}
            </td>
            <td style={tdStyle}>
              {wrapLinkedCell(
                clampText(
                  <>
                    {el.name}
                    {available && (
                      <b style={{ color: "var(--info)" }}>
                        {" "}
                        ({t("availableSuggestion")})
                      </b>
                    )}
                  </>,
                  el.name,
                ),
                ytVideoLink,
                newTab
              )}
            </td>
            <td style={tdStyle}>
              {wrapLinkedCell(clampText(el.artist, el.artist), ytVideoLink, newTab)}
            </td>
            <td style={tdStyle}>
              {wrapLinkedCell(statusLabel(t, el.status), ytVideoLink, newTab)}
            </td>
          </tr>
        );
      })}
    </>
  );

  // New suggestions (newest first), then the prioritized ones (highest first)
  // and the discarded ones
  const sorted = sortSuggestions(suggestions);
  const groups = [
    { group: "new", title: t("newSuggestions") },
    { group: "prioritized", title: t("prioritizedSuggestions") },
    { group: "discarded", title: t("discardedSuggestions") },
  ] as const;

  return (
    <>
      {groups.map(({ group, title }) => {
        const list = sorted.filter((el) => statusGroup(el) === group);
        if (list.length === 0) {
          return null;
        }
        return (
          <div key={group}>
            <h5>{title}</h5>
            <BasicTable header={header} body={makeBody(list)} />
          </div>
        );
      })}
    </>
  );
};
