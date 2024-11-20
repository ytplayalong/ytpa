import { LoginRequired } from "@/app/components/loginRequired";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function Favorites() {
  const defaultComponent = (
    <div className="container">
      <div style={containerInner}>Not implemented.</div>
    </div>
  );
  return <LoginRequired defaultComp={defaultComponent} />;
}
export const generateStaticParams = getStaticLocaleParams;
