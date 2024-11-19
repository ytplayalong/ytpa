"use client";

import React, { useEffect, useState } from "react";
import cookie from "js-cookie";
import { buttonAttrs, containerInner } from "../util/styles";

const CookieConsentBanner = () => {
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

  const bannerStyle: any = {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#ffffffee",
    backgroundSize: "100%",
    paddingTop: "5em",
  };
  return (
    <div style={bannerStyle}>
      <div className="container">
        <div style={containerInner}>
          <p>This website uses cookies to improve your browsing experience.</p>
          <p>Please click Accept to continue.</p>
          <button onClick={handleAccept} {...buttonAttrs}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
