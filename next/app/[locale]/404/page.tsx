import { containerInner } from "@/app/util/styles";

export default function NotFound() {
  return (
    <div className="container">
      <div style={containerInner}>
        <h3>This page was not found.</h3>
      </div>
    </div>
  );
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
