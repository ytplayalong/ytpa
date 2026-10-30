import i18n from "i18next";
import { usePathname } from "next/navigation";
import { initReactI18next, useTranslation } from "react-i18next";

import { defaultLocale,LANGUAGES, RESSOURCES } from ".";

// Fallback for components outside of the provider of a language (see
// provider.tsx), e.g. the page that redirects to the 404 page.
i18n.use(initReactI18next).init({
  fallbackLng: defaultLocale,
  lng: defaultLocale,
  interpolation: { escapeValue: false },
  resources: RESSOURCES,
});

const usePathTranslation = () => {
  const pathname = usePathname();
  const { t, i18n } = useTranslation(); // The language of the provider
  const locale = pathname.split("/")[1];

  const usedLocale = LANGUAGES.includes(locale) ? locale : defaultLocale;

  // Links always use a valid language (the path of a wrong URL has none)
  const getLink = (url: string) => "/" + usedLocale + url;
  return { t, i18n, getLink, currentLang: usedLocale };
};
export default usePathTranslation;
