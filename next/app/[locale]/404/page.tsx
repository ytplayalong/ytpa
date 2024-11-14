import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function NotFound() {
  return (
    <div className="container">
      <div style={containerInner}>
        <h3>This page was not found.</h3>
      </div>
    </div>
  );
}

export const generateStaticParams = getStaticLocaleParams;
