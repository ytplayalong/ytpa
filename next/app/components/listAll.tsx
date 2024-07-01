"use client";

import { Fragment, useState } from "react";
import { strLatinise } from "../util/sorting";
import TimeSignatures from "../timeSignatures.json";
import usePathTranslation from "@/i18n/hook";
import { ScoreTable } from "./scoreTable";
import { distributedStyle, inputStyle } from "../util/styles";
import { ScoreInfo, SortBy, getScoreInfo } from "../util/util";

type SortSetting = { by: SortBy; ascending: boolean };
type ScoreNameArtist = { name: string; artist: string };

/** Hook providing form to enter text for filtering scores. */
const useScoreFilter = (placeholder: string) => {
  const [filterS, setFilterS] = useState<string | undefined>(undefined);
  const filterForm = (
    <input
      placeholder={placeholder}
      onChange={(ev: { target: any }) => setFilterS(ev.target.value)}
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

const checkBoxStyle = {
  minWidth: "18px",
  minHeight: "18px",
};

const useTimeSignatureFilter = () => {
  const initTimes = TimeSignatures.map(() => true);
  const [chosenTimes, setChosenTimes] = useState<boolean[]>(initTimes);
  const comp = (
    <div style={distributedStyle}>
      {TimeSignatures.map((el, idx) => (
        <Fragment key={`time-${el}`}>
          <label htmlFor={`time-${el}`}>{`${el[0]}/${el[1]}`}</label>
          <input
            type="checkbox"
            name={`time-${el}`}
            checked={chosenTimes[idx]}
            onChange={() => {
              const newTimes = [...chosenTimes];
              newTimes[idx] = !newTimes[idx];
              setChosenTimes(newTimes);
            }}
            style={checkBoxStyle}
          />
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
  const flats = [1, 2, 3, 4, 5, 6];
  const sharps = [1, 2, 3, 4, 5];
  const negFlats = flats.map((el) => -el);
  const initValue = [0, ...sharps, ...negFlats];
  const [chosenKeys, setChosenKeys] = useState<number[]>(initValue);

  const sharpIsSet = (sharpIdx: number) => chosenKeys.includes(sharpIdx);
  const setSharp = (sharpIdx: number) => {
    const idx = chosenKeys.indexOf(sharpIdx);
    if (idx === -1) {
      setChosenKeys([sharpIdx, ...chosenKeys]);
    } else {
      setChosenKeys(chosenKeys.filter((el) => el !== sharpIdx));
    }
  };
  const comp = (
    <div>
      <div style={distributedStyle}>
        <label htmlFor="none">{`0 #`}</label>
        <input
          type="checkbox"
          name="none"
          id={`none`}
          checked={sharpIsSet(0)}
          onChange={() => setSharp(0)}
          style={checkBoxStyle}
        />
        {sharps.map((el) => (
          <Fragment key={`sharp-${el}`}>
            <label htmlFor={`sharp-${el}`}>{`${el} #`}</label>
            <input
              type="checkbox"
              checked={sharpIsSet(el)}
              onChange={() => setSharp(el)}
              style={checkBoxStyle}
            />
          </Fragment>
        ))}
      </div>
      <div style={distributedStyle}>
        {flats.map((el) => (
          <Fragment key={`flat-${el}`}>
            <label htmlFor={`flat-${el}`}>{`${el} ♭`}</label>
            <input
              type="checkbox"
              checked={sharpIsSet(-el)}
              onChange={() => setSharp(-el)}
              style={checkBoxStyle}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
  return [chosenKeys, comp] as const;
};

/** Hook for filtering and sorting scores. */
const useProcessedScores = () => {
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

  const scores = filterAndSort(getScoreInfo()).filter(filterKeys);
  return { scores, comp, sortInfo };
};

/** Lists all available scores. */
export const ListScores = () => {
  const { scores, comp, sortInfo } = useProcessedScores();
  const scoreTable = <ScoreTable scores={scores} sortInfo={sortInfo} />;

  const { t } = usePathTranslation();
  const totScores = t("totScores", { num: scores.length });
  return (
    <>
      {comp}
      <div style={{ paddingTop: "1em" }}>{totScores}</div>
      {scoreTable}
    </>
  );
};
