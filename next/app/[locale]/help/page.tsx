import ContactForm from "@/app/components/contactForm";
import { getStaticLocaleParams } from "@/i18n";

export default function Help() {
  return (
    <div>
      <ContactForm />
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
