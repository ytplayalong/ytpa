import { Suspense } from "react";

import { ListScores } from "@/app/components/listAll";
import { Loading } from "@/app/components/loading";
import { containerInner } from "@/app/util/styles";

export default function ListAll() {
  return (
    <div className="container">
      <div style={containerInner}>
        <Suspense fallback={<Loading addComp={false} />}>
          <ListScores />
        </Suspense>
      </div>
    </div>
  );
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
