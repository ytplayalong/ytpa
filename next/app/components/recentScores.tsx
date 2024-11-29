"use client";

import usePathTranslation from "@/i18n/hook";

import { fullScoreInfo } from "../util/util";
import { ScoreTable, useFavoriteOption } from "./scoreTable";

export const NewestScores = ({
  nMostRecentSongs,
}: {
  nMostRecentSongs: number;
}) => {
  const { t } = usePathTranslation();

  const favOpt = useFavoriteOption();

  // Select only most recent scores
  let scores = fullScoreInfo.filter(
    (_el, idx) => idx > fullScoreInfo.length - nMostRecentSongs - 1
  );
  scores = scores.reverse();
  const newestScores = <ScoreTable scores={scores} options={favOpt.options} />;

  return (
    <div>
      <h4>{t("recentScores")}</h4>
      <p>{t("recentTxt")}</p>
      {newestScores}
      {favOpt.overlay}
    </div>
  );
};
