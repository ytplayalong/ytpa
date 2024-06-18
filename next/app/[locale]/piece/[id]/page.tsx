import Score from "@/app/components/score";
import { getScoreInfo } from "@/app/util/transposition";
import { getStaticLocaleParams } from "@/i18n";

export default function ScoreComp() {
  return <Score />;
}

export const generateStaticParams = () => {
  // Combine all locales and all scores
  const locales = getStaticLocaleParams();
  const ret: { locale: string; id: string }[] = [];
  const scoreInfo = getScoreInfo();
  locales.forEach((loc) => {
    scoreInfo.forEach((el) => {
      ret.push({ ...loc, id: el.videoId });
    });
  });
  return ret;
};
