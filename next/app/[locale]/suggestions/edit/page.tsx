import SuggestionEditor from "@/app/components/suggestionEditor";
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

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
