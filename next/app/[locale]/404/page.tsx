import PageNotFound from "@/app/components/pageNotFound";
import { pageMetadata } from "@/app/util/meta";

export default function NotFound() {
  return <PageNotFound />;
}

export const generateMetadata = pageMetadata({ path: "/404", titleKey: "pageNotFound", noindex: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
