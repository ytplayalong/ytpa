"use client";

import usePathTranslation from "@/i18n/hook";
import { LoginData, UserDataForm } from "./util";

/** New user registration form. */
export default function LoginForm() {
  const { t } = usePathTranslation();
  const loginUser = (data: LoginData) => {
    console.log(data);
  };
  return (
    <UserDataForm title={t("login")} initState={{}} onSubmit={loginUser} />
  );
}
