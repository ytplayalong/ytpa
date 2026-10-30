import SuggestionEditor from "@/app/components/suggestionEditor";
import { pageMetadata } from "@/app/util/meta";
import { containerInner } from "@/app/util/styles";

export default function SuggestionEditPage() {
  return (
    <div className="container">
      <div style={containerInner}>
        <SuggestionEditor />
      </div>
    </div>
  );
}

export const generateMetadata = pageMetadata({ path: "/suggestions/edit", titleKey: "editSuggestions", noindex: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
