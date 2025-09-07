import SongSuggestion from "@/app/components/forms/songSuggestion";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function SongSuggestionPage() {
  return (
    <div className="container">
      <div style={containerInner}>
        <SongSuggestion />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
