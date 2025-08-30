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
        <h4>
          {t("loggedInAs")} {getCurrUsername(user)}
        </h4>
        <div className="row" style={{ marginBottom: "0.5em" }}>
          <div className="twocols">{t("email")}</div>
          <div className="twocols rightcol">{user.email}</div>
        </div>
        <button {...buttonAttrs} onClick={onLogout}>
          {t("logout")}
        </button>
      </>
    );
  } else if (user === null) {
    // Not logged in
    return (
      <>
        <UserDataForm title={titleStr} initState={{}} onSubmit={loginUser} />
        <div className="row" style={{ marginTop: "0.5em" }}>
          <div className="twocols">
            <p>
              {t("noAccount")}{" "}
              <Link href={getLink("/register")}>{t("registerHere")}</Link>
            </p>
          </div>
          <div className="twocols rightcol">
            <p>{t("forgotPassword")} TODO</p>
          </div>
        </div>
      </>
    );
  }
  return <Loading title={titleStr} addComp={false} />;
}
