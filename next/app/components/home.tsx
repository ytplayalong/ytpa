"use client";

import Link from "next/link";
import { handleButtonClick } from "../analytics";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { Trans } from "react-i18next";
import usePathTranslation from "@/i18n/hook";

const TRACKING_ID = "G-42SMWF6LRM";

const Home = () => {
  ReactGA.initialize(TRACKING_ID);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const nScores = "?";
  const { t, getLink } = usePathTranslation();
  const parInfo = {
    num: <>{`${nScores}`}</>,
    all: <Link href={getLink("/listall")}> {t("allScores")}</Link>,
    random: <Link href={`/random`}>{t("randomScore")}</Link>,
  };
  const secondPar = <Trans i18nKey={"allScoresTxt"} components={parInfo} m />;

  const clickHandler = () => handleButtonClick("click", "button");
  return (
    <div>
      <p>{t("intro")}</p>
      <h4>{t("allScores")}</h4>
      <p>{secondPar}</p>
      <h2>Work in progress, updates will follow...</h2>
      <button onClick={clickHandler}>Button</button>

      <Link href={getLink("/help")}>Help</Link>
    </div>
  );
};
export default Home;
