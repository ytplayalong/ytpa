"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

import usePathTranslation from "@/i18n/hook";

import firebaseManager, {
  Suggestion,
  useIsAdmin,
} from "../firebase";
import { getButtonAttrs } from "../util/styles";
import {
  findDuplicateGroups,
  sortSuggestions,
  statusLabel,
  useAvailableScores,
} from "../util/suggestions";
import {
  BasicTable,
  tableRowHeight,
  tdStyle,
  thStyle,
  thumbTdStyle,
  thumbThStyle,
  wrapLinkedCell,
} from "../util/tables";
import { Loading } from "./loading";
import { useLoginRequired } from "./loginRequired";
import SuggestionDialog, { SuggestionEdit } from "./suggestionDialog";

const iconButton = getButtonAttrs("40px");

const formatDate = (s: Suggestion, locale: string) =>
  s.createdAt
    ? new Date(s.createdAt.toMillis()).toLocaleDateString(locale)
    : "";

/** Admin page for editing the song suggestions. */
export default function SuggestionEditor() {
  const { t, getLink, currentLang } = usePathTranslation();
  const loginRequired = useLoginRequired();
  const isAdmin = useIsAdmin(loginRequired.user);
  const getAvailable = useAvailableScores();
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<Suggestion | null>(null);

  useEffect(() => {
    if (isAdmin) {
      firebaseManager.getSongSuggestions().then(setSuggestions);
    }
  }, [isAdmin]);

  const sorted = useMemo(
    () => (suggestions ? sortSuggestions(suggestions) : []),
    [suggestions],
  );
  const duplicateGroups = useMemo(
    () => (suggestions ? findDuplicateGroups(suggestions) : []),
    [suggestions],
  );
  const duplicateIds = useMemo(
    () => new Set(duplicateGroups.flat().map((s) => s.id)),
    [duplicateGroups],
  );

  if (loginRequired.user === null) {
    return loginRequired.component;
  }
  if (isAdmin === undefined || (isAdmin && suggestions === null)) {
    return <Loading addComp={false} />;
  }
  if (!isAdmin) {
    return <p>{t("adminRequired")}</p>;
  }

  const removeFromList = (ids: string[]) =>
    setSuggestions((prev) => prev!.filter((s) => !ids.includes(s.id)));

  const saveEdit = async (edit: SuggestionEdit) => {
    const ok = await firebaseManager.updateSuggestion(editing!.id, edit);
    if (ok) {
      setSuggestions((prev) =>
        prev!.map((el) => (el.id === editing!.id ? { ...el, ...edit } : el)),
      );
      setEditing(null);
      setStatus("");
    }
    return ok;
  };

  const remove = async (s: Suggestion) => {
    if (!globalThis.confirm(t("confirmDelete", { name: s.name }))) {
      return;
    }
    if (await firebaseManager.deleteSuggestion(s.id)) {
      removeFromList([s.id]);
      setStatus("");
    } else {
      setStatus(t("editFailed"));
    }
  };

  const toRemove = duplicateGroups.flatMap((g) => g.slice(1));
  const removeDuplicates = async () => {
    const num = toRemove.length;
    if (!globalThis.confirm(t("confirmRemoveDuplicates", { num }))) {
      return;
    }
    const removed: string[] = [];
    for (const s of toRemove) {
      if (await firebaseManager.deleteSuggestion(s.id)) {
        removed.push(s.id);
      }
    }
    removeFromList(removed);
    setStatus(removed.length === num ? "" : t("editFailed"));
  };

  const header = (
    <>
      <th style={{ width: "14%", ...thumbThStyle }}></th>
      <th style={{ width: "30%", ...thStyle }}>{t("name")}</th>
      <th style={{ width: "20%", ...thStyle }}>{t("artist")}</th>
      <th style={{ width: "14%", ...thStyle }}>{t("submittedBy")}</th>
      <th style={{ width: "12%", ...thStyle }}>{t("status")}</th>
      <th style={{ width: "12%", ...thStyle }}></th>
    </>
  );

  const body = (
    <>
      {sorted.map((s) => {
        const link = `https://www.youtube.com/watch?v=${s.videoUrl}`;
        const isNew = s.status === undefined;
        return (
          <tr
            key={s.id}
            style={{
              height: tableRowHeight,
              opacity: s.status === "discarded" ? 0.5 : 1,
            }}
          >
            <td style={thumbTdStyle}>
              {wrapLinkedCell(
                <img
                  height={tableRowHeight}
                  src={`https://img.youtube.com/vi/${s.videoUrl}/default.jpg`}
                  alt={t("thumbnailAlt", { name: s.name, artist: s.artist })}
                ></img>,
                link,
                true,
              )}
            </td>
            <td style={tdStyle}>
              {s.name}
              {isNew && (
                <b style={{ color: "var(--ok)" }}> ({t("newSuggestion")})</b>
              )}
              {getAvailable(s) && (
                <Link href={getLink(`/piece?scoreId=${s.videoUrl}`)}>
                  <b style={{ color: "var(--info)" }}> ({t("availableSuggestion")})</b>
                </Link>
              )}
              {duplicateIds.has(s.id) && (
                <b style={{ color: "var(--danger)" }}> ({t("duplicate")})</b>
              )}
            </td>
            <td style={tdStyle}>{s.artist}</td>
            <td style={{ ...tdStyle, fontSize: "0.8em" }}>
              {s.email}
              <br />
              {formatDate(s, currentLang)}
            </td>
            <td style={tdStyle}>
              {statusLabel(t, s.status)}
            </td>
            <td style={tdStyle}>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={() => setEditing(s)}
                  title={t("edit")}
                  aria-label={t("edit")}
                  {...iconButton}
                >
                  <MdEdit size={20} />
                </button>
                <button
                  onClick={() => remove(s)}
                  title={t("delete")}
                  aria-label={t("delete")}
                  {...iconButton}
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );

  return (
    <>
      <h4>{t("editSuggestions")}</h4>
      <p>
        <Link href={getLink("/suggestions")}>← {t("suggestions")}</Link>
      </p>
      {toRemove.length > 0 && (
        <p>
          <button onClick={removeDuplicates} {...getButtonAttrs("120px")}>
            {t("removeDuplicates", { num: toRemove.length })}
          </button>
        </p>
      )}
      {status && <p>{status}</p>}
      <BasicTable header={header} body={body} />
      {editing && (
        <SuggestionDialog
          key={editing.id}
          suggestion={editing}
          onSave={saveEdit}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
