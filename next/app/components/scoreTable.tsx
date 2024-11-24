import usePathTranslation from "@/i18n/hook";
import { ScoreInfo, SortBy, sortBy, intToKey } from "../util/util";
import { MdMoreVert } from "react-icons/md";
import { useMultiDropDown } from "../util/dropdown";

const tableRowHeight = "80px";
const tableRowMargin = "6px";

const noSpace = {
  padding: 0,
  margin: 0,
};
const tableLinkStyle = {
  font: "inherit",
  color: "inherit",
  textDecoration: "none",
  height: tableRowHeight,
  display: "block",
  ...noSpace,
};

const leftTdStyle = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingRight: 0,
};
const tdStyle = {
  ...leftTdStyle,
  paddingLeft: ".4em",
};

/** Wrap table cell such that it links to the provided link. */
const wrapLinkedCell = (inner: any, link: string) => {
  return (
    <a href={link} style={tableLinkStyle}>
      <div
        style={{
          height: tableRowHeight,
          alignContent: "center",
        }}
      >
        {inner}
      </div>
    </a>
  );
};

export type TableEntryOption = {
  name: string;
  onClick: (scoreId: string) => void;
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

  const definedOptions = options ? options : [];
  const optionDdItems = definedOptions.map((el) => {
    return { key: el.name, ...el };
  });
  const ddWrapper = (el: any, onClick: any) => (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        height: tableRowHeight,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {el}
    </div>
  );
  const baseElementStyle = { width: "100%" };
  const sheetDD = useMultiDropDown(
    <MdMoreVert />,
    optionDdItems,
    ddWrapper,
    baseElementStyle
  );

  const thStyle: any = { textAlign: "left", ...tdStyle };

  const hasOptions = definedOptions.length > 0;
  const imgColWidth = "10%";
  const nameArtistColWidth = hasOptions ? "38%" : "40%";
  const keyColWidth = "10%";
  const optionColWidth = "4%";

  const th = sortBy.map((el) => {
    let ex = "";
    if (sortInfo !== undefined) {
      if (sortInfo.by === el) {
        ex = sortInfo.ascending ? "▴" : "▾";
      }
    }
    return (
      <th
        key={el}
        onClick={() => sortInfo?.sortClick(el)}
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
  const tableHeader = (
    <thead style={{ width: "100%" }}>
      <tr style={{ width: "100%" }}>
        <th style={{ width: imgColWidth, ...thStyle }}></th>
        {th}
        <th style={{ width: keyColWidth, ...thStyle }}>{t("songKey")}</th>
        {optionsHeader}
      </tr>
    </thead>
  );

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: `0 ${tableRowMargin}`,
      }}
    >
      {tableHeader}
      <tbody>
        {scores.map((el) => {
          const optionComp = hasOptions ? (
            <td style={tdStyle}>{sheetDD(el.videoId)}</td>
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
                  link
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
      </tbody>
    </table>
  );
};

const getKeys = (keyInts: number[]) => {
  return keyInts.map(intToKey).join(", ");
};
