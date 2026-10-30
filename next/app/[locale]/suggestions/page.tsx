import SuggestionList from "@/app/components/suggestionList";
import { pageMetadata } from "@/app/util/meta";
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

export const generateMetadata = pageMetadata({ path: "/suggestions", titleKey: "suggestions", noindex: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
