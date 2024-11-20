"use client";

import usePathTranslation from "@/i18n/hook";
import { useForm, ValidationError } from "@formspree/react";
import { buttonAttrs, inputStyle } from "../util/styles";
import { errorBackground } from "../util/colors";

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

  const errorComp = state.errors ? (
    <div
      style={{
        backgroundColor: errorBackground,
        marginTop: 10,
        alignContent: "center",
        ...inputStyle,
      }}
    >
      <ValidationError errors={state.errors} style={{ padding: 10 }} />
    </div>
  ) : undefined;

  return (
    <>
      <h4>{t("contact")}</h4>
      <p>{t("contactTxt")}</p>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="twocols">
            <label htmlFor="name">{t("fullName")}</label>
            <ValidationError prefix="Name" field="name" errors={state.errors} />
          </div>
          <div className="twocols rightcol">
            <input style={inputStyle} type="text" name="name" id="name" />
          </div>
        </div>

        <div className="row" style={{ marginTop: "0.5em" }}>
          <div className="twocols">
            <label htmlFor="email">{t("email")}</label>
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          </div>
          <div className="twocols rightcol">
            <input style={inputStyle} type="email" name="email" id="email" />
          </div>
        </div>

        <div className="row" style={{ marginTop: "0.5em" }}>
          <div className="twocols">
            <label className="twocols" htmlFor="message">
              {t("message")}
            </label>
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
          </div>
          <div className="twocols rightcol">
            <textarea
              style={{ ...inputStyle, resize: "vertical" }}
              name="message"
              id="message"
            />
          </div>
        </div>

        <div className="row" style={{ marginTop: "0.5em" }}>
          <button
            type="submit"
            formMethod="POST"
            disabled={state.submitting}
            {...buttonAttrs}
          >
            {t("submit")}
          </button>
          {errorComp}
        </div>
      </form>
    </>
  );
}
