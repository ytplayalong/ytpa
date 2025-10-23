import { ListScores } from "@/app/components/listAll";
import { containerInner } from "@/app/util/styles";
import { Suspense } from "react";

export default function ListAll() {
  return (
    <div className="container">
      <div style={containerInner}>
        <Suspense fallback={<div>Loading scores...</div>}>
          <ListScores />
        </Suspense>
      </div>
    </div>
  );
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
