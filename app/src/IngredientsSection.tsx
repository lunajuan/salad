import { LinksFunction } from "@remix-run/node";
import saladData from "./salad-data";
import styles from "./ingredientsSection.css";

type Props = {
  saladData: typeof saladData;
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function IngredientsSection({ saladData }: Props) {
  return (
    <div className="container">
      {Object.values(saladData).map(({ name, options }) => {
        return (
          <div className="section" key={name}>
            <h3>{name}</h3>
            <ul className="list">
              {options.map((option) => {
                return <li key={option}>{option}</li>;
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
