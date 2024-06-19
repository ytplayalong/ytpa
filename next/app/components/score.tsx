"use client";

import { usePathname } from "next/navigation";
import { ScoreInfo, fullScoreInfo } from "../util/util";
import { PartSelector } from "./partSelector";
import { useYoutubePlayer } from "../util/player";

export const YtScore = () => {
  const pathname = usePathname();
  const scoreId = pathname.split("/")[3];

  const scoreInfoCand = fullScoreInfo.filter((el) => el.videoId === scoreId);
  if (scoreInfoCand.length === 0) {
    // No match for score ID found in list.
    return (
      <h3>
        YouTube score with ID <b>{scoreId}</b> not found :(
      </h3>
    );
  }
  const scoreInfo = scoreInfoCand[0];
  return <FoundYtScore scoreInfo={scoreInfo} />;
};

const FoundYtScore = ({ scoreInfo }: { scoreInfo: ScoreInfo }) => {
  const player = useYoutubePlayer(scoreInfo.videoId);
  const fileName = `/mxl/${scoreInfo.fileName}.musicxml`;
  const partSel = (
    <PartSelector
      measureMap={scoreInfo.measureMap}
      player={player}
      fileName={fileName}
    ></PartSelector>
  );

  return partSel;
};

export default YtScore;
