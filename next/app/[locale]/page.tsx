import { getStaticLocaleParams } from "@/i18n";
import Home from "../components/home";

export default function HomeComp() {
  return (
    <div className="container">
      <Home />
    </div>
  );
}

export const generateStaticParams = getStaticLocaleParams;
