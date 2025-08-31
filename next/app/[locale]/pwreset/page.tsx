import PwResetForm from "@/app/components/forms/pwResetForm";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function PwReset() {
  return (
    <div className="container">
      <div style={containerInner}>
        <PwResetForm />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
