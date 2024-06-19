import Score from "@/app/components/score";
import { fullScoreInfo } from "@/app/util/util";
import { getStaticLocaleParams } from "@/i18n";

export default function ScoreComp() {
  return <Score />;
}

export const generateStaticParams = () => {
  // Combine all locales and all scores
  const locales = getStaticLocaleParams();
  const ret: { locale: string; id: string }[] = [];
  locales.forEach((loc) => {
    fullScoreInfo.forEach((el) => {
      ret.push({ ...loc, id: el.videoId });
    });
  });
  return ret;
};
