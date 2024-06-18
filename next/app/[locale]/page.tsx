import { getStaticLocaleParams } from "@/i18n";
import Home from "../components/home";

export default function HomeComp() {
  return <Home />;
}

export const generateStaticParams = getStaticLocaleParams;
