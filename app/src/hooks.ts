import createPersistedState from "use-persisted-state";
import { SaladChoice } from "./type";
import { v4 as uuid } from "uuid";
import { useCallback, useState } from "react";

const GENERATE_HISTORY_KEY = "generate-history";
const GENERATE_HISTORY_LIMIT = 50;

const useLocalGenerateHistory =
  createPersistedState<SaladChoice[][]>(GENERATE_HISTORY_KEY);

export function useGenerateHistory() {
  const [generateHistory, setGenerateHistory] = useLocalGenerateHistory([]);
  const [currentIndex, setCurrentIndex] = useState(generateHistory.length - 1);

  const push = ({ salad }: { salad: SaladChoice[] }) => {
    let updatedHistory = [...(generateHistory || [])];
    if (updatedHistory.length > GENERATE_HISTORY_LIMIT) {
      updatedHistory = updatedHistory.slice(
        updatedHistory.length - GENERATE_HISTORY_LIMIT + 1
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

  const canGoForward = currentIndex < generateHistory.length - 1;
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

const useLocalFavoriteSalads =
  createPersistedState<Record<string, SaladChoice[]>>(FAVORITE_SALADS_KEY);

export function useFavoriteSalads() {
  const [favoriteSalads, setFavorite] = useLocalFavoriteSalads({});

  const add = ({ salad }: { salad: SaladChoice[] }) => {
    const updatedFavorites = { ...(favoriteSalads || {}) };
    if (Object.values(updatedFavorites).length >= FAVORITE_SALADS_LIMIT) {
      return alert(
        `You've reached your ${FAVORITE_SALADS_LIMIT} limit on saving favorites. Remove some before adding more.`
      );
    }
    const id = uuid();
    updatedFavorites[id] = salad;
    setFavorite(updatedFavorites);
  };

  const remove = ({ saladId }: { saladId: string }) => {
    if (!saladId) return;
    const saladToRemove = favoriteSalads[saladId];
    if (!saladToRemove) return;
    const updatedFavorites = { ...(favoriteSalads || {}) };
    delete updatedFavorites[saladId];
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
  const copySaladToClipboard = ({ salad }: { salad: SaladChoice[] }) => {
    const saladText = salad.reduce((str, { category, value }) => {
      return str + `${category}: ${value}\n`;
    }, "");
    copy(saladText);
  };

  return { copySaladToClipboard };
}

enum Theme {
  Light= 'light',
  Dark= 'dark',
  Dim= 'dim',
  Grape= 'grape'
}