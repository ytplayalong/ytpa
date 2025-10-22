import PwResetForm from "@/app/components/forms/pwResetForm";
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

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
