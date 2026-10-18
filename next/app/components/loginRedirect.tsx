"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import usePathTranslation from "@/i18n/hook";

/** Forwards the old /login URL to /account. */
export default function LoginRedirect() {
  const { t, getLink } = usePathTranslation();
  const router = useRouter();
  const target = getLink("/account");

  useEffect(() => {
    router.replace(target);
  }, [router, target]);

  return (
    <div className="container">
      <p>
        <Link href={target}>{t("manageAccount")}</Link>
      </p>
    </div>
  );
}
