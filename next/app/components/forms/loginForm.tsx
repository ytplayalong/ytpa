"use client";

import usePathTranslation from "@/i18n/hook";
import { LoginData, UserDataForm } from "./util";
import firebaseManager from "@/app/firebase";

/** New user registration form. */
export default function LoginForm() {
  const { t } = usePathTranslation();
  const loginUser = async (data: LoginData) => {
    console.log(data);
    return await firebaseManager.signIn(data.email, data.password);
  };
  return (
    <UserDataForm title={t("login")} initState={{}} onSubmit={loginUser} />
  );
}
