import { LinksFunction } from "@remix-run/node";
import { SaladChoice } from "./type";
import styles from "./salad.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type Props = {
  salad: SaladChoice[];
};
export default function Salad({ salad }: Props) {
  return (
    <ul className="salad-choices">
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
