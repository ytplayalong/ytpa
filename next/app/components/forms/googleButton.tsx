"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { errorBackground } from "@/app/util/colors";
import firebaseManager, { AuthResult } from "@/app/firebase";
import { getButtonAttrs, inputStyle } from "@/app/util/styles";
import usePathTranslation from "@/i18n/hook";

import { messageText } from "./util";

/** Button for logging in or registering with a Google account.
 *
 * A new account is created automatically at the first login.
 */
export default function GoogleButton() {
  const { t } = usePathTranslation();
  const [error, setError] = useState<AuthResult>({});
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    setBusy(true);
    const res = await firebaseManager.signInWithGoogle();
    setBusy(false);
    setError(res);
  };

  const btn = getButtonAttrs("220px");
  return (
    <>
      <p style={{ margin: "1em 0 0.5em" }}>{t("or")}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        {...btn}
        style={{ ...btn.style, gap: "0.5em" }}
      >
        <FcGoogle size={22} />
        {t("continueWithGoogle")}
      </button>
      {error.error && (
        <div
          style={{
            backgroundColor: errorBackground,
            marginTop: 10,
            ...inputStyle,
          }}
        >
          <p style={{ padding: 10, margin: 0 }}>
            {messageText(t, error.error, error.detail)}
          </p>
        </div>
      )}
    </>
  );
}
