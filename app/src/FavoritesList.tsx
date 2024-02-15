import { LinksFunction } from "@remix-run/node";
import { useCopySaladToClipboard, useFavoriteSalads } from "./hooks";
import styles from "./favoritesList.css";
import SaladCard, {
  links as saladCardLinks,
  CardButtonsContainer,
} from "./SaladCard";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...saladCardLinks(),
];

export default function FavoritesList() {
  const { favoriteSalads, remove } = useFavoriteSalads();
  const { copySaladToClipboard } = useCopySaladToClipboard();

  const onRemove = ({ saladId }: { saladId: string }) => {
    const isConfirmed = confirm(
      "Are you sure you want to remove this salad from your favorites?"
    );
    if (!isConfirmed) return;
    remove({ saladId });
  };

  return (
    <ul className="favorites-list">
      {!!favoriteSalads?.length && favoriteSalads.map((salad) => {
        return (
          <li key={salad.id}>
            <SaladCard salad={salad}>
              <CardButtonsContainer>
                <button onClick={() => onRemove({ saladId: salad.id })}>🗑️ remove</button>
                <button onClick={() => copySaladToClipboard({ salad })}>
                  Copy
                </button>
              </CardButtonsContainer>
            </SaladCard>
          </li>
        );
      })}
    </ul>
  );
}
