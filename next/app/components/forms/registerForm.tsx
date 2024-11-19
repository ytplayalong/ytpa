"use client";

import usePathTranslation from "@/i18n/hook";
import { FormFieldData, LoginData, UserDataForm } from "./util";
import firebaseManager from "@/app/firebase";

/** New user registration form. */
export default function RegisterForm() {
  const { t } = usePathTranslation();
  const addForms: FormFieldData[] = [
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
    <UserDataForm
      title={t("register")}
      initState={{ name: "" }}
      addForms={addForms}
      onSubmit={registerUser}
    />
  );
}
