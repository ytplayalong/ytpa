"use client";

import usePathTranslation from "@/i18n/hook";
import ContactForm from "./forms/contactForm";
import SettingsComp from "./settings";
import Link from "next/link";

const SettingPage = () => {
  const { t, getLink } = usePathTranslation();
  return (
    <>
      <p>
        <Link href={getLink(`/suggest`)}>{t("suggestASong")}</Link>
      </p>
      <p>
        <Link href={getLink(`/login`)}>{t("manageAccount")}</Link>
      </p>
      <SettingsComp />
      <ContactForm />
    </>
  );
};

export default SettingPage;
