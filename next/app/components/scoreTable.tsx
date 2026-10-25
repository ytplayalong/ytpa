import { useEffect, useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

import usePathTranslation from "@/i18n/hook";

import firebaseManager, { useCurrentUser } from "../firebase";
import useOverlay from "../util/overlay";
import { getButtonAttrs } from "../util/styles";
import { intToKey, ScoreInfo, SortBy, sortBy } from "../util/util";
import {
  BasicTable,
  leftTdStyle,
  tableRowHeight,
  tdStyle,
  thStyle,
  wrapLinkedCell,
} from "../util/tables";
import { usePaginatedList } from "../hooks/pagination";

/** Option for a piece, the name and icon can depend on the piece. */
export type TableEntryOption = {
  name: string | ((scoreId: string) => string);
  icon?: React.ReactNode | ((scoreId: string) => React.ReactNode);
  onClick: (scoreId: string) => void;
};

/** Name and icon of an option for the given piece. */
export const resolveOption = (opt: TableEntryOption, scoreId: string) => ({
  name: typeof opt.name === "function" ? opt.name(scoreId) : opt.name,
  icon: typeof opt.icon === "function" ? opt.icon(scoreId) : opt.icon,
});

/** Option for adding a piece to the favorites or removing it again.
 *
 * The icon shows if the piece is a favorite (filled heart).
 */
export const useFavoriteOption = () => {
  const { t } = usePathTranslation();
  const overlay = useOverlay(t("notLoggedIn"));
  const user = useCurrentUser();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      return;
    }
    let cancelled = false;
    firebaseManager
      .getFavorites()
      .then((list) => !cancelled && setFavorites(new Set(list)))
      .catch((err) => console.log(err));
    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggleFavorite = async (scoreId: string) => {
    if (!firebaseManager.userLoggedIn()) {
      overlay.open();
      return;
    }
    const wasFavorite = favorites.has(scoreId);
    const update = (isFavorite: boolean) =>
      setFavorites((prev) => {
        const next = new Set(prev);
        if (isFavorite) {
          next.add(scoreId);
        } else {
          next.delete(scoreId);
        }
        return next;
      });

    update(!wasFavorite); // Immediate feedback
    try {
      if (wasFavorite) {
        await firebaseManager.removeFromFavorites(scoreId);
      } else {
        await firebaseManager.addFavorite(scoreId);
      }
    } catch (err) {
      console.log(err);
      update(wasFavorite); // Did not work, undo
    }
  };

  const options: TableEntryOption[] = [
    {
      name: (id) =>
        favorites.has(id) ? t("favoritesRemove") : t("favoritesAdd"),
      icon: (id) =>
        favorites.has(id) ? (
          <MdFavorite size={20} style={{ color: "var(--danger)" }} />
        ) : (
          <MdFavoriteBorder size={20} />
        ),
      onClick: toggleFavorite,
    },
  ];
  return { options, overlay: overlay.component };
};

export const ScoreTable = ({
  scores,
  sortInfo,
  options,
}: {
  scores: ScoreInfo[];
  sortInfo?: {
    by: SortBy;
    ascending: boolean;
    sortClick: (by: SortBy) => void;
  };
  options?: TableEntryOption[];
}) => {
  const { t, getLink } = usePathTranslation();

  // TODO: Make this a setting
  const scoresPerPage = 20;
  const { currentChunk, navComponent, setPage } = usePaginatedList(
    scores,
    scoresPerPage,
  );

  const definedOptions = options || [];
  const optionButtons = (scoreId: string) => (
    <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
      {definedOptions.map((opt, idx) => {
        const { name, icon } = resolveOption(opt, scoreId);
        return (
          <button
            key={idx}
            onClick={() => opt.onClick(scoreId)}
            title={name}
            aria-label={name}
            {...getButtonAttrs("40px")}
          >
            {icon ?? name}
          </button>
        );
      })}
    </div>
  );

  const hasOptions = definedOptions.length > 0;
  const imgColWidth = "10%";
  const nameArtistColWidth = hasOptions ? "35%" : "40%";
  const keyColWidth = "10%";
  const optionColWidth = "9%";

  const tableHeaderSortable = sortBy.map((el) => {
    let ex = "";
    if (sortInfo !== undefined) {
      if (sortInfo.by === el) {
        ex = sortInfo.ascending ? "▴" : "▾";
      }
    }
    const sortClicked = () => {
      if (sortInfo) {
        sortInfo.sortClick(el);
        setPage(1); // Reset page index if sorted differently
      }
    };
    return (
      <th
        key={el}
        onClick={sortClicked}
        style={{ cursor: "pointer", width: nameArtistColWidth, ...thStyle }}
      >
        {t(el)}
        {ex}
      </th>
    );
  });

  const optionsHeader = hasOptions ? (
    <th style={{ width: optionColWidth, ...thStyle }}></th>
  ) : undefined;

  const header = (
    <>
      <th style={{ width: imgColWidth, ...thStyle }}></th>
      {tableHeaderSortable}
      <th style={{ width: keyColWidth, ...thStyle }}>{t("songKey")}</th>
      {optionsHeader}
    </>
  );

  const body = (
    <>
      {currentChunk.map((el) => {
        const optionComp = hasOptions ? (
          <td style={tdStyle}>{optionButtons(el.videoId)}</td>
        ) : undefined;

        const link = getLink(`/piece?scoreId=${el.videoId}`);
        return (
          <tr
            key={el.videoId}
            style={{ cursor: "pointer", height: tableRowHeight }}
            className="hoverlink"
          >
            <td style={leftTdStyle}>
              {wrapLinkedCell(
                <img
                  height={tableRowHeight}
                  src={`https://img.youtube.com/vi/${el.videoId}/default.jpg`}
                  alt={t("thumbnailAlt", { name: el.name, artist: el.artist })}
                ></img>,
                link,
              )}
            </td>
            {sortBy.map((field) => {
              return (
                <td key={`td-${field}`} style={tdStyle}>
                  {wrapLinkedCell(el[field]?.trim(), link)}
                </td>
              );
            })}
            <td style={tdStyle}>{wrapLinkedCell(getKeys(el.keys), link)}</td>
            {optionComp}
          </tr>
        );
      })}
    </>
  );

  return (
    <>
      {navComponent}
      <BasicTable header={header} body={body} />
      {navComponent}
    </>
  );
};

const getKeys = (keyInts: number[]) => {
  return keyInts.map(intToKey).join(", ");
};
