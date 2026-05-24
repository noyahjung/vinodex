import type { FoodCategory } from "./types";

// Seeded on first run. Order within each section is the default display order.
export const SEED_CATEGORIES: FoodCategory[] = [
  // 한식
  { id: "tteokbokki", name: "떡볶이", section: "korean", emoji: "🌶️" },
  { id: "gamjatang", name: "감자탕", section: "korean", emoji: "🍲" },
  { id: "samgyeopsal", name: "삼겹살", section: "korean", emoji: "🥓" },
  { id: "kimchi-jjigae", name: "김치찌개", section: "korean", emoji: "🥘" },
  { id: "bulgogi", name: "불고기", section: "korean", emoji: "🍖" },
  { id: "bossam", name: "보쌈", section: "korean", emoji: "🥬" },
  { id: "jokbal", name: "족발", section: "korean", emoji: "🦶" },
  { id: "bibimbap", name: "비빔밥", section: "korean", emoji: "🍱" },

  // 양식
  { id: "burger", name: "햄버거", section: "western", emoji: "🍔" },
  { id: "pasta", name: "파스타", section: "western", emoji: "🍝" },
  { id: "steak", name: "스테이크", section: "western", emoji: "🥩" },
  { id: "pizza", name: "피자", section: "western", emoji: "🍕" },
  { id: "risotto", name: "리조또", section: "western", emoji: "🍚" },
  { id: "salad", name: "샐러드", section: "western", emoji: "🥗" },

  // 일식
  { id: "sushi", name: "스시", section: "japanese", emoji: "🍣" },
  { id: "ramen", name: "라멘", section: "japanese", emoji: "🍜" },
  { id: "udon", name: "우동", section: "japanese", emoji: "🍲" },
  { id: "tonkatsu", name: "돈카츠", section: "japanese", emoji: "🍱" },
  { id: "sashimi", name: "사시미", section: "japanese", emoji: "🐟" },
  { id: "yakitori", name: "야키토리", section: "japanese", emoji: "🍢" },

  // 중식
  { id: "malatang", name: "마라탕", section: "chinese", emoji: "🌶️" },
  { id: "jajangmyeon", name: "짜장면", section: "chinese", emoji: "🍜" },
  { id: "jjamppong", name: "짬뽕", section: "chinese", emoji: "🍲" },
  { id: "tangsuyuk", name: "탕수육", section: "chinese", emoji: "🍤" },
  { id: "mapo-tofu", name: "마파두부", section: "chinese", emoji: "🥘" },

  // 디저트
  { id: "cake", name: "케이크", section: "dessert", emoji: "🍰" },
  { id: "macaron", name: "마카롱", section: "dessert", emoji: "🍪" },
  { id: "chocolate", name: "초콜릿", section: "dessert", emoji: "🍫" },
  { id: "cheese", name: "치즈", section: "dessert", emoji: "🧀" },

  // 안주
  { id: "chicken", name: "치킨", section: "snack", emoji: "🍗" },
  { id: "gopchang", name: "곱창", section: "snack", emoji: "🥩" },
  { id: "dakbal", name: "닭발", section: "snack", emoji: "🦴" },
  { id: "hoe", name: "회", section: "snack", emoji: "🐟" },
];

// Default 9 cards for the home grid on first run.
// Mix across sections so the empty home looks visually varied.
export const DEFAULT_HOME_GRID_IDS: string[] = [
  "tteokbokki",
  "burger",
  "pasta",
  "steak",
  "sushi",
  "ramen",
  "chicken",
  "cheese",
  "pizza",
];
