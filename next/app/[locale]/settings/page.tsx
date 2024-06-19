import SettingsComp from "@/app/components/settings";
import { getStaticLocaleParams } from "@/i18n";

export default function Settings() {
  return (
    <div className="container">
      <SettingsComp />
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
