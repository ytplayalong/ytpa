import SettingPage from "@/app/components/settingPage";
import { containerInner } from "@/app/util/styles";

export default function Settings() {
  return (
    <div className="container">
      <div style={containerInner}>
        <SettingPage />
      </div>
    </div>
  );
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
