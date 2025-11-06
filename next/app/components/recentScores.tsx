"use client";

import usePathTranslation from "@/i18n/hook";

import { fullScoreInfo } from "../util/util";
import { ScoreTable, useFavoriteOption } from "./scoreTable";

export const NewestScores = () => {
  const { t } = usePathTranslation();

  const favOpt = useFavoriteOption();

  // Select only most recent scores
  const scoresByRecency = [...fullScoreInfo].reverse();

  // TODO(CB): Make sortable, but keep initial sorting
  const newestScores = (
    <ScoreTable scores={scoresByRecency} options={favOpt.options} />
  );

  return (
    <div>
      <h4>{t("recentScores")}</h4>
      <p style={{ marginBottom: "1.5rem" }}>{t("recentTxt")}</p>
      {newestScores}
      {favOpt.overlay}
    </div>
  );
};
