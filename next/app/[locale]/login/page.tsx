import LoginForm from "@/app/components/forms/loginForm";
import { getStaticLocaleParams } from "@/i18n";

export default function Login() {
  return (
    <div className="container">
      <LoginForm />
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
