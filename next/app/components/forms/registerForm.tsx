"use client";

import Link from "next/link";

import firebaseManager from "@/app/firebase";
import usePathTranslation from "@/i18n/hook";

import { FormFieldData, LoginData, UserDataForm } from "./util";

/** New user registration form. */
export default function RegisterForm() {
  const { t, getLink } = usePathTranslation();
  const addForms: FormFieldData[] = [
    {
      type: "password",
      name: "repeat_password",
      label: t("passwordConfirm"),
      value: "",
      onChange: (e: any) => {},
    },
    {
      type: "text",
      name: "name",
      label: t("name"),
      value: "",
      onChange: (e: any) => {},
    },
  ];

  const registerUser = async (data: LoginData) => {
    return await firebaseManager.signUp(data.email, data.password);
  };
  return (
    <>
      <UserDataForm
        title={t("register")}
        initState={{ name: "" }}
        addForms={addForms}
        onSubmit={registerUser}
      />
      <p>
        {t("alreadyHaveAccount")}{" "}
        <Link href={getLink("/login")}>{t("loginHere")}</Link>
      </p>
    </>
  );
}
