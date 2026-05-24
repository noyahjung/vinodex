"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { storage } from "./storage";
import type {
  FoodCardData,
  FoodCategory,
  UserSettings,
  WineEntry,
} from "./types";

// In-memory mirror of storage. Mutations write through to storage and update
// state, so all subscribed components re-render. Single provider mounted at
// the app root.
interface VinodexState {
  isReady: boolean;
  categories: FoodCategory[];
  wines: WineEntry[];
  settings: UserSettings;
  addWine: (entry: Omit<WineEntry, "id" | "createdAt">) => Promise<WineEntry>;
  deleteWine: (id: string) => Promise<void>;
  setHomeGrid: (ids: string[]) => Promise<void>;
}

const initialSettings: UserSettings = { homeGridCategoryIds: [] };

const VinodexContext = createContext<VinodexState | null>(null);

export function VinodexProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [wines, setWines] = useState<WineEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>(initialSettings);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await storage.ensureSeeded();
      const [c, w, s] = await Promise.all([
        storage.listCategories(),
        storage.listWines(),
        storage.getSettings(),
      ]);
      if (cancelled) return;
      setCategories(c);
      setWines(w);
      setSettings(s);
      setIsReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addWine = useCallback<VinodexState["addWine"]>(async (entry) => {
    const created = await storage.addWine(entry);
    setWines((prev) => [created, ...prev]);
    return created;
  }, []);

  const deleteWine = useCallback<VinodexState["deleteWine"]>(async (id) => {
    await storage.deleteWine(id);
    setWines((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const setHomeGrid = useCallback<VinodexState["setHomeGrid"]>(async (ids) => {
    const next = await storage.setHomeGrid(ids);
    setSettings(next);
  }, []);

  const value: VinodexState = {
    isReady,
    categories,
    wines,
    settings,
    addWine,
    deleteWine,
    setHomeGrid,
  };

  return (
    <VinodexContext.Provider value={value}>{children}</VinodexContext.Provider>
  );
}

export function useVinodex(): VinodexState {
  const ctx = useContext(VinodexContext);
  if (!ctx) {
    throw new Error("useVinodex must be used within a <VinodexProvider>");
  }
  return ctx;
}

// ---- Selectors (pure, derived from state) ----

export function selectCategory(
  state: VinodexState,
  id: string
): FoodCategory | undefined {
  return state.categories.find((c) => c.id === id);
}

export function selectWinesForCategory(
  state: VinodexState,
  categoryId: string
): WineEntry[] {
  return state.wines
    .filter((w) => w.foodCategoryId === categoryId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function selectCardData(
  state: VinodexState,
  categoryId: string
): FoodCardData | null {
  const category = selectCategory(state, categoryId);
  if (!category) return null;
  const list = selectWinesForCategory(state, categoryId);
  return {
    category,
    latestWine: list[0],
    wineCount: list.length,
  };
}

export function selectFilledCount(state: VinodexState): number {
  const filled = new Set<string>();
  for (const w of state.wines) filled.add(w.foodCategoryId);
  return filled.size;
}
