"use client";

import usePathTranslation from "@/i18n/hook";

import { resetConsent } from "../util/consent";

/** Link in the footer to change the decision about cookies. */
export default function CookieSettings() {
  const { t } = usePathTranslation();
  return (
    <button
      type="button"
      onClick={resetConsent}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        color: "var(--accent)",
        textDecoration: "underline",
        cursor: "pointer",
      }}
    >
      {t("cookieSettings")}
    </button>
  );
}
