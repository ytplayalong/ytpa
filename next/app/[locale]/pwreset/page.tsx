import PwResetForm from "@/app/components/forms/pwResetForm";
import { pageMetadata } from "@/app/util/meta";
import { containerInner } from "@/app/util/styles";

export default function PwReset() {
  return (
    <div className="container">
      <div style={containerInner}>
        <PwResetForm />
      </div>
    </div>
  );
}

export const generateMetadata = pageMetadata({ path: "/pwreset", titleKey: "pwReset", noindex: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
