"use client";

import usePathTranslation from "@/i18n/hook";

import { containerInner } from "../util/styles";

export default function PageNotFound() {
  const { t } = usePathTranslation();
  return (
    <div className="container">
      <div style={containerInner}>
        <h3>{t("pageNotFound")}</h3>
      </div>
    </div>
  );
}
