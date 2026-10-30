import SettingPage from "@/app/components/settingPage";
import { pageMetadata } from "@/app/util/meta";
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

export const generateMetadata = pageMetadata({ path: "/settings", titleKey: "settingsTitle", noindex: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
