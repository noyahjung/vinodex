// Domain types for Vinodex.
// Keep these pure (no React/Next/Storage imports) so they're safe to import
// from both server and client code.

export type SectionId =
  | "korean"
  | "western"
  | "japanese"
  | "chinese"
  | "dessert"
  | "snack";

export interface Section {
  id: SectionId;
  label: string;        // "한식", "양식", ...
  badgeClass: string;   // tailwind bg color class for the badge tint
}

export interface FoodCategory {
  id: string;          // stable kebab-case id, used as the slot key
  name: string;        // "떡볶이"
  section: SectionId;
  emoji: string;       // placeholder illustration for the prototype
}

export interface WineEntry {
  id: string;
  foodCategoryId: string;
  wineName: string;
  photoDataUrl: string;   // base64 data URL — fine for a localStorage prototype
  memo?: string;
  rating?: number;        // 1-5, optional
  // If true, this wine is the user-pinned cover for its food slot.
  // At most one wine per foodCategoryId should have this set to true.
  isRepresentative?: boolean;
  createdAt: number;      // epoch ms
}

export interface UserSettings {
  homeGridCategoryIds: string[]; // exactly 9 ids
}

// ---- Derived / view-model types ----

export interface FoodCardData {
  category: FoodCategory;
  // Wine shown on the card cover. Picks the user-pinned representative if
  // one is set, else falls back to the most recently added.
  coverWine?: WineEntry;
  wineCount: number;       // total wines recorded for this food
}
