import usePathTranslation from "@/i18n/hook";
import { useRouter } from "next/navigation";
import { ScoreInfo, SortBy, sortBy, intToKey } from "../util/util";

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
  const tdStyle: any = { paddingLeft: ".4em" };
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
          return (
            <tr
              key={el.videoId}
              onClick={() => router.push(getLink(`/piece/${el.videoId}`))}
              style={{ cursor: "pointer" }}
              className="hoverlink"
            >
              <td>
                <img
                  src={`https://img.youtube.com/vi/${el.videoId}/default.jpg`}
                  alt={`YouTube thumbnail of ${el.name} by ${el.artist}`}
                ></img>
              </td>
              {sortBy.map((field) => {
                return (
                  <td key={`td-${field}`} style={tdStyle}>
                    {el[field]?.trim()}
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
