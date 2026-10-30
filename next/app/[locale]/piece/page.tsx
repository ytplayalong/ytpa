import { Suspense } from "react";

import { Loading } from "@/app/components/loading";
import { QueryScore } from "@/app/components/score";
import { pageMetadata } from "@/app/util/meta";

export default function ScoreComp() {
  const loading = <Loading addComp={true} />;
  return (
    <Suspense fallback={loading}>
      <QueryScore />
    </Suspense>
  );
}

export const generateMetadata = pageMetadata({ path: "/piece", noAlternates: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
