import { Suspense } from "react";

import { Loading } from "@/app/components/loading";
import { QueryScore } from "@/app/components/score";
import { getStaticLocaleParams } from "@/i18n";

export default function ScoreComp() {
  const loading = <Loading addComp={true} />;
  return (
    <Suspense fallback={loading}>
      <QueryScore />
    </Suspense>
  );
}

export const generateStaticParams = getStaticLocaleParams;
