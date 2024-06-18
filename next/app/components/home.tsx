"use client";

import Link from "next/link";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { Trans } from "react-i18next";
import usePathTranslation from "@/i18n/hook";
import { NewestScores } from "./recentScores";
import { getScoreInfo } from "../util/transposition";

const TRACKING_ID = "G-42SMWF6LRM";

const Home = () => {
  ReactGA.initialize(TRACKING_ID);
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const nScores = getScoreInfo().length;
  const { t, getLink } = usePathTranslation();
  const parInfo = {
    num: <>{`${nScores}`}</>,
    all: <Link href={getLink("/listall")}> {t("allScores")}</Link>,
    random: <Link href={`/random`}>{t("randomScore")}</Link>,
  };
  const secondPar = <Trans i18nKey={"allScoresTxt"} components={parInfo} m />;

  return (
    <div>
      <p>{t("intro")}</p>
      <h4>{t("allScores")}</h4>
      <p>{secondPar}</p>
      <NewestScores nMostRecentSongs={10} />

      <h2>Work in progress, updates will follow...</h2>
    </div>
  );
};
export default Home;
