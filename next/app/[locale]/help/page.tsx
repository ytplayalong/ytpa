import ContactForm from "@/app/components/forms/contactForm";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function Help() {
  return (
    <div className="container">
      <div style={containerInner}>
        <ContactForm />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
