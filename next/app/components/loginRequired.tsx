"use client";

import Link from "next/link";

import usePathTranslation from "@/i18n/hook";

import { useCurrentUser } from "../firebase";

/** Checks if the user is logged-in and returns a component that can be rendered
 * if the user is not.
 */
export const useLoginRequired = () => {
  const { t, getLink } = usePathTranslation();
  const user = useCurrentUser();

  const component = (
    <>
      <p>
        {t("loginRequiredForPageAccess")}{" "}
        <Link href={getLink("/login")}>{t("loginHere")}</Link>
      </p>
      <p>
        {t("alreadyHaveAccount")}{" "}
        <Link href={getLink("/register")}>{t("registerHere")}</Link>
      </p>
    </>
  );

  return { component, user };
};
