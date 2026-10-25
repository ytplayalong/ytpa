import { MdFavoriteBorder } from "react-icons/md";

import usePathTranslation from "@/i18n/hook";

import firebaseManager from "../firebase";
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

export type TableEntryOption = {
  name: string;
  icon?: React.ReactNode;
  onClick: (scoreId: string) => void;
};

export const useFavoriteOption = () => {
  const { t } = usePathTranslation();
  const overlay = useOverlay(t("notLoggedIn"));

  const addToFavorites = (scoreId: string) => {
    if (!firebaseManager.userLoggedIn()) {
      overlay.open();
    }
    firebaseManager.addFavorite(scoreId);
  };
  const options = [
    {
      name: t("favoritesAdd"),
      icon: <MdFavoriteBorder size={20} />,
      onClick: addToFavorites,
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
      {definedOptions.map((opt) => (
        <button
          key={opt.name}
          onClick={() => opt.onClick(scoreId)}
          title={opt.name}
          aria-label={opt.name}
          {...getButtonAttrs("40px")}
        >
          {opt.icon ?? opt.name}
        </button>
      ))}
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
                  alt={`YouTube thumbnail of ${el.name} by ${el.artist}`}
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
