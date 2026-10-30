import RegisterForm from "@/app/components/forms/registerForm";
import { pageMetadata } from "@/app/util/meta";
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

export const generateMetadata = pageMetadata({ path: "/register", titleKey: "register", noindex: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
