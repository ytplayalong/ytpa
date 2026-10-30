import LoginForm from "@/app/components/forms/loginForm";
import { pageMetadata } from "@/app/util/meta";
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

export const generateMetadata = pageMetadata({ path: "/account", titleKey: "manageAccount", noindex: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
