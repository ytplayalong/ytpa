"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navbarLinks = [
  { url: "/", name: "Home" },
  { url: "/help", name: "Help" },
].reverse();

const linkStyle: any = {
  float: "right",
  color: "#f2f2f2",
  textAlign: "center",
  padding: "14px 16px",
  textDecoration: "none",
  fontSize: "17px",
};

export default function NavigationBar() {
  const currentPage = usePathname();
  const currentActiveLink = navbarLinks.filter((el) => el.url === currentPage);
  const label =
    currentActiveLink.length > 0 ? currentActiveLink[0].name : "Play-Along";

  return (
    <header className="topnav">
      <Link href="/" style={{ ...linkStyle, float: "left" }}>
        {"Home"}
      </Link>
      <div style={{ ...linkStyle, float: "left" }}>{label}</div>

      {navbarLinks.map((el) => {
        const className = el.url === currentPage ? "active" : "";
        return (
          <Link
            href={el.url}
            className={className}
            key={el.url}
            style={linkStyle}
          >
            {el.name}
          </Link>
        );
      })}
    </header>
  );
}
