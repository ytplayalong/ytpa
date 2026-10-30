import { Favorites } from "@/app/components/favorites";
import { pageMetadata } from "@/app/util/meta";
import { containerInner } from "@/app/util/styles";

export default function FavoritesPage() {
  return (
    <div className="container">
      <div style={containerInner}>
        <Favorites />
      </div>
    </div>
  );
}

export const generateMetadata = pageMetadata({ path: "/favorites", titleKey: "favorites", noindex: true });

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
