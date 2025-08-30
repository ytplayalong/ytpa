import RegisterForm from "@/app/components/forms/registerForm";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function Register() {
  return (
    <div className="container">
      <div style={containerInner}>
        <RegisterForm />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
