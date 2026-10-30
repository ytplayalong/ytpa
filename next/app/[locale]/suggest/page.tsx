import SongSuggestion from "@/app/components/forms/songSuggestion";
import { pageMetadata } from "@/app/util/meta";
import { containerInner } from "@/app/util/styles";

export default function SongSuggestionPage() {
  return (
    <div className="container">
      <div style={containerInner}>
        <SongSuggestion />
      </div>
    </div>
  );
}

export const generateMetadata = pageMetadata({ path: "/suggest", titleKey: "songSuggestion", noindex: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
