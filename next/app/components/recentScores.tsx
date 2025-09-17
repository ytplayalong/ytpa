"use client";

import usePathTranslation from "@/i18n/hook";

import { fullScoreInfo } from "../util/util";
import { ScoreTable, useFavoriteOption } from "./scoreTable";
import { useState } from "react";
import { buttonAttrs } from "../util/styles";

export const NewestScores = ({
  nMostRecentSongs,
}: {
  nMostRecentSongs: number;
}) => {
  const { t } = usePathTranslation();

  const favOpt = useFavoriteOption();
  const [nShown, setNShown] = useState(nMostRecentSongs);

  // Select only most recent scores
  let scores = fullScoreInfo.filter(
    (_el, idx) => idx > fullScoreInfo.length - nShown - 1
  );
  scores = scores.reverse();
  const newestScores = <ScoreTable scores={scores} options={favOpt.options} />;

  return (
    <div>
      <h4>{t("recentScores")}</h4>
      <p style={{ marginBottom: "1.5rem" }}>{t("recentTxt")}</p>
      {newestScores}
      {favOpt.overlay}
      <button onClick={() => setNShown(nShown + 5)} {...buttonAttrs}>
        {t("more")}
      </button>
    </div>
  );
};
