"use client";

import Link from "next/link";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { Trans } from "react-i18next";
import usePathTranslation from "@/i18n/hook";
import { NewestScores } from "./recentScores";
import { fullScoreInfo, getRandomScore } from "../util/util";

const TRACKING_ID = "G-42SMWF6LRM";

const Home = () => {
  ReactGA.initialize(TRACKING_ID);
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const nScores = fullScoreInfo.length;
  const { t, getLink } = usePathTranslation();
  const randScore = getRandomScore();
  const parInfo = {
    num: <>{`${nScores}`}</>,
    all: <Link href={getLink("/listall")}> {t("allScores")}</Link>,
    random: (
      <Link href={getLink(`/piece/${randScore.videoId}`)}>
        {t("randomScore")}
      </Link>
    ),
  };
  const secondPar = <Trans i18nKey={"allScoresTxt"} components={parInfo} m />;

  return (
    <div>
      <p>{t("intro")}</p>
      <h4>{t("allScores")}</h4>
      <p>{secondPar}</p>
      <NewestScores nMostRecentSongs={20} />
    </div>
  );
};
export default Home;
