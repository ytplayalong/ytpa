import type { MetadataRoute } from "next";

import { SITE_URL } from "./util/meta";

export const dynamic = "force-static"; // The site is a static export

// Everything is open for all crawlers (also the ones of AI search engines).
// Pages without value for search (account, settings, ...) are marked with
// "noindex" in their metadata: that only works if they may be crawled.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
