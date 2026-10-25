"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdAccountCircle,
  MdFavorite,
  MdLanguage,
  MdList,
  MdLogin,
  MdSettings,
} from "react-icons/md";

import { LANGUAGES, RESSOURCES } from "@/i18n";
import usePathTranslation from "@/i18n/hook";

import { getCurrUsername, useCurrentUser } from "../firebase";
import useMounted from "../hooks/mounted";
import { containerInnerLeftRight, flexCentered } from "../util/styles";

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
];
export const defaultPageTitle = "YouTube Play-Along";

const imgH = "45px";
const padLeftRight = "16px";
const baseNavEl: React.CSSProperties = {
  color: "var(--fg)",
  padding: `0 ${padLeftRight}`,
  textDecoration: "none",
  fontSize: "17px",
  height: imgH,
  display: "flex",
  alignItems: "center", // vertically centered text
};
const linkStyle: React.CSSProperties = {
  ...baseNavEl,
  cursor: "pointer",
  ...flexCentered,
};

const navStyle: React.CSSProperties = {
  // Height of the bar around the 45px high entries. Only top and bottom, the
  // sides are set by the container (same as the page content).
  paddingTop: "13px",
  paddingBottom: "13px",
};

const headerStyle: React.CSSProperties = {
  zIndex: 100,
};

export default function NavigationBar() {
  const currentPage = usePathname();
  const { t, getLink, currentLang } = usePathTranslation();
  const currentUser = useCurrentUser();
  const mounted = useMounted();

  const router = useRouter();

  const currentActiveLink = navbarLinks.filter((el) => el.url === currentPage);
  const label =
    currentActiveLink.length > 0 ? currentActiveLink[0].key : defaultPageTitle;

  const getLinks = () => {
    const login = {
      url: "/account",
      key: "login",
      icon: <MdLogin {...iconProps} />,
      mobileShown: false,
    };
    if (mounted) {
      const userName = getCurrUsername(currentUser);
      if (userName != null) {
        login.icon = <MdAccountCircle {...iconProps} />;
        login.key = userName;
        return [...navbarLinks, login];
      }
    }
    return [...navbarLinks, login];
  };

  const navLogo = (
    <Link
      href={getLink(home.url)}
      style={{
        ...linkStyle,
        margin: 0,
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <img
        className="logo"
        src="/YTPALogo.svg"
        height={imgH}
        alt={t("logoAlt")}
      />
    </Link>
  );

  // Language selection
  const langSelect = (
    <div
      className="lang-select"
      style={{ ...baseNavEl, paddingRight: 0 }} // aligned with the page content
    >
      <MdLanguage {...iconProps} className="hide-on-xs" />
      <select
        aria-label={t("language")}
        title={(RESSOURCES as any)[currentLang].translation.langName}
        value={currentLang}
        onChange={(e) =>
          router.push("/" + e.target.value + currentPage.slice(3))
        }
      >
        {LANGUAGES.map((loc) => (
          <option key={loc} value={loc}>
            {loc.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );

  const newNav = (
    <nav className="container" style={navStyle}>
      <div
        style={{
          ...containerInnerLeftRight,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {navLogo}
        <div className="hide-on-narrow" style={baseNavEl}>
          {label}
        </div>
        <div style={{ flex: 1 }} />
        {getLinks().map((el) => {
          let cName = "hoverlink nav-item";
          if (el.url === currentPage) {
            cName += " active";
          }
          if (!el.mobileShown) {
            cName = `hide-on-mobile ${cName}`;
          }
          return (
            <Link
              href={getLink(el.url)}
              key={el.url}
              className={cName}
              style={linkStyle}
              aria-label={t(el.key)}
            >
              {el.icon}
              <span className="hide-on-xs">{t(el.key)}</span>
            </Link>
          );
        })}
        {langSelect}
      </div>
    </nav>
  );

  return (
    <header className="navbar" style={headerStyle}>
      {newNav}
    </header>
  );
}
