"use client";

import Link from "next/link";
import { handleButtonClick } from "./analytics";
import { useEffect } from "react";
import ReactGA from "react-ga4";

const TRACKING_ID = "G-42SMWF6LRM";

export default function Home() {
  ReactGA.initialize(TRACKING_ID);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const clickHandler = () => handleButtonClick("click", "button");
  return (
    <div style={{ textAlign: "center" }}>
      <p>Play along YouTube videos.</p>
      <h2>Work in progress, updates will follow...</h2>
      <button onClick={clickHandler}>Button</button>

      <Link href="/help">Help</Link>
    </div>
  );
}
