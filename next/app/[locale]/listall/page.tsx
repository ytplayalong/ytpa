import { Suspense } from "react";

import { ListScores } from "@/app/components/listAll";
import { AllPiecesFallback } from "@/app/components/pieceLinks";
import { pageMetadata } from "@/app/util/meta";
import { containerInner } from "@/app/util/styles";

export default function ListAll() {
  return (
    <div className="container">
      <div style={containerInner}>
        <Suspense fallback={<AllPiecesFallback />}>
          <ListScores />
        </Suspense>
      </div>
    </div>
  );
}

export const generateMetadata = pageMetadata({ path: "/listall", titleKey: "allScores", descriptionKey: "listallDescription" });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
