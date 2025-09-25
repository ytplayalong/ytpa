"use client";

import { useEffect, useState } from "react";
import { useLoginRequired } from "./loginRequired";
import firebaseManager from "../firebase";
import usePathTranslation from "@/i18n/hook";
import { Loading } from "./loading";
import {
  BasicTable,
  leftTdStyle,
  tableRowHeight,
  tdStyle,
  thStyle,
  wrapLinkedCell,
} from "../util/tables";

export default () => {
  const { t } = usePathTranslation();

  return (
    <>
      <h4>{t("suggestions")}</h4>
      <SuggestListNoTitle />
    </>
  );
};

const SuggestListNoTitle = () => {
  const { t } = usePathTranslation();
  const loginRequired = useLoginRequired();
  const [suggestions, setSuggestions] = useState<any[] | null>(null);

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

  const imgColWidth = "15%";
  const nameArtistColWidth = "42.5%";
  const header = (
    <>
      <th style={{ width: imgColWidth, ...thStyle }}></th>
      <th style={{ width: nameArtistColWidth, ...thStyle }}>{t("name")}</th>
      <th style={{ width: nameArtistColWidth, ...thStyle }}>{t("artist")}</th>
    </>
  );

  const body = (
    <>
      {suggestions.map((el) => {
        const ytVideoLink = `https://www.youtube.com/watch?v=${el.videoUrl}`;
        return (
          <tr
            key={el.videoUrl}
            style={{ cursor: "pointer", height: tableRowHeight }}
            className="hoverlink"
          >
            <td style={leftTdStyle}>
              {wrapLinkedCell(
                <img
                  height={tableRowHeight}
                  src={`https://img.youtube.com/vi/${el.videoUrl}/default.jpg`}
                  alt={`YouTube thumbnail of ${el.name} by ${el.artist}`}
                ></img>,
                ytVideoLink,
                true
              )}
            </td>
            <td style={tdStyle}>
              {wrapLinkedCell(el.name, ytVideoLink, true)}
            </td>
            <td style={tdStyle}>
              {wrapLinkedCell(el.artist, ytVideoLink, true)}
            </td>
          </tr>
        );
      })}
    </>
  );

  return <BasicTable header={header} body={body} />;
};
