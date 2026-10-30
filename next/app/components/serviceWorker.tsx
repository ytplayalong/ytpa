"use client";

import { useEffect } from "react";

/** Registers the service worker (public/sw.js), only in the built site. */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.log("Service worker not registered", err));
    }
  }, []);
  return null;
}
