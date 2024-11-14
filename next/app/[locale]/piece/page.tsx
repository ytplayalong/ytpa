import { QueryScore } from "@/app/components/score";
import { getStaticLocaleParams } from "@/i18n";

export default function ScoreComp() {
  return <QueryScore />;
}

export const generateStaticParams = getStaticLocaleParams;
