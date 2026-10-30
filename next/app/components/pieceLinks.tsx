"use client";

import Link from "next/link";

import usePathTranslation from "@/i18n/hook";

import { fullScoreInfo, ScoreInfo } from "../util/util";
import { Loading } from "./loading";

/** Links to pieces, only for crawlers and screen readers (not visible).
 *
 * The lists are drawn on the client. This is the fallback while they are
 * loading, so that the pre-rendered HTML contains the links to the pieces.
 */
export const PieceLinks = ({ scores }: { scores: readonly ScoreInfo[] }) => {
  const { t, getLink } = usePathTranslation();
  return (
    <nav className="visually-hidden" aria-label={t("allScores")}>
      <ul>
        {scores.map((sc) => (
          <li key={sc.videoId}>
            <Link href={getLink(`/piece?scoreId=${sc.videoId}`)}>
              {sc.name} - {sc.artist}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

/** Fallback of the list of all pieces. */
export const AllPiecesFallback = () => (
  <>
    <Loading addComp={false} />
    <PieceLinks scores={fullScoreInfo} />
  </>
);

/** Fallback of the recently added pieces on the home page. */
export const RecentPiecesFallback = () => (
  <>
    <Loading addComp={false} />
    <PieceLinks scores={[...fullScoreInfo].reverse().slice(0, 30)} />
  </>
);
