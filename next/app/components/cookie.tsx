"use client";

import React from "react";

import usePathTranslation from "@/i18n/hook";

import { setConsent, useConsent } from "../util/consent";
import { buttonAttrs, primaryButtonAttrs } from "../util/styles";

/** Banner at the bottom of the page where the visitor accepts or declines
 * cookies. The page can be used without deciding.
 */
const CookieConsentBanner = () => {
  const { t } = usePathTranslation();
  const consent = useConsent();

  if (consent !== "undecided") {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label={t("cookieSettings")}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        background: "var(--card)",
        borderTop: "1px solid var(--line)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="container">
        <div style={{ padding: "12px 8px" }}>
          <p style={{ margin: "0 0 0.8em" }}>{t("cookieText")}</p>
          <div style={{ display: "flex", gap: "0.5em", flexWrap: "wrap" }}>
            <button onClick={() => setConsent("declined")} {...buttonAttrs}>
              {t("decline")}
            </button>
            <button onClick={() => setConsent("accepted")} {...primaryButtonAttrs}>
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
