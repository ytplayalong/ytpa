"use client";

import Link from "next/link";
import usePathTranslation from "@/i18n/hook";
import firebaseManager from "../firebase";

export const LoginRequired = (props: { defaultComp: any }) => {
  const { t, getLink } = usePathTranslation();

  const isLoggedIn = firebaseManager.userLoggedIn();
  console.log(isLoggedIn);
  if (isLoggedIn) {
    return props.defaultComp;
  }
  return (
    <div className="container">
      <p>
        You need to log in to access this page.{" "}
        <Link href={getLink("/login")}>Log in here.</Link>
      </p>
      <p>
        No account yet? <Link href={getLink("/register")}>Register here.</Link>
      </p>
    </div>
  );
};
