"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Trans } from "react-i18next";

import usePathTranslation from "@/i18n/hook";

import { usePageview } from "../analytics";
import useMounted from "../hooks/mounted";
import { fullScoreInfo, getRandomScore } from "../util/util";
import { defaultPageTitle } from "./navbar";
import { RecentPiecesFallback } from "./pieceLinks";
import { NewestScores } from "./recentScores";

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  display: "inline-block",
  padding: "0.5rem 1rem",
  borderRadius: "var(--radius)",
  fontWeight: "bold",
  margin: "1rem", // optional spacing
};

const Home = () => {
  usePageview(); // Only counts if the visitor accepted cookies

  const nScores = fullScoreInfo.length;
  const { t, getLink } = usePathTranslation();
  const mounted = useMounted();
  const randScore = mounted ? getRandomScore() : fullScoreInfo[0];
  const parInfo = {
    num: <>{`${nScores}`}</>,
    all: <Link href={getLink("/listall")}> {t("allScores")}</Link>,
    random: (
      <Link href={getLink(`/piece?scoreId=${randScore.videoId}`)}>
        {t("randomScore")}
      </Link>
    ),
  };
  const secondPar = <Trans i18nKey={"allScoresTxt"} components={parInfo} />;
  const morePieces = <Trans i18nKey={"findAllHereTxt"} components={parInfo} />;
  return (
    <>
      <div style={{ textAlign: "center", margin: "1rem" }}>
        <div style={titleStyle}>
          <h1 style={{ margin: 0, fontSize: "3rem" }}>{defaultPageTitle}</h1>
        </div>
        <h4 style={{ fontSize: "1.5rem" }}>{t("intro")}</h4>
      </div>
      <h4 style={{ marginTop: "3rem" }}>{t("allScores")}</h4>
      <p>{secondPar}</p>
      <Suspense fallback={<RecentPiecesFallback />}>
        <NewestScores />
      </Suspense>
      <p>{morePieces}</p>
    </>
  );
};
export default Home;
