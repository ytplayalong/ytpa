import { QueryScore } from "@/app/components/score";
import { getStaticLocaleParams } from "@/i18n";
import { Suspense } from "react";

export default function ScoreComp() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <QueryScore />
    </Suspense>
  );
}

export const generateStaticParams = getStaticLocaleParams;
