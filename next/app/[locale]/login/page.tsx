import LoginRedirect from "@/app/components/loginRedirect";

// The login page moved to /account, keep old links working.
export default function Login() {
  return <LoginRedirect />;
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
