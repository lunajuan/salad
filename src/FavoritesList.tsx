import Salad from "./Salad";
import { useCopySaladToClipboard, useFavoriteSalads } from "./hooks";

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
    <ul>
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
