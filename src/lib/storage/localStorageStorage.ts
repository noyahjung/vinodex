import { DEFAULT_HOME_GRID_IDS, SEED_CATEGORIES } from "../seed";
import type { FoodCategory, UserSettings, WineEntry } from "../types";
import type { VinodexStorage } from "./types";

const KEYS = {
  categories: "vinodex.categories.v1",
  wines: "vinodex.wines.v1",
  settings: "vinodex.settings.v1",
  seededFlag: "vinodex.seeded.v1",
} as const;

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function newId(prefix: string): string {
  // crypto.randomUUID is fine in modern browsers; fall back to a timestamp+rand.
  const c = typeof crypto !== "undefined" ? crypto : undefined;
  if (c && "randomUUID" in c) return `${prefix}_${c.randomUUID()}`;
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export class LocalStorageVinodexStorage implements VinodexStorage {
  async ensureSeeded(): Promise<void> {
    if (!isBrowser()) return;
    const already = window.localStorage.getItem(KEYS.seededFlag);
    if (already) return;
    write<FoodCategory[]>(KEYS.categories, SEED_CATEGORIES);
    write<WineEntry[]>(KEYS.wines, []);
    write<UserSettings>(KEYS.settings, {
      homeGridCategoryIds: DEFAULT_HOME_GRID_IDS,
    });
    window.localStorage.setItem(KEYS.seededFlag, "1");
  }

  async resetAll(): Promise<void> {
    if (!isBrowser()) return;
    for (const k of Object.values(KEYS)) {
      window.localStorage.removeItem(k);
    }
  }

  async listCategories(): Promise<FoodCategory[]> {
    return read<FoodCategory[]>(KEYS.categories, SEED_CATEGORIES);
  }

  async listWines(): Promise<WineEntry[]> {
    return read<WineEntry[]>(KEYS.wines, []);
  }

  async listWinesForCategory(categoryId: string): Promise<WineEntry[]> {
    const all = await this.listWines();
    return all
      .filter((w) => w.foodCategoryId === categoryId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async addWine(
    entry: Omit<WineEntry, "id" | "createdAt">
  ): Promise<WineEntry> {
    const all = await this.listWines();
    const full: WineEntry = {
      ...entry,
      id: newId("wine"),
      createdAt: Date.now(),
    };
    write<WineEntry[]>(KEYS.wines, [full, ...all]);
    return full;
  }

  async updateWine(
    id: string,
    patch: Partial<Omit<WineEntry, "id" | "createdAt">>
  ): Promise<WineEntry> {
    const all = await this.listWines();
    const idx = all.findIndex((w) => w.id === id);
    if (idx === -1) throw new Error(`Wine ${id} not found`);
    const next: WineEntry = { ...all[idx], ...patch };
    const copy = all.slice();
    copy[idx] = next;
    write<WineEntry[]>(KEYS.wines, copy);
    return next;
  }

  async deleteWine(id: string): Promise<void> {
    const all = await this.listWines();
    write<WineEntry[]>(
      KEYS.wines,
      all.filter((w) => w.id !== id)
    );
  }

  async getSettings(): Promise<UserSettings> {
    return read<UserSettings>(KEYS.settings, {
      homeGridCategoryIds: DEFAULT_HOME_GRID_IDS,
    });
  }

  async setHomeGrid(categoryIds: string[]): Promise<UserSettings> {
    if (categoryIds.length !== 9) {
      throw new Error("Home grid must have exactly 9 categories");
    }
    const next: UserSettings = { homeGridCategoryIds: categoryIds };
    write<UserSettings>(KEYS.settings, next);
    return next;
  }
}
