"use client";

import { useState } from "react";

import firebaseManager, { useCurrentUser } from "@/app/firebase";
import { buttonAttrs, inputStyle } from "@/app/util/styles";
import usePathTranslation from "@/i18n/hook";

/** Password reset form. */
export default function PwResetForm() {
  const { t } = usePathTranslation();
  const user = useCurrentUser();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const onPasswordReset = async () => {
    const userEmail = user?.email ?? email;
    let succ = false;
    if (userEmail) {
      succ = await firebaseManager.resetPassword(userEmail);
    }
    if (succ) {
      setStatus("sentPwResetEmail");
    } else {
      setStatus("sendPwResetEmailFailed");
    }
  };

  const titleStr = t("pwReset");

  const emailComp = firebaseManager.userLoggedIn() ? null : (
    <div className="row" style={{ marginTop: "0.5em" }}>
      <div className="twocols">
        <label htmlFor="email">{t("email")}</label>
      </div>
      <div className="twocols rightcol">
        <input
          style={inputStyle}
          type="email"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
    </div>
  );

  return (
    <>
      <h4>{titleStr}</h4>
      <p>{t("sendPwResetEmail")}</p>
      <form onSubmit={onPasswordReset}>
        {emailComp}

        <div className="row" style={{ marginTop: "0.5em" }}>
          <button type="submit" {...buttonAttrs}>
            {t("send")}
          </button>
          {status && <p>{t(status)}</p>}
        </div>
      </form>
    </>
  );
}
