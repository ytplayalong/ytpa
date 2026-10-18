"use client";

import { useRef, useState } from "react";

import usePathTranslation from "@/i18n/hook";

import firebaseManager, { useCurrentUser } from "../firebase";
import { createFavoritesFile, parseFavoritesFile } from "../util/favoritesFile";
import { getButtonAttrs } from "../util/styles";

/** Export and import of the favorites (JSON file), e.g. for moving them to
 * another account.
 */
export default function FavoritesBackup() {
  const { t } = usePathTranslation();
  const user = useCurrentUser();
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  if (!user) {
    return null; // Favorites are only available for logged-in users
  }

  const onExport = async () => {
    const favorites = await firebaseManager.getFavorites();
    if (favorites.length === 0) {
      setMessage(t("favoritesExportEmpty"));
      return;
    }
    const blob = new Blob([createFavoritesFile(favorites)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ytpa-favorites.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("");
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // Allows to select the same file again
    if (!file) {
      return;
    }
    try {
      const { ids, unknown } = parseFavoritesFile(await file.text());
      const { added, alreadyFavorites } =
        await firebaseManager.addFavorites(ids);
      setMessage(
        t("favoritesImported", { num: added, existing: alreadyFavorites, unknown }),
      );
    } catch (err) {
      console.log(err);
      setMessage(t("favoritesImportFailed"));
    }
  };

  const btn = getButtonAttrs("160px");
  return (
    <>
      <h4>{t("favoritesBackup")}</h4>
      <p>{t("favoritesBackupTxt")}</p>
      <div style={{ display: "flex", gap: "0.5em", flexWrap: "wrap" }}>
        <button onClick={onExport} {...btn}>
          {t("exportFavorites")}
        </button>
        <button onClick={() => fileInput.current?.click()} {...btn}>
          {t("importFavorites")}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          onChange={onImport}
          style={{ display: "none" }}
        />
      </div>
      {message && <p>{message}</p>}
    </>
  );
}
