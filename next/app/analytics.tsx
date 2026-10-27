import { useEffect } from "react";
import ReactGA from "react-ga4";

import { ANALYTICS_ID, useConsent } from "./util/consent";

let initialized = false;

/** Starts Google Analytics, only called after the visitor accepted. */
const initAnalytics = () => {
  if (!initialized) {
    ReactGA.initialize(ANALYTICS_ID);
    initialized = true;
  }
};

/** Sends an event, if the visitor accepted cookies. */
export const handleButtonClick = (category: string, action: string) => {
  if (initialized) {
    ReactGA.event({ category, action });
  }
};

/** Counts a page view of the current page.
 *
 * Nothing is loaded or sent before the visitor accepted cookies, a page
 * view is counted when the visitor accepts.
 */
export const usePageview = () => {
  const consent = useConsent();
  useEffect(() => {
    if (consent !== "accepted") {
      return;
    }
    initAnalytics();
    ReactGA.send({ hitType: "pageview", page: globalThis.location.pathname });
  }, [consent]);
};
