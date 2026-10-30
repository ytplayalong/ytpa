"use client";

import { createInstance, i18n as I18n } from "i18next";
import { I18nextProvider } from "react-i18next";

import { defaultLocale, RESSOURCES } from ".";

// One instance per language. The language is fixed for the whole lifetime of
// an instance, so the server and the client render the same texts from the
// very first render (no switch of the language in an effect).
const instances = new Map<string, I18n>();

const getInstance = (locale: string) => {
  let instance = instances.get(locale);
  if (!instance) {
    instance = createInstance();
    instance.init({
      lng: locale,
      fallbackLng: defaultLocale,
      interpolation: { escapeValue: false },
      resources: RESSOURCES,
      initAsync: false, // The resources are there, no need to wait
    });
    instances.set(locale, instance);
  }
  return instance;
};

/** Provides the translations in the language of the page. */
export default function I18nProvider({
  locale,
  children,
}: Readonly<{ locale: string; children: React.ReactNode }>) {
  return (
    <I18nextProvider i18n={getInstance(locale)}>{children}</I18nextProvider>
  );
}
