import { useEffect, useState } from "react";
import saladData from "./salad-data";
import { randomInt } from "./utils";
import { LinksFunction } from "@remix-run/node";
import styles from "./saladGenerator.css";
import { SaladChoice, SaladIngredientsData } from "./type";
import {
  useCopySaladToClipboard,
  useFavoriteSalads,
  useGenerateHistory,
} from "./hooks";
import SaladCard, {
  CardButtonsContainer,
  links as saladCardLinks,
} from "./SaladCard";
import { v4 as uuid } from "uuid";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...saladCardLinks(),
];

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
  const salad = generateHistory?.[currentIndex];
  const [, setIsGenerating] = useState(false);
  const { add: addToFavorites, favoriteSalads } = useFavoriteSalads();
  const { copySaladToClipboard } = useCopySaladToClipboard();

  const isSaladFavorited =
  favoriteSalads && salad
  ? favoriteSalads?.some((favorite) => favorite.id === salad.id)
  : false;

  const onCopySalad = () => {
    if (!salad) return;
    copySaladToClipboard({ salad });
  };

  const onAddToFavorites = () => {
    if (!salad || isSaladFavorited) return;
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
    if (!generateHistory?.length) {
      onGenerateSalad();
    }
  }, []);

  return (
    <div className="generate-section">
      {salad && (
        <SaladCard salad={salad}>
          <CardButtonsContainer>
            <button onClick={onCopySalad}>
              Copy
            </button>
            <button onClick={onAddToFavorites} disabled={isSaladFavorited}>
              <span className="generate-button-icon"> ⭐️</span> Add to
              favorites
            </button>
          </CardButtonsContainer>
        </SaladCard>
      )}
      <button className="generate-button" onClick={onGenerateSalad}>
        <span className="generate-button-icon">🦹</span>Generate
      </button>
      {generateHistory ? (
        <div className="generate-history">
          <p>
            history item {currentIndex + 1}/{generateHistory.length}
          </p>
          <div className="generate-history-buttons">
            <button onClick={goBack} disabled={!canGoBack}>
              back
            </button>
            <button onClick={goForward} disabled={!canGoForward}>
              forward
            </button>
          </div>
        </div>
      ) : (
        <p>no history yet</p>
      )}
    </div>
  );
}

function generateSalad({ data }: { data: typeof saladData }) {
  try {
    const choices = Object.values(data).reduce((final, { name, options }) => {
      const randomChoiceIndex = randomInt(0, options.length - 1);
      const choice = options[randomChoiceIndex];
      final.push({ category: name, value: choice });
      return final;
    }, [] as SaladChoice[]);
    const salad = { id: uuid(), choices };
    return salad;
  } catch (error) {
    alert("error generating salad");
    console.log(error);
  }
}
