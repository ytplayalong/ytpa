import { ListScores } from "@/app/components/listAll";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function ListAll() {
  return (
    <div className="container">
      <div style={containerInner}>
        <ListScores />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
