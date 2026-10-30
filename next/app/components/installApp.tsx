"use client";

import { useEffect, useState } from "react";

import usePathTranslation from "@/i18n/hook";

import { buttonAttrs } from "../util/styles";

// The event of the browser that offers to install the web app
type InstallPromptEvent = Event & { prompt: () => Promise<void> };

/** Button for installing the web app, only shown if the browser offers it
 * (and the app is not installed yet).
 */
export default function InstallApp() {
  const { t } = usePathTranslation();
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // We show our own button
      setInstallEvent(e as InstallPromptEvent);
    };
    const onInstalled = () => setInstallEvent(null);
    globalThis.addEventListener("beforeinstallprompt", onPrompt);
    globalThis.addEventListener("appinstalled", onInstalled);
    return () => {
      globalThis.removeEventListener("beforeinstallprompt", onPrompt);
      globalThis.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!installEvent) {
    return null;
  }
  return (
    <p>
      <button
        onClick={async () => {
          await installEvent.prompt();
          setInstallEvent(null); // The event can only be used once
        }}
        {...buttonAttrs}
      >
        {t("installApp")}
      </button>
    </p>
  );
}
