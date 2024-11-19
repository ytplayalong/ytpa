import LoginForm from "@/app/components/forms/loginForm";
import RegisterForm from "@/app/components/forms/registerForm";
import { getStaticLocaleParams } from "@/i18n";

export default function Favorites() {
  return (
    <div className="container">
      <LoginForm />
      <RegisterForm />
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
