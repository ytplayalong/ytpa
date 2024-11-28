"use client";

import Link from "next/link";

import firebaseManager, {
  getCurrUsername,
  useCurrentUser,
} from "@/app/firebase";
import { buttonAttrs } from "@/app/util/styles";
import usePathTranslation from "@/i18n/hook";

import { Loading } from "../loading";
import { LoginData, UserDataForm } from "./util";

/** New user registration form. */
export default function LoginForm() {
  const { t, getLink } = usePathTranslation();
  const user = useCurrentUser();

  const loginUser = async (data: LoginData) => {
    return await firebaseManager.signIn(data.email, data.password);
  };

  const titleStr = t("login");
  if (user) {
    const onLogout = () => firebaseManager.signOut();
    return (
      <>
        <h4>Logged-in as {getCurrUsername(user)}</h4>
        <button {...buttonAttrs} onClick={onLogout}>
          Log Out
        </button>
      </>
    );
  } else if (user === null) {
    // Not logged in
    return (
      <>
        <UserDataForm title={titleStr} initState={{}} onSubmit={loginUser} />
        <p>
          No account yet?{" "}
          <Link href={getLink("/register")}>Register here.</Link>
        </p>
        <p>Forgot your password? TODO</p>
      </>
    );
  }
  return <Loading title={titleStr} addComp={false} />;
}
