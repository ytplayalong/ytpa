import SongSuggestion from "@/app/components/forms/songSuggestion";
import YouTubeSearch from "@/app/components/ytSearch";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function SongSuggestionPage() {
  return (
    <div className="container">
      <div style={containerInner}>
        <YouTubeSearch />
        <SongSuggestion />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
