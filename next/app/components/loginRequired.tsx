"use client";

import Link from "next/link";
import usePathTranslation from "@/i18n/hook";
import firebaseManager from "../firebase";

/** Checks if the user is logged-in and returns a component that can be rendered
 * if the user is not.
 */
export const useLoginRequired = () => {
  const { t, getLink } = usePathTranslation();

  const isLoggedIn = firebaseManager.userLoggedIn();
  const component = (
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

  return { component, isLoggedIn };
};

/** Not used probably */
export const LoginRequired = (props: { defaultComp: any }) => {
  const { component, isLoggedIn } = useLoginRequired();
  if (isLoggedIn) {
    return props.defaultComp;
  }
  return component;
};
