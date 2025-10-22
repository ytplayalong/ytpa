import SuggestionList from "@/app/components/suggestionList";
import { containerInner } from "@/app/util/styles";

export default function SongSuggestionPage() {
  return (
    <div className="container">
      <div style={containerInner}>
        <SuggestionList />
      </div>
    </div>
  );
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
