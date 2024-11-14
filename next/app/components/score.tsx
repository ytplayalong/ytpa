"use client";

import { ScoreInfo, fullScoreInfo } from "../util/util";
import { PartSelector } from "./partSelector";
import { useYoutubePlayer } from "../util/player";
import { useRouter, useSearchParams } from "next/navigation";
import usePathTranslation from "@/i18n/hook";

export const YtScore = (props: { scoreId: string }) => {
  const scoreInfoCand = fullScoreInfo.filter(
    (el) => el.videoId === props.scoreId
  );
  if (scoreInfoCand.length === 0) {
    // No match for score ID found in list.
    return (
      <h3>
        YouTube score with ID <b>{props.scoreId}</b> not found :(
      </h3>
    );
  }
  const scoreInfo = scoreInfoCand[0];
  return <FoundYtScore scoreInfo={scoreInfo} />;
};

const FoundYtScore = ({ scoreInfo }: { scoreInfo: ScoreInfo }) => {
  const player = useYoutubePlayer(scoreInfo.videoId);
  const partSel = (
    <PartSelector scoreInfo={scoreInfo} player={player}></PartSelector>
  );

  return partSel;
};

export const QueryScore = () => {
  const searchParams = useSearchParams();
  const scoreId = searchParams.get("scoreId"); // Get the 'id' query parameter
  const router = useRouter();
  const { getLink } = usePathTranslation();

  if (scoreId === undefined || typeof scoreId !== "string") {
    router.push(getLink(`/404`));
    return <></>;
  }
  return <YtScore scoreId={scoreId} />;
};

export default YtScore;
