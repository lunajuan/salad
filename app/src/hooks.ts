import createPersistedState from "use-persisted-state";
import { Salad } from "./type";
import { useCallback, useState } from "react";

const GENERATE_HISTORY_KEY = "generate-history";
const GENERATE_HISTORY_LIMIT = 50;

const useLocalGenerateHistory = createPersistedState<Salad[] | undefined>(
  GENERATE_HISTORY_KEY
);

export function useGenerateHistory() {
  const [generateHistory, setGenerateHistory] =
    useLocalGenerateHistory(undefined);
  const [currentIndex, setCurrentIndex] = useState(
    generateHistory ? generateHistory.length - 1 : 0
  );

  const push = ({ salad }: { salad: Salad }) => {
    let updatedHistory = [...(generateHistory || [])];
    if (updatedHistory.length > GENERATE_HISTORY_LIMIT) {
      updatedHistory = updatedHistory.slice(
        updatedHistory.length - GENERATE_HISTORY_LIMIT
      );
    }
    updatedHistory.push(salad);
    setGenerateHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
  };

  const canGoBack = currentIndex > 0;
  const goBack = () => {
    if (!canGoBack) return;
    setCurrentIndex(currentIndex - 1);
  };

  const canGoForward =
    generateHistory && currentIndex < generateHistory.length - 1;
  const goForward = () => {
    if (!canGoForward) return;
    setCurrentIndex(currentIndex + 1);
  };

  return {
    generateHistory,
    push,
    currentIndex,
    canGoBack,
    goBack,
    canGoForward,
    goForward,
  };
}

const FAVORITE_SALADS_KEY = "favorite-salads";
const FAVORITE_SALADS_LIMIT = 100;

const useLocalFavoriteSalads = createPersistedState<Salad[] | undefined>(
  FAVORITE_SALADS_KEY
);

export function useFavoriteSalads() {
  const [favoriteSalads, setFavorite] = useLocalFavoriteSalads();

  const add = ({ salad }: { salad: Salad }) => {
    const updatedFavorites = [ ...(favoriteSalads || []) ];
    if (updatedFavorites.length >= FAVORITE_SALADS_LIMIT) {
      return alert(
        `You've reached your ${FAVORITE_SALADS_LIMIT} limit on saving favorites. Remove some before adding more.`
      );
    }
    updatedFavorites.push(salad);
    setFavorite(updatedFavorites);
  };

  const remove = ({ saladId }: { saladId: string }) => {
    if (!saladId) return;
    const updatedFavorites = (favoriteSalads || []).filter(
      (s) => s.id === saladId
    );
    setFavorite(updatedFavorites);
  };

  return { add, remove, favoriteSalads };
}

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return { copiedText, copy };
}

export function useCopySaladToClipboard() {
  const { copy } = useCopyToClipboard();
  const copySaladToClipboard = ({ salad }: { salad: Salad }) => {
    const saladText = salad.choices.reduce((str, { category, value }) => {
      return str + `${category}: ${value}\n`;
    }, "");
    copy(saladText);
  };

  return { copySaladToClipboard };
}
