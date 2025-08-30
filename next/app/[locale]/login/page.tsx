import LoginForm from "@/app/components/forms/loginForm";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function Login() {
  return (
    <div className="container">
      <div style={containerInner}>
        <LoginForm />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
