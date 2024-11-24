"use client";

import usePathTranslation from "@/i18n/hook";

import { fullScoreInfo } from "../util/util";
import { ScoreTable } from "./scoreTable";

export const NewestScores = ({
  nMostRecentSongs,
}: {
  nMostRecentSongs: number;
}) => {
  const { t } = usePathTranslation();

  // Select only most recent scores
  let scores = fullScoreInfo.filter(
    (_el, idx) => idx > fullScoreInfo.length - nMostRecentSongs - 1
  );
  scores = scores.reverse();
  const newestScores = <ScoreTable scores={scores} />;

  return (
    <div>
      <h4>{t("recentScores")}</h4>
      <p>{t("recentTxt")}</p>
      {newestScores}
    </div>
  );
};
