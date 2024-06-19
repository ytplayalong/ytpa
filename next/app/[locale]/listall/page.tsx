import { ListScores } from "@/app/components/listAll";
import { getStaticLocaleParams } from "@/i18n";

export default function ListAll() {
  return (
    <div className="container">
      <ListScores />
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
