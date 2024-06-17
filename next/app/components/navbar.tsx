"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Constants } from "../constants";

const home = { url: "/", name: "Home" };
const navbarLinks = [
  { url: "/settings", name: "Settings" },
  { url: "/help", name: "Help" },
].reverse();

const linkStyle: any = {
  float: "right",
  color: Constants.navTextCol,
  textAlign: "center",
  padding: "14px 16px",
  textDecoration: "none",
  fontSize: "17px",
  height: "100%",
};

const navStyle = {
  backgroundColor: Constants.navBGCol,
  overflow: "hidden",
};

export default function NavigationBar() {
  const currentPage = usePathname();
  const currentActiveLink = navbarLinks.filter((el) => el.url === currentPage);
  const label =
    currentActiveLink.length > 0 ? currentActiveLink[0].name : "Play-Along";

  const navLogo = (
    <Link href={home.url} style={{ ...linkStyle, float: "left" }}>
      <img src="/YTPALogo.svg" height={"45px"} alt="Youtube Play Along logo" />
    </Link>
  );

  return (
    <header className="topnav" style={navStyle}>
      {navLogo}
      <div style={{ ...linkStyle, float: "left" }}>{label}</div>

      {navbarLinks.map((el) => {
        const backgroundColor =
          el.url === currentPage
            ? Constants.navActiveBGCol
            : navStyle.backgroundColor;
        return (
          <Link
            href={el.url}
            key={el.url}
            className="hoverlink"
            style={{ ...linkStyle, backgroundColor }}
          >
            {el.name}
          </Link>
        );
      })}
    </header>
  );
}
