import { Favorites } from "@/app/components/favorites";
import { getStaticLocaleParams } from "@/i18n";

export default function FavoritesPage() {
  return <Favorites />;
}
export const generateStaticParams = getStaticLocaleParams;
