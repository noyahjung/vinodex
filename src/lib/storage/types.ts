import type { FoodCategory, UserSettings, WineEntry } from "../types";

// Persistence contract for Vinodex.
// Backend swap = new implementation of this interface.
// All methods are async to leave room for network-backed implementations later.
export interface VinodexStorage {
  // ---- Categories ----
  // Catalog is currently seed-only; surfaced via storage so future versions
  // could let users add custom foods without touching the rest of the app.
  listCategories(): Promise<FoodCategory[]>;

  // ---- Wine entries ----
  listWines(): Promise<WineEntry[]>;
  listWinesForCategory(categoryId: string): Promise<WineEntry[]>;
  addWine(entry: Omit<WineEntry, "id" | "createdAt">): Promise<WineEntry>;
  updateWine(
    id: string,
    patch: Partial<Omit<WineEntry, "id" | "createdAt">>
  ): Promise<WineEntry>;
  deleteWine(id: string): Promise<void>;
  // Pin a wine as the cover for its food slot. Pass null to clear (the card
  // will then fall back to "most recent" automatically).
  setRepresentativeWine(
    categoryId: string,
    wineId: string | null
  ): Promise<void>;

  // ---- User settings ----
  getSettings(): Promise<UserSettings>;
  setHomeGrid(categoryIds: string[]): Promise<UserSettings>;

  // ---- Lifecycle ----
  // Idempotent. Safe to call on every app boot.
  ensureSeeded(): Promise<void>;
  // Wipes everything. Useful for the prototype "reset" affordance.
  resetAll(): Promise<void>;
}
