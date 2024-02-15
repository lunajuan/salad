import { LinksFunction } from "@remix-run/node";
import styles from "./saladCard.css";
import { Salad as SaladType } from "./type";
import { PropsWithChildren } from "react";
import Salad, { links as saladLinks } from "./Salad";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...saladLinks(),
];

type Props = {
  salad: SaladType;
};
export default function SaladCard({
  salad,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="salad-card">
      <Salad salad={salad} />
      <div>{children}</div>
    </div>
  );
}

export function CardButtonsContainer({ children }: PropsWithChildren<object>) {
  return <div className="salad-card-buttons">{children}</div>;
}
