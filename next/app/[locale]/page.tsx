import { pageMetadata } from "@/app/util/meta";

import Home from "../components/home";
import { containerInner } from "../util/styles";

export default function HomeComp() {
  return (
    <div className="container">
      <div style={containerInner}>
        <Home />
      </div>
    </div>
  );
}

export const generateMetadata = pageMetadata({ path: "" });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
