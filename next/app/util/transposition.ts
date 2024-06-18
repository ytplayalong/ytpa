import scoreInfoJson from "../scores.json";

const transposeOptions: { [key: string]: [number, number] } = {
  C: [0, 0],
  "B♭": [2, 2],
  F: [7, 1],
  "E♭": [9, 3],
};
export const transposeKeys = Object.keys(transposeOptions);
export const intToKey = (fifths: number) => {
  if (fifths >= 0) {
    return `${fifths}#`;
  }
  return `${-fifths}♭`;
};

export const sortBy = ["name", "artist"] as const;
export type SortBy = (typeof sortBy)[number];
export type MeasureMap = { [key: number]: number };
export type ScoreInfo = {
  videoId: string;
  measureMap: MeasureMap;
  fileName: string;
  artist: string;
  name: string;
  language: string;
  keys: number[];
  times: [number, number][];
};
const scoreInfo: ScoreInfo[] = scoreInfoJson as any;
export const getScoreInfo = () => {
  return [...scoreInfo];
};
