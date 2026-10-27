import cookie from "js-cookie";
import { useSyncExternalStore } from "react";

/** The decision of the visitor about cookies (statistics and YouTube videos).
 *
 * "unknown" is only used while the page is rendered on the server / hydrated,
 * "undecided" means that the visitor was not asked yet.
 */
export type Consent = "accepted" | "declined" | "undecided" | "unknown";

const COOKIE_NAME = "cookieConsent";
const CHANGE_EVENT = "cookieConsentChange";

export const ANALYTICS_ID = "G-42SMWF6LRM";

const readConsent = (): Consent => {
  const value = cookie.get(COOKIE_NAME);
  return value === "accepted" || value === "declined" ? value : "undecided";
};

const subscribe = (onChange: () => void) => {
  globalThis.addEventListener(CHANGE_EVENT, onChange);
  return () => globalThis.removeEventListener(CHANGE_EVENT, onChange);
};

/** Hook for the current consent, updates when it changes. */
export const useConsent = (): Consent =>
  useSyncExternalStore(subscribe, readConsent, () => "unknown");

/** Removes the cookies set by Google Analytics (`_ga`, `_ga_<id>`). */
const removeAnalyticsCookies = () => {
  const host = globalThis.location.hostname;
  const parentDomain = "." + host.split(".").slice(-2).join(".");
  for (const name of Object.keys(cookie.get())) {
    if (name.startsWith("_ga")) {
      for (const domain of [undefined, host, parentDomain]) {
        cookie.remove(name, { path: "/", domain });
      }
    }
  }
};

/** Disables or enables Google Analytics, also if it was loaded already. */
const applyAnalyticsConsent = (consent: Consent) => {
  const accepted = consent === "accepted";
  (globalThis as any)[`ga-disable-${ANALYTICS_ID}`] = !accepted;
  if (!accepted) {
    removeAnalyticsCookies();
  }
};

/** Stores the decision of the visitor. */
export const setConsent = (value: "accepted" | "declined") => {
  cookie.set(COOKIE_NAME, value, { expires: 365, sameSite: "lax" });
  applyAnalyticsConsent(value);
  globalThis.dispatchEvent(new Event(CHANGE_EVENT));
};

/** Forgets the decision, the visitor is asked again. */
export const resetConsent = () => {
  cookie.remove(COOKIE_NAME);
  applyAnalyticsConsent("undecided");
  globalThis.dispatchEvent(new Event(CHANGE_EVENT));
};
