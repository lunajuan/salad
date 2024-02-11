import { useState } from "react";
import saladData from "./salad-data";
import { randomInt } from "./utils";
import { LinksFunction } from "@remix-run/node";
import styles from "./saladGenerator.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type SaladCategory = { name: string; choice: string };

type Props = {
  saladData: typeof saladData;
};

export default function SaladGenerator({ saladData }: Props) {
  const [, setIsGenerating] = useState(false);
  const [salad, setSalad] = useState<SaladCategory[] | undefined>(
    generateSalad({ data: saladData })
  );

  const onGenerateSalad = () => {
    try {
      setIsGenerating(true);
      const salad = generateSalad({ data: saladData });
      setSalad(salad);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="generate-section">
      {salad && (
        <ul className="salad-list">
          {salad.map(({ name, choice }) => {
            return (
              <li key={name}>
                {name}: <b>{choice}</b>
              </li>
            );
          })}
        </ul>
      )}
      <button className="generate-button" onClick={onGenerateSalad}>
        Generate
      </button>
    </div>
  );
}

function generateSalad({ data }: { data: typeof saladData }) {
  try {
    const salad = Object.values(data).reduce((final, { name, options }) => {
      const randomChoiceIndex = randomInt(0, options.length - 1);
      const choice = options[randomChoiceIndex];
      final.push({ name, choice });
      return final;
    }, [] as SaladCategory[]);
    return salad;
  } catch (error) {
    alert("error generating salad");
    console.log(error);
  }
}
