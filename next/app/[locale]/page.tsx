import { getStaticLocaleParams } from "@/i18n";

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

export const generateStaticParams = getStaticLocaleParams;
