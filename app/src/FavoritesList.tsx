import { LinksFunction } from "@remix-run/node";
import Salad, {links as saladLinks} from "./Salad";
import { useCopySaladToClipboard, useFavoriteSalads } from "./hooks";
import styles from './favoritesList.css'

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }, ...saladLinks()];

export default function FavoritesList() {
  const { favoriteSalads, remove } = useFavoriteSalads();
  const {copySaladToClipboard} = useCopySaladToClipboard()


  const onRemove = ({ saladId }: { saladId: string }) => {
    const isConfirmed = confirm(
      "Are you sure you want to remove this salad from your favorites?"
    );
    if (!isConfirmed) return;
    remove({ saladId });
  };

  return (
    <ul className="favorites-list">
      {Object.entries(favoriteSalads).map(([saladId, salad]) => {
        return (
          <li key={saladId}>
            <Salad salad={salad} />
            <button onClick={() => onRemove({ saladId })}>remove</button>
            <button onClick={() => copySaladToClipboard({salad})}>Copy</button>
          </li>
        );
      })}
    </ul>
  );
}
