"use client";

import Link from "next/link";
import usePathTranslation from "@/i18n/hook";
import { LoginData, UserDataForm } from "./util";
import firebaseManager from "@/app/firebase";

/** New user registration form. */
export default function LoginForm() {
  const { t, getLink } = usePathTranslation();
  const loginUser = async (data: LoginData) => {
    console.log(data);
    return await firebaseManager.signIn(data.email, data.password);
  };
  return (
    <>
      <UserDataForm title={t("login")} initState={{}} onSubmit={loginUser} />
      <p>
        No account yet? <Link href={getLink("/register")}>Register here.</Link>
      </p>
      <p>
        <Link href={getLink("/favorites")}>Favorites.</Link>
      </p>
    </>
  );
}
