import LoginForm from "@/app/components/forms/loginForm";
import { containerInner } from "@/app/util/styles";

export default function Login() {
  return (
    <div className="container">
      <div style={containerInner}>
        <LoginForm />
      </div>
    </div>
  );
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
