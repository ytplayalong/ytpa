import { Favorites } from "@/app/components/favorites";
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

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
