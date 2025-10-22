import { Suspense } from "react";

import { Loading } from "@/app/components/loading";
import { QueryScore } from "@/app/components/score";

export default function ScoreComp() {
  const loading = <Loading addComp={true} />;
  return (
    <Suspense fallback={loading}>
      <QueryScore />
    </Suspense>
  );
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
