import { LANGUAGES, RESSOURCES, defaultLocale } from ".";

import i18n from "i18next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initReactI18next, useTranslation } from "react-i18next";

i18n.use(initReactI18next).init({
  fallbackLng: defaultLocale,
  lng: defaultLocale,
  interpolation: { escapeValue: false },
  resources: RESSOURCES,
});

const usePathTranslation = () => {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const locale = pathname.split("/")[1];

  const usedLocale = LANGUAGES.includes(locale) ? locale : defaultLocale;
  useEffect(() => {
    if (i18n.language !== usedLocale) {
      i18n.changeLanguage(usedLocale);
    }
  });

  const getLink = (url: string) => "/" + locale + url;
  return { t, i18n, getLink, currentLang: usedLocale };
};
export default usePathTranslation;
