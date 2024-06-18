"use client";

import usePathTranslation from "@/i18n/hook";
import { useForm, ValidationError } from "@formspree/react";
import { twoColumns } from "../util/styles";

const inputStyle: any = {
  boxSizing: "border-box",
  width: "100%",
};

/** Form spree contact form component.
 *
 * Taken from: https://developers.cloudflare.com/pages/tutorials/add-a-react-form-with-formspree/
 */
export default function ContactForm() {
  const [state, handleSubmit] = useForm("xpzbwoql");
  const { t } = usePathTranslation();

  if (state.succeeded) {
    return <p>Thanks for your submission!</p>;
  }

  return (
    <>
      <h4>{t("contact")}</h4>
      <p>{t("contactTxt")}</p>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div style={twoColumns}>
            <label htmlFor="name">{t("fullName")}</label>
            <ValidationError prefix="Name" field="name" errors={state.errors} />
          </div>
          <div style={twoColumns}>
            <input style={inputStyle} type="text" name="name" id="name" />
          </div>

          <div style={twoColumns}>
            <label htmlFor="email">{t("email")}</label>
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          </div>
          <div style={twoColumns}>
            <input style={inputStyle} type="email" name="email" id="email" />
          </div>

          <div style={twoColumns}>
            <label style={twoColumns} htmlFor="message">
              {t("message")}
            </label>
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
          </div>
          <div style={twoColumns}>
            <textarea
              style={{ ...inputStyle, resize: "vertical" }}
              name="message"
              id="message"
            />
          </div>

          <button type="submit" formMethod="POST" disabled={state.submitting}>
            {t("submit")}
          </button>
          <ValidationError errors={state.errors} />
        </div>
      </form>
    </>
  );
}
