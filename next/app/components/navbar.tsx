"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  MdAccountCircle,
  MdFavorite,
  MdLanguage,
  MdList,
  MdLogin,
  MdSettings,
} from "react-icons/md";

import { LANGUAGES } from "@/i18n";
import { getFlag } from "@/i18n/flags";
import usePathTranslation from "@/i18n/hook";

import { Constants } from "../constants";
import { getCurrUsername, useCurrentUser } from "../firebase";
import {
  buttonAttrsClass,
  containerInnerLeftRight,
  flexCentered,
} from "../util/styles";
import { ddContentStyle } from "../util/dropdown";
import useMounted from "../hooks/mounted";

const home = { url: "/", name: "Home" };
const buttSize = 26;
const iconProps = { size: buttSize, style: { marginRight: "0.5em" } };
const navbarLinks = [
  {
    url: "/favorites",
    key: "favorites",
    icon: <MdFavorite {...iconProps} />,
    mobileShown: true,
  },
  {
    url: "/listall",
    key: "allScores",
    icon: <MdList {...iconProps} />,
    mobileShown: true,
  },
  {
    url: "/settings",
    key: "settingsTitle",
    icon: <MdSettings {...iconProps} />,
    mobileShown: true,
  },
].reverse();
export const defaultPageTitle = "YouTube Play-Along";

const imgH = "45px";
const padLeftRight = "14px";
const padTopBot = "16px";
const baseNavEl: React.CSSProperties = {
  color: Constants.navTextCol,
  padding: `${padLeftRight} ${padTopBot}`,
  textDecoration: "none",
  fontSize: "17px",
  lineHeight: imgH,
  height: imgH,
};
const linkStyle: React.CSSProperties = {
  ...baseNavEl,
  float: "right",
  cursor: "pointer",
  ...flexCentered,
};

const navStyle: React.CSSProperties = {
  backgroundColor: Constants.navBGCol,
  padding: 0,
  borderBottom: "1px solid #d8d8d8",
};

const headerStyle: React.CSSProperties = {
  ...navStyle,
  zIndex: 100,
};

export default function NavigationBar() {
  const currentPage = usePathname();
  const { t, getLink, currentLang } = usePathTranslation();
  const currentUser = useCurrentUser();
  const mounted = useMounted();

  const [langDDShown, setLangDDShown] = useState(false);
  const langDDRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langDDShown) return;
    const handler = (e: MouseEvent) => {
      if (langDDRef.current && !langDDRef.current.contains(e.target as Node)) {
        setLangDDShown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langDDShown]);

  const currentActiveLink = navbarLinks.filter((el) => el.url === currentPage);
  const label =
    currentActiveLink.length > 0 ? currentActiveLink[0].key : defaultPageTitle;

  const getLinks = () => {
    const login = {
      url: "/login",
      key: "login",
      icon: <MdLogin {...iconProps} />,
      mobileShown: false,
    };
    if (mounted) {
      const userName = getCurrUsername(currentUser);
      if (userName != null) {
        login.icon = <MdAccountCircle {...iconProps} />;
        login.key = userName;
        return [login, ...navbarLinks];
      }
    }
    return [login, ...navbarLinks];
  };

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

  const ddItemAttrs = buttonAttrsClass({
    textDecoration: "none",
    borderRadius: 0,
    backgroundColor: "#eee",
  });

  const ddElements = LANGUAGES.filter((loc) => currentLang !== loc).map(
    (loc, idx, arr) => {
      const link = "/" + loc + currentPage.slice(3);
      const borderBottom = idx < arr.length - 1 ? "3px solid #ccc" : undefined;
      return (
        <Link
          {...ddItemAttrs}
          style={{ ...ddItemAttrs.style, borderBottom }}
          href={link}
          key={loc}
        >
          <div style={{ marginRight: "0.5em" }}>{loc.toUpperCase()}</div>
          {getFlag(loc)}
        </Link>
      );
    },
  );
  const contentStyle: React.CSSProperties = {
    ...ddContentStyle,
    display: langDDShown ? "block" : "none",
  };
  const ddClicked = () => setLangDDShown(!langDDShown);

  const ddStyle: React.CSSProperties = {
    float: "right",
    ...baseNavEl,
    cursor: "pointer",
  };

  const newNav = (
    <nav className="container" style={navStyle}>
      <div style={containerInnerLeftRight} className="clearfix">
        {navLogo}
        <div className="hide-on-mobile" style={{ ...baseNavEl, float: "left" }}>
          {label}
        </div>
        <div className="hoverlink" style={ddStyle} ref={langDDRef}>
          <div
            onClick={ddClicked}
            style={{ ...flexCentered, cursor: "pointer" }}
          >
            <MdLanguage {...iconProps} /> {getFlag(currentLang)} {"▾"}
          </div>
          <div
            className="dropdown"
            style={{
              paddingTop: padLeftRight,
              marginLeft: `-${padTopBot}`,
            }}
          >
            <div style={contentStyle}>{ddElements}</div>
          </div>
        </div>
        {getLinks().map((el) => {
          const backgroundColor =
            el.url === currentPage
              ? Constants.navActiveBGCol
              : navStyle.backgroundColor;
          let cName = "hoverlink";
          if (!el.mobileShown) {
            cName = `hide-on-mobile ${cName}`;
          }
          return (
            <Link
              href={getLink(el.url)}
              key={el.url}
              className={cName}
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

  return <header style={headerStyle}>{newNav}</header>;
}
