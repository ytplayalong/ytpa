"use client";

import firebaseManager, { useCurrentUser } from "@/app/firebase";
import { buttonAttrs, inputStyle } from "@/app/util/styles";
import usePathTranslation from "@/i18n/hook";
import { useState } from "react";
import { useYtVideoSelector, YtSearchResult } from "../ytSearch";

/** Song suggestion form
 */
export default function SongSuggestion() {
  const { t } = usePathTranslation();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [status, setStatus] = useState("");
  const user = useCurrentUser();

  const onVideo = (v: YtSearchResult) => {
    setArtist(v.snippet.channelTitle);
    setName(v.snippet.title);
  };
  const { ytSearchComp, videoInfo, resetVideo } = useYtVideoSelector(onVideo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let usedEmail = email;
    if (usedEmail == "") {
      const userMail = user?.email;
      if (userMail !== null && userMail !== undefined) {
        usedEmail = userMail;
      }
    }

    const vidId = videoInfo?.videoId;
    if (vidId === undefined) {
      setStatus(t("songSubmissionFail"));
      return;
    }

    const succ = await firebaseManager.addSongSuggestion(
      name,
      artist,
      vidId,
      usedEmail
    );
    if (succ) {
      setStatus(t("songSubmissionSuccessful"));
      setArtist("");
      setName("");
      setEmail("");
      resetVideo();
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

  const form =
    videoInfo == null ? null : (
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
              defaultValue={name}
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
              defaultValue={artist}
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
    );

  return (
    <>
      <h4>{t("songSuggestion")}</h4>
      {ytSearchComp}
      {form}
    </>
  );
}
