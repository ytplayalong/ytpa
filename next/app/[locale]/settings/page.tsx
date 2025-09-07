import SettingPage from "@/app/components/settingPage";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function Settings() {
  return (
    <div className="container">
      <div style={containerInner}>
        <SettingPage />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
