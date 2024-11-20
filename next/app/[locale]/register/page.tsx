import RegisterForm from "@/app/components/forms/registerForm";
import { getStaticLocaleParams } from "@/i18n";

export default function Register() {
  return (
    <div className="container">
      <RegisterForm />
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
