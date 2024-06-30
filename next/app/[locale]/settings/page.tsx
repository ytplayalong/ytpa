import SettingsComp from "@/app/components/settings";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function Settings() {
  return (
    <div className="container">
      <div style={containerInner}>
        <SettingsComp />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
