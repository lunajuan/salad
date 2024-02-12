import { useEffect, useState } from "react";
import saladData from "./salad-data";
import { randomInt } from "./utils";
import { LinksFunction } from "@remix-run/node";
import styles from "./saladGenerator.css";
import { SaladChoice, SaladIngredientsData } from "./type";
import { useFavoriteSalads, useGenerateHistory } from "./hooks";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type Props = {
  saladData: SaladIngredientsData;
};

export default function SaladGenerator({ saladData }: Props) {
  const {
    generateHistory,
    push: pushToGenerateHistory,
    canGoBack,
    goBack,
    canGoForward,
    goForward,
    currentIndex,
  } = useGenerateHistory();
  const salad = generateHistory[currentIndex];
  const [, setIsGenerating] = useState(false);
  const { add: addToFavorites } = useFavoriteSalads();

  const onAddToFavorites = () => {
    if (!salad) return;
    addToFavorites({ salad });
  };

  const onGenerateSalad = () => {
    try {
      setIsGenerating(true);
      const salad = generateSalad({ data: saladData });
      if (!salad) return;
      pushToGenerateHistory({ salad });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!generateHistory.length) {
      onGenerateSalad();
    }
  }, []);

  return (
    <div className="generate-section">
      {salad && (
        <ul className="salad-list">
          {salad.map(({ category, value }) => {
            return (
              <li key={category}>
                {category}: <b>{value}</b>
              </li>
            );
          })}
        </ul>
      )}
      <div>
        {generateHistory ? (
          <p>
            history item {currentIndex + 1}/{generateHistory.length}
          </p>
        ) : (
          <p>no history yet</p>
        )}
        <button onClick={goBack} disabled={!canGoBack}>
          back
        </button>
        <button onClick={goForward} disabled={!canGoForward}>
          forward
        </button>
        <button onClick={onAddToFavorites} disabled={!salad}>
          Add to favorites
        </button>
      </div>
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
      final.push({ category: name, value: choice });
      return final;
    }, [] as SaladChoice[]);
    return salad;
  } catch (error) {
    alert("error generating salad");
    console.log(error);
  }
}
