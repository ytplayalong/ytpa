import SettingsComp from "@/app/components/settings";
import { getStaticLocaleParams } from "@/i18n";

export default function Settings() {
  return <SettingsComp />;
}
export const generateStaticParams = getStaticLocaleParams;
