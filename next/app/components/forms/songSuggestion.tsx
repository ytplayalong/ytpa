"use client";

import firebaseManager, { useCurrentUser } from "@/app/firebase";
import { buttonAttrs, inputStyle } from "@/app/util/styles";
import usePathTranslation from "@/i18n/hook";
import { useState } from "react";

/** Song suggestion form
 */
export default function SongSuggestion() {
  const { t } = usePathTranslation();

  const [videoUrl, setVideoUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [status, setStatus] = useState("");
  const user = useCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let usedEmail = email;
    if (usedEmail == "") {
      const userMail = user?.email;
      if (userMail !== null && userMail !== undefined) {
        usedEmail = userMail;
      }
    }

    const succ = await firebaseManager.addSongSuggestion(
      name,
      artist,
      videoUrl,
      usedEmail
    );
    if (succ) {
      setStatus(t("songSubmissionSuccessful"));
      setArtist("");
      setName("");
      setEmail("");
      setVideoUrl("");
    } else {
      setStatus(t("songSubmissionFail"));
    }
  };

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
      <h4>{t("songSuggestion")}</h4>
      <p>{t("suggestASong")}</p>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="twocols">
            <label htmlFor="name">{t("songName")}</label>
          </div>
          <div className="twocols rightcol">
            <input
              style={inputStyle}
              type="text"
              name="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row" style={{ marginTop: "0.5em" }}>
          <div className="twocols">
            <label htmlFor="artist">{t("artist")}</label>
          </div>
          <div className="twocols rightcol">
            <input
              style={inputStyle}
              type="text"
              name="artist"
              id="artist"
              onChange={(e) => setArtist(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row" style={{ marginTop: "0.5em" }}>
          <div className="twocols">
            <label htmlFor="url">{t("ytUrl")}</label>
          </div>
          <div className="twocols rightcol">
            <input
              style={inputStyle}
              type="text"
              pattern="^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$"
              name="url"
              id="url"
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
          </div>
        </div>

        {emailComp}

        <div className="row" style={{ marginTop: "0.5em" }}>
          <button type="submit" {...buttonAttrs}>
            {t("submit")}
          </button>
          {status && <p>{status}</p>}
        </div>
      </form>
    </>
  );
}
