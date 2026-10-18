"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import usePathTranslation from "@/i18n/hook";

import firebaseManager, {
  Suggestion,
  SuggestionStatus,
  useIsAdmin,
} from "../firebase";
import { buttonAttrs, inputStyle } from "../util/styles";
import {
  findDuplicateGroups,
  priorities,
  sortSuggestions,
  statusLabel,
  useAvailableScores,
} from "../util/suggestions";
import {
  BasicTable,
  leftTdStyle,
  tableRowHeight,
  tdStyle,
  thStyle,
  wrapLinkedCell,
} from "../util/tables";
import { Loading } from "./loading";
import { useLoginRequired } from "./loginRequired";

const formatDate = (s: Suggestion) =>
  s.createdAt ? new Date(s.createdAt.toMillis()).toLocaleDateString() : "";

/** Admin page for editing the song suggestions. */
export default function SuggestionEditor() {
  const { t, getLink } = usePathTranslation();
  const loginRequired = useLoginRequired();
  const isAdmin = useIsAdmin(loginRequired.user);
  const getAvailable = useAvailableScores();
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [status, setStatus] = useState("");

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

  const changeStatus = async (s: Suggestion, value: string) => {
    let status: SuggestionStatus | undefined;
    if (value === "discarded") {
      status = "discarded";
    } else if (value !== "") {
      status = Number.parseInt(value) as 1 | 2 | 3;
    }
    if (await firebaseManager.updateSuggestionStatus(s.id, status)) {
      setSuggestions((prev) =>
        prev!.map((el) => (el.id === s.id ? { ...el, status } : el)),
      );
      setStatus("");
    } else {
      setStatus(t("editFailed"));
    }
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
      <th style={{ width: "14%", ...thStyle }}></th>
      <th style={{ width: "30%", ...thStyle }}>{t("name")}</th>
      <th style={{ width: "20%", ...thStyle }}>{t("artist")}</th>
      <th style={{ width: "14%", ...thStyle }}>{t("submittedBy")}</th>
      <th style={{ width: "12%", ...thStyle }}>{t("status")}</th>
      <th style={{ width: "10%", ...thStyle }}></th>
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
            <td style={leftTdStyle}>
              {wrapLinkedCell(
                <img
                  height={tableRowHeight}
                  src={`https://img.youtube.com/vi/${s.videoUrl}/default.jpg`}
                  alt={`YouTube thumbnail of ${s.name} by ${s.artist}`}
                ></img>,
                link,
                true,
              )}
            </td>
            <td style={tdStyle}>
              {s.name}
              {isNew && (
                <b style={{ color: "#2a9d3c" }}> ({t("newSuggestion")})</b>
              )}
              {getAvailable(s) && (
                <Link href={getLink(`/piece?scoreId=${s.videoUrl}`)}>
                  <b style={{ color: "#1f77b4" }}> ({t("availableSuggestion")})</b>
                </Link>
              )}
              {duplicateIds.has(s.id) && (
                <b style={{ color: "#d9534f" }}> ({t("duplicate")})</b>
              )}
            </td>
            <td style={tdStyle}>{s.artist}</td>
            <td style={{ ...tdStyle, fontSize: "0.8em" }}>
              {s.email}
              <br />
              {formatDate(s)}
            </td>
            <td style={tdStyle}>
              <select
                style={inputStyle}
                value={s.status ?? ""}
                onChange={(e) => changeStatus(s, e.target.value)}
              >
                <option value="">{statusLabel(t, undefined)}</option>
                {[...priorities].reverse().map((p) => (
                  <option key={p} value={p}>
                    {statusLabel(t, p)}
                  </option>
                ))}
                <option value="discarded">{statusLabel(t, "discarded")}</option>
              </select>
            </td>
            <td style={tdStyle}>
              <button onClick={() => remove(s)} {...buttonAttrs}>
                {t("delete")}
              </button>
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
          <button onClick={removeDuplicates} {...buttonAttrs}>
            {t("removeDuplicates", { num: toRemove.length })}
          </button>
        </p>
      )}
      {status && <p>{status}</p>}
      <BasicTable header={header} body={body} />
    </>
  );
}
