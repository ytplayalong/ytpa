import RegisterForm from "@/app/components/forms/registerForm";
import { containerInner } from "@/app/util/styles";

export default function Register() {
  return (
    <div className="container">
      <div style={containerInner}>
        <RegisterForm />
      </div>
    </div>
  );
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
