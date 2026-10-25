"use client";

import cookie from "js-cookie";
import React, { useEffect, useState } from "react";

import usePathTranslation from "@/i18n/hook";

import { containerInner, primaryButtonAttrs } from "../util/styles";

const CookieConsentBanner = () => {
  const { t } = usePathTranslation();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consentCookie = cookie.get("cookieConsent");
    if (!consentCookie) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setShowBanner(false);
    cookie.set("cookieConsent", "accepted", { expires: 365 });
  };

  if (!showBanner) {
    return null;
  }

  const bannerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "fixed",
    left: 0,
    right: 0,
    backgroundColor: "color-mix(in srgb, var(--bg) 94%, transparent)",
    paddingTop: "5em",
    zIndex: 2000,
  };
  return (
    <div style={bannerStyle}>
      <div className="container">
        <div style={containerInner}>
          <p>{t("cookieText")}</p>
          <p>{t("cookieAccept")}</p>
          <button onClick={handleAccept} {...primaryButtonAttrs}>
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
