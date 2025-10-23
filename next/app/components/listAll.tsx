"use client";

import { Fragment, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";

import usePathTranslation from "@/i18n/hook";

import TimeSignatures from "../timeSignatures.json";
import { strLatinise } from "../util/sorting";
import { distributedStyle, inputStyle } from "../util/styles";
import { getScoreInfo, ScoreInfo, SortBy } from "../util/util";
import { ScoreTable, useFavoriteOption } from "./scoreTable";

type SortSetting = { by: SortBy; ascending: boolean };
type ScoreNameArtist = { name: string; artist: string };

const urlSep = "_";
const checkBoxStyle: React.CSSProperties = {
  minWidth: "18px",
  minHeight: "18px",
};
const divStyle: React.CSSProperties = { flex: "0.4" };
const equiSpacedBoxes: React.CSSProperties = {
  ...checkBoxStyle,
  textAlign: "left",
  marginLeft: 0,
};
const labelStyle = { flex: "1" };

/** Hook providing form to enter text for filtering scores. */
const useScoreFilter = (placeholder: string) => {
  const filterKey = "search";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const init = searchParams.get(filterKey) ?? "";
  const [filterS, setFilterS] = useState(init);

  const setFilterWrapped = (val: string) => {
    // Update URL such that search filter is represented
    const params = new URLSearchParams(searchParams);
    if (val === "") {
      params.delete(filterKey);
    } else {
      params.set(filterKey, val);
    }
    const newUrl = `${pathname}?${params.toString()}`;
    if (globalThis.history !== undefined) {
      globalThis.history.replaceState(null, "", newUrl);
    }

    setFilterS(val);
  };

  const filterForm = (
    <input
      placeholder={placeholder}
      onChange={(ev: { target: any }) => setFilterWrapped(ev.target.value)}
      value={filterS}
      style={inputStyle}
    ></input>
  );
  return [filterS, filterForm] as const;
};

/** Hook for sorting the scores. */
const useSortedScores = () => {
  const [sortSetting, setSortSetting] = useState<SortSetting>({
    by: "name",
    ascending: true,
  });

  const sortClick = (by: SortBy) => {
    const newSetting = { ...sortSetting };
    newSetting.ascending = !newSetting.ascending;
    if (newSetting.by !== by) {
      newSetting.ascending = true;
      newSetting.by = by;
    }
    setSortSetting(newSetting);
  };

  const sortFun = (a: ScoreNameArtist, b: ScoreNameArtist) => {
    // Put undefined at the end
    const sa = strLatinise(a[sortSetting.by]?.toLowerCase());
    const sb = strLatinise(b[sortSetting.by]?.toLowerCase());
    const pos = sortSetting.ascending ? 1 : -1;
    if (sa === undefined) {
      return pos;
    }
    if (sb === undefined) {
      return -pos;
    }
    if (sa < sb) {
      return -pos;
    } else if (sa > sb) {
      return pos;
    }
    return 0;
  };

  return { sortFun, sortClick, ...sortSetting };
};

const useTimeSignatureFilter = () => {
  const timeSigKey = "ts";
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initTimes = TimeSignatures.map(() => true);
  const param = searchParams.get(timeSigKey);
  const initialValues = param
    ? param.split(urlSep).map((v) => v === "1")
    : initTimes;

  const [chosenTimes, setChosenTimes] = useState<boolean[]>(initialValues);
  const setTimesWrapped = (values: boolean[]) => {
    const params = new URLSearchParams(searchParams);
    const serialized = values.map((b) => (b ? "1" : "0")).join(urlSep);
    params.set(timeSigKey, serialized);

    if (globalThis.history !== undefined) {
      const newUrl = `${pathname}?${params.toString()}`;
      globalThis.history.replaceState(null, "", newUrl);
    }
    setChosenTimes(values);
  };

  const comp = (
    <div style={{ ...distributedStyle, overflowX: "auto" }}>
      {TimeSignatures.map((el, idx) => (
        <Fragment key={`time-${el}`}>
          <div style={divStyle}>
            <input
              type="checkbox"
              name={`time-${el}`}
              checked={chosenTimes[idx]}
              onChange={() => {
                const newTimes = [...chosenTimes];
                newTimes[idx] = !newTimes[idx];
                setTimesWrapped(newTimes);
              }}
              style={equiSpacedBoxes}
            />
          </div>
          <label
            style={labelStyle}
            htmlFor={`time-${el}`}
          >{`${el[0]}/${el[1]}`}</label>
        </Fragment>
      ))}
    </div>
  );
  const allowedTimes = new Set(
    TimeSignatures.filter((_el, idx) => chosenTimes[idx]).map(
      (el) => `${el[0]},${el[1]}`
    )
  );
  return [comp, allowedTimes] as const;
};

/** Hook for filtering based on key signature. */
const useKeyFilter = () => {
  const keyKey = "sharps";
  const flats = [1, 2, 3, 4, 5, 6];
  const sharps = [1, 2, 3, 4, 5];
  const negFlats = flats.map((el) => -el);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get(keyKey);
  const initValue = [0, ...sharps, ...negFlats];
  const initialFromURL = param ? param.split(urlSep).map(Number) : initValue;

  const [chosenKeys, setChosenKeys] = useState<number[]>(initialFromURL);

  const sharpIsSet = (sharpIdx: number) => chosenKeys.includes(sharpIdx);
  const setSharp = (sharpIdx: number) => {
    const idx = chosenKeys.indexOf(sharpIdx);
    let keys: number[];
    if (idx === -1) {
      keys = [sharpIdx, ...chosenKeys];
    } else {
      keys = chosenKeys.filter((el) => el !== sharpIdx);
    }
    keys = initValue.filter((el) => keys.includes(el));
    setChosenKeys(keys);

    // Update URL such that key filter is represented
    const params = new URLSearchParams(searchParams);
    params.set(keyKey, keys.join(urlSep));
    const newUrl = `${pathname}?${params.toString()}`;
    if (globalThis.history !== undefined) {
      globalThis.history.replaceState(null, "", newUrl);
    }
  };

  const comp = (
    <div style={{ overflowX: "auto" }}>
      <div style={distributedStyle}>
        <div style={divStyle}>
          <input
            type="checkbox"
            name="none"
            id={`none`}
            checked={sharpIsSet(0)}
            onChange={() => setSharp(0)}
            style={equiSpacedBoxes}
          />
        </div>
        <label htmlFor="none" style={labelStyle}>{`0#`}</label>
        {sharps.map((el) => (
          <Fragment key={`sharp-${el}`}>
            <div style={divStyle}>
              <input
                type="checkbox"
                checked={sharpIsSet(el)}
                onChange={() => setSharp(el)}
                style={equiSpacedBoxes}
              />
            </div>
            <label htmlFor={`sharp-${el}`} style={labelStyle}>{`${el}#`}</label>
          </Fragment>
        ))}
      </div>
      <div style={distributedStyle}>
        {flats.map((el) => (
          <Fragment key={`flat-${el}`}>
            <div style={divStyle}>
              <input
                type="checkbox"
                checked={sharpIsSet(-el)}
                onChange={() => setSharp(-el)}
                style={equiSpacedBoxes}
              />
            </div>
            <label htmlFor={`flat-${el}`} style={labelStyle}>{`${el}♭`}</label>
          </Fragment>
        ))}
      </div>
    </div>
  );
  return [chosenKeys, comp] as const;
};

/** Hook for filtering and sorting scores. */
export const useProcessedScores = (scoreInfos: ScoreInfo[]) => {
  const { t } = usePathTranslation();
  const [filterS, filterForm] = useScoreFilter(t("txtFilterDefault"));
  const sortInfo = useSortedScores();
  const [keys, keyFilterComp] = useKeyFilter();
  const [timeFilterComp, times] = useTimeSignatureFilter();

  const rowStyle = { paddingTop: "1em" };
  const comp = (
    <>
      <div className="row" style={rowStyle}>
        <div className="twocols">{t("search")}</div>
        <div className="twocols rightcol">{filterForm}</div>
      </div>
      <div className="row" style={rowStyle}>
        <div className="twocols">{t("filter")}</div>
      </div>
      <div className="row" style={rowStyle}>
        <div className="twocols">{t("songKey")}</div>
        <div className="twocols rightcol">{keyFilterComp}</div>
      </div>
      <div className="row" style={rowStyle}>
        <div className="twocols">{t("timeSignature")}</div>
        <div className="twocols rightcol">{timeFilterComp}</div>
      </div>
    </>
  );
  const filterKeys = (el: ScoreInfo) => {
    const currKeys = el.keys;
    const allowedTimes = el.times
      .map((el) => `${el[0]},${el[1]}`)
      .filter((el) => times.has(el));
    if (allowedTimes.length === 0) {
      return false;
    }
    const allowedKeys = currKeys.filter((el) => keys.includes(el));
    if (allowedKeys.length === 0) {
      return false;
    }
    return true;
  };
  const filterAndSort = (scores: ScoreInfo[]) => {
    if (filterS) {
      // Apply filter
      const fLow = strLatinise(filterS.toLocaleLowerCase());
      scores = scores.filter(
        (el) =>
          strLatinise(el.name)?.toLocaleLowerCase().includes(fLow) ||
          strLatinise(el.artist)?.toLocaleLowerCase().includes(fLow)
      );
    }
    scores.sort(sortInfo.sortFun);
    return scores;
  };

  const scores = filterAndSort(scoreInfos).filter(filterKeys);
  return { scores, comp, sortInfo };
};

/** Lists all available scores. */
export const ListScores = () => {
  const { scores, comp, sortInfo } = useProcessedScores(getScoreInfo());

  const favOpt = useFavoriteOption();
  const scoreTable = (
    <ScoreTable scores={scores} sortInfo={sortInfo} options={favOpt.options} />
  );

  const { t } = usePathTranslation();
  const totScores = t("totScores", { num: scores.length });
  return (
    <>
      {comp}
      <div style={{ paddingTop: "2em", paddingBottom: "1em" }}>{totScores}</div>
      {scoreTable}
      {favOpt.overlay}
    </>
  );
};
