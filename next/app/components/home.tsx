"use client";

import Link from "next/link";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { Trans } from "react-i18next";

import usePathTranslation from "@/i18n/hook";

import { fullScoreInfo, getRandomScore } from "../util/util";
import { NewestScores } from "./recentScores";
import { defaultPageTitle } from "./navbar";
import useMounted from "../hooks/mounted";

const TRACKING_ID = "G-42SMWF6LRM";
const titleStyle: React.CSSProperties = {
  textAlign: "center",
  display: "inline-block",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  fontWeight: "bold",
  margin: "1rem", // optional spacing
};

const Home = () => {
  ReactGA.initialize(TRACKING_ID);
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

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
      <NewestScores nMostRecentSongs={20} />
      <p>{morePieces}</p>
    </>
  );
};
export default Home;
