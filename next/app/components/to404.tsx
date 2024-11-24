"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import usePathTranslation from "@/i18n/hook";

/** Component that just redirects to the 404 page. */
export const To404 = () => {
  const { getLink } = usePathTranslation();
  const router = useRouter();
  useEffect(() => {
    router.push(getLink(`/404`));
  });
  return <></>;
};
