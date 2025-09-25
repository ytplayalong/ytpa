import SuggestionList from "@/app/components/suggestionList";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function SongSuggestionPage() {
  return (
    <div className="container">
      <div style={containerInner}>
        <SuggestionList />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
