import PageNotFound from "@/app/components/pageNotFound";

export default function NotFound() {
  return <PageNotFound />;
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
