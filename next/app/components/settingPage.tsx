"use client";

import Link from "next/link";

import usePathTranslation from "@/i18n/hook";

import { useCurrentUser, useIsAdmin } from "../firebase";
import ContactForm from "./forms/contactForm";
import SettingsComp from "./settings";

const SettingPage = () => {
  const { t, getLink } = usePathTranslation();
  const isAdmin = useIsAdmin(useCurrentUser());
  return (
    <>
      {isAdmin && (
        <p>
          <Link href={getLink(`/suggestions`)}>{t("suggestions")}</Link>
        </p>
      )}
      <p>
        <Link href={getLink(`/suggest`)}>{t("suggestASong")}</Link>
      </p>
      <p>
        <Link href={getLink(`/account`)}>{t("manageAccount")}</Link>
      </p>
      <SettingsComp />
      <ContactForm />
    </>
  );
};

export default SettingPage;
