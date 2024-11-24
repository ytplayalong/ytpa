"use client";

import Link from "next/link";
import usePathTranslation from "@/i18n/hook";
import firebaseManager from "../firebase";

export const LoginRequired = (props: { defaultComp: any }) => {
  const { t, getLink } = usePathTranslation();

  const isLoggedIn = firebaseManager.userLoggedIn();
  if (isLoggedIn) {
    return props.defaultComp;
  }
  return (
    <>
      <p>
        You need to log in to access this page.{" "}
        <Link href={getLink("/login")}>Log in here.</Link>
      </p>
      <p>
        No account yet? <Link href={getLink("/register")}>Register here.</Link>
      </p>
    </>
  );
};
