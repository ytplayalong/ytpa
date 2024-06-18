"use client";

import usePathTranslation from "@/i18n/hook";
import { ScoreTable } from "./scoreTable";
import { getScoreInfo } from "../util/transposition";

export const NewestScores = ({
  nMostRecentSongs,
}: {
  nMostRecentSongs: number;
}) => {
  const allScores = getScoreInfo();
  const { t } = usePathTranslation();

  // Select only most recent scores
  let scores = allScores.filter(
    (_el, idx) => idx > allScores.length - nMostRecentSongs - 1
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
