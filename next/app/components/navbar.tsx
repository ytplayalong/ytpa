"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Constants } from "../constants";
import { MdHelp, MdLanguage, MdList, MdSettings } from "react-icons/md";
import usePathTranslation from "@/i18n/hook";
import { useState } from "react";
import { LANGUAGES } from "@/i18n";
import { getFlag } from "@/i18n/flags";
import { containerInner, flexCentered } from "../util/styles";

const home = { url: "/", name: "Home" };
const buttSize = 26;
const iconProps = { size: buttSize, style: { marginRight: "0.5em" } };
const navbarLinks = [
  { url: "/listall", key: "allScores", icon: <MdList {...iconProps} /> },
  {
    url: "/settings",
    key: "settingsTitle",
    icon: <MdSettings {...iconProps} />,
  },
  { url: "/help", key: "helpTitle", icon: <MdHelp {...iconProps} /> },
].reverse();
const defaultPageTitle = "YouTube Play-Along";

const imgH = "45px";
const padLeftRight = "14px";
const padTopBot = "16px";
const baseNavEl = {
  color: Constants.navTextCol,
  padding: `${padLeftRight} ${padTopBot}`,
  textDecoration: "none",
  fontSize: "17px",
  lineHeight: imgH,
  height: imgH,
};
const linkStyle: any = {
  ...baseNavEl,
  float: "right",
  pointer: "cursor",
  ...flexCentered,
};

const navStyle = {
  backgroundColor: Constants.navBGCol,
  overflow: "hidden",
  padding: 0,
};

export default function NavigationBar() {
  const currentPage = usePathname();
  const { t, getLink, currentLang } = usePathTranslation();
  const currentActiveLink = navbarLinks.filter((el) => el.url === currentPage);
  const label =
    currentActiveLink.length > 0 ? currentActiveLink[0].key : defaultPageTitle;

  const navLogo = (
    <Link
      href={getLink(home.url)}
      style={{
        ...linkStyle,
        float: "left",
        margin: 0,
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <img src="/YTPALogo.svg" height={imgH} alt="Youtube Play Along logo" />
    </Link>
  );

  const [langDDShown, setDDShown] = useState(false);

  const ddLinkStyle: any = {
    color: "black",
    backgroundColor: "white",
    padding: "10px",
    textDecoration: "none",
    minWidth: "50px",
    ...flexCentered,
  };

  const ddElements = LANGUAGES.filter((loc) => currentLang !== loc).map(
    (loc) => {
      const link = "/" + loc + currentPage.slice(3);
      return (
        <Link className="hoverlink" href={link} style={ddLinkStyle} key={loc}>
          <div style={{ marginRight: "1em" }}>{loc.toUpperCase()}</div>{" "}
          {getFlag(loc)}
        </Link>
      );
    }
  );
  const contentStyle: any = {
    display: langDDShown ? "block" : "none",
    position: "absolute",
  };
  const ddClicked = () => setDDShown(!langDDShown);

  const ddStyle: any = {
    float: "right",
    ...baseNavEl,
    overflow: "hidden",
    pointer: "cursor",
  };

  const newNav = (
    <nav className="container" style={navStyle}>
      <div style={containerInner}>
        {navLogo}
        <div style={{ ...baseNavEl, float: "left" }}>{label}</div>
        <div className="hoverlink" style={ddStyle}>
          <div
            onClick={ddClicked}
            style={{ ...flexCentered, cursor: "pointer" }}
          >
            <MdLanguage {...iconProps} /> {getFlag(currentLang)} {"▾"}
          </div>
          <div
            className="dropdown"
            style={{
              display: "relative",
              paddingTop: padLeftRight,
              marginLeft: `-${padTopBot}`,
            }}
          >
            <div style={contentStyle}>{ddElements}</div>
          </div>
        </div>
        {navbarLinks.map((el) => {
          const backgroundColor =
            el.url === currentPage
              ? Constants.navActiveBGCol
              : navStyle.backgroundColor;
          return (
            <Link
              href={getLink(el.url)}
              key={el.url}
              className="hoverlink"
              style={{ ...linkStyle, backgroundColor }}
            >
              {el.icon}
              {t(el.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );

  return (
    <header className="topnav" style={navStyle}>
      {newNav}
    </header>
  );
}
