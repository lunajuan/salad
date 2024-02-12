import { SaladChoice } from "./type";

type Props = {
  salad: SaladChoice[];
};
export default function Salad({ salad }: Props) {
  return (
    <ul className="salad-list">
      {salad.map(({ category, value }) => {
        return (
          <li key={category}>
            {category}: <b>{value}</b>
          </li>
        );
      })}
    </ul>
  );
}
