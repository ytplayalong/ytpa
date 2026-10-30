"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import usePathTranslation from "@/i18n/hook";

/** Component that just redirects to the 404 page (in the language of the page,
 * or the default language if the URL has none).
 */
export const To404 = () => {
  const { getLink } = usePathTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const target = getLink("/404");

  useEffect(() => {
    // Never redirect to the page we are on, that would be an endless loop
    if (pathname !== target) {
      router.replace(target);
    }
  }, [router, pathname, target]);
  return <></>;
};
