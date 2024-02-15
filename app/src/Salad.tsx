import { LinksFunction } from "@remix-run/node";
import { Salad as SaladType } from "./type";
import styles from "./salad.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type Props = {
  salad: SaladType;
};
export default function Salad({ salad }: Props) {
  return (
    <ul className="salad-choices">
      {salad.choices.map(({ category, value }) => {
        return (
          <li key={category}>
            {category}: <b>{value}</b>
          </li>
        );
      })}
    </ul>
  );
}
