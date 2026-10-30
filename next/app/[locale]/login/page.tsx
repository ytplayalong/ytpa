import LoginRedirect from "@/app/components/loginRedirect";
import { pageMetadata } from "@/app/util/meta";

// The login page moved to /account, keep old links working.
export default function Login() {
  return <LoginRedirect />;
}

export const generateMetadata = pageMetadata({ path: "/login", noindex: true, noAlternates: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
