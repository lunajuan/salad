import { LinksFunction } from "@remix-run/node";
import FavoritesList, {links as favoritesLinks} from "src/FavoritesList";

export const links: LinksFunction = () => [...favoritesLinks()];

export default function FavoritesPage() {
  return (
    <div className="main-section">
      <h1 className="heading">Favorites</h1>
      <FavoritesList />
    </div>
  );
}
