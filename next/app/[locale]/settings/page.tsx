import ContactForm from "@/app/components/forms/contactForm";
import LoginForm from "@/app/components/forms/loginForm";
import SongSuggestion from "@/app/components/forms/songSuggestion";
import SettingsComp from "@/app/components/settings";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function Settings() {
  return (
    <div className="container">
      <div style={containerInner}>
        <LoginForm />
        <SettingsComp />
        <SongSuggestion />
        <ContactForm />
      </div>
    </div>
  );
}
export const generateStaticParams = getStaticLocaleParams;
