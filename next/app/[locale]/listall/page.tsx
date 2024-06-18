import { ListScores } from "@/app/components/listAll";
import { getStaticLocaleParams } from "@/i18n";

export default function ListAll() {
  return <ListScores />;
}
export const generateStaticParams = getStaticLocaleParams;
