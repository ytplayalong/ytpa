"use client";

import { useState } from "react";

import usePathTranslation from "@/i18n/hook";

import { Suggestion, SuggestionStatus } from "../firebase";
import { buttonAttrs, inputStyle, primaryButtonAttrs } from "../util/styles";
import {
  cleanUpTitleArtist,
  parseVideoId,
  priorities,
  statusLabel,
} from "../util/suggestions";
import Dialog from "./dialog";
import { useYtVideoSelector } from "./ytSearch";

export type SuggestionEdit = {
  name: string;
  artist: string;
  videoUrl: string;
  status: SuggestionStatus | undefined;
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginTop: "0.8em",
};

/** Dialog for editing a suggestion: title, artist, video and status.
 *
 * `onSave` resolves to false if saving failed.
 */
export default function SuggestionDialog(props: {
  suggestion: Suggestion;
  onSave: (edit: SuggestionEdit) => Promise<boolean>;
  onClose: () => void;
}) {
  const { suggestion, onSave, onClose } = props;
  const { t } = usePathTranslation();

  const [name, setName] = useState(suggestion.name);
  const [artist, setArtist] = useState(suggestion.artist);
  const [videoUrl, setVideoUrl] = useState(suggestion.videoUrl);
  const [videoInput, setVideoInput] = useState(suggestion.videoUrl);
  const [status, setStatus] = useState<SuggestionStatus | undefined>(
    suggestion.status,
  );
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Replacing the video by searching on YouTube
  const { ytSearchComp, videoInfo, resetVideo } = useYtVideoSelector((v) => {
    setVideoUrl(v.id.videoId);
    setVideoInput(v.id.videoId);
    setMessage("");
  }, setMessage);

  const onVideoInput = (value: string) => {
    setVideoInput(value);
    const id = parseVideoId(value);
    if (id === null) {
      setMessage(t("invalidVideo"));
    } else {
      setVideoUrl(id);
      setMessage("");
      resetVideo();
    }
  };

  const cleanUp = () => {
    const cleaned = cleanUpTitleArtist(name, artist);
    setName(cleaned.name);
    setArtist(cleaned.artist);
  };

  const save = async () => {
    setSaving(true);
    const ok = await onSave({
      name: name.trim(),
      artist: artist.trim(),
      videoUrl,
      status,
    });
    setSaving(false);
    if (!ok) {
      setMessage(t("editFailed"));
    }
  };

  const valid =
    name.trim() !== "" &&
    artist.trim() !== "" &&
    parseVideoId(videoUrl) !== null;
  const statusValue = status === undefined ? "" : String(status);

  return (
    <Dialog onClose={onClose}>
      <h4>{t("editSuggestion")}</h4>

      <label style={labelStyle} htmlFor="sugg-name">
        {t("name")}
      </label>
      <input
        id="sugg-name"
        style={inputStyle}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label style={labelStyle} htmlFor="sugg-artist">
        {t("artist")}
      </label>
      <input
        id="sugg-artist"
        style={inputStyle}
        type="text"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <button
        type="button"
        onClick={cleanUp}
        {...buttonAttrs}
        style={{ ...buttonAttrs.style, marginTop: "0.5em" }}
      >
        {t("cleanUp")}
      </button>

      <label style={labelStyle} htmlFor="sugg-video">
        {t("videoLinkOrId")}
      </label>
      <input
        id="sugg-video"
        style={inputStyle}
        type="text"
        value={videoInput}
        onChange={(e) => onVideoInput(e.target.value)}
      />
      <div style={{ margin: "0.5em 0" }}>
        <a
          href={`https://www.youtube.com/watch?v=${videoUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            style={{ maxWidth: "100%" }}
            src={`https://img.youtube.com/vi/${videoUrl}/mqdefault.jpg`}
            alt={`YouTube thumbnail of ${name} by ${artist}`}
          />
        </a>
        {videoInfo && (
          <p style={{ margin: "0.3em 0" }}>
            {videoInfo.title} ({videoInfo.channelTitle})
          </p>
        )}
      </div>
      {ytSearchComp}

      <label style={labelStyle} htmlFor="sugg-status">
        {t("status")}
      </label>
      <select
        id="sugg-status"
        style={inputStyle}
        value={statusValue}
        onChange={(e) => {
          const v = e.target.value;
          setStatus(
            v === ""
              ? undefined
              : v === "discarded"
                ? v
                : (Number(v) as 1 | 2 | 3),
          );
        }}
      >
        <option value="">{statusLabel(t, undefined)}</option>
        {[...priorities].reverse().map((p) => (
          <option key={p} value={p}>
            {statusLabel(t, p)}
          </option>
        ))}
        <option value="discarded">{statusLabel(t, "discarded")}</option>
      </select>

      {message && <p style={{ color: "var(--danger)" }}>{message}</p>}

      <div className="dialog-buttons">
        <button onClick={onClose} {...buttonAttrs}>
          {t("cancel")}
        </button>
        <button
          onClick={save}
          disabled={!valid || saving}
          {...primaryButtonAttrs}
        >
          {t("save")}
        </button>
      </div>
    </Dialog>
  );
}
