import usePathTranslation from "@/i18n/hook";
import { useRouter } from "next/navigation";
import { ScoreInfo, SortBy, sortBy, intToKey } from "../util/util";

const tableLinkStyle = {
  font: "inherit",
  color: "inherit",
  textDecoration: "none",
};

const tableRowHeight = "80px";

export const ScoreTable = ({
  scores,
  sortInfo,
}: {
  scores: ScoreInfo[];
  sortInfo?: {
    by: SortBy;
    ascending: boolean;
    sortClick: (by: SortBy) => void;
  };
}) => {
  const router = useRouter();
  const { t, getLink } = usePathTranslation();
  const tdStyle = { paddingLeft: ".4em" };
  const thStyle: any = { textAlign: "left", ...tdStyle };

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
        style={{ cursor: "pointer", width: "40%", ...thStyle }}
      >
        {t(el)}
        {ex}
      </th>
    );
  });
  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th style={{ width: "10%", ...thStyle }}></th>
          {th}
          <th style={{ width: "10%", ...thStyle }}>{t("songKey")}</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((el) => {
          const link = getLink(`/piece?scoreId=${el.videoId}`);
          return (
            <tr
              key={el.videoId}
              onClick={() => router.push(link)}
              style={{ cursor: "pointer" }}
              className="hoverlink"
            >
              <td>
                <img
                  height={tableRowHeight}
                  src={`https://img.youtube.com/vi/${el.videoId}/default.jpg`}
                  alt={`YouTube thumbnail of ${el.name} by ${el.artist}`}
                ></img>
              </td>
              {sortBy.map((field) => {
                return (
                  <td key={`td-${field}`} style={tdStyle}>
                    <a href={link} style={tableLinkStyle}>
                      <div
                        style={{
                          height: tableRowHeight,
                          lineHeight: tableRowHeight,
                        }}
                      >
                        {el[field]?.trim()}
                      </div>
                    </a>
                  </td>
                );
              })}
              <td style={tdStyle}>{getKeys(el.keys)}</td>
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
