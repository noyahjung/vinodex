import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vinodex base palette
        paper: "#FAF7F2",        // warm off-white background
        ink: "#2D1F1A",          // primary text (dark brown, not pure black)
        "ink-soft": "#6B5A52",   // secondary text
        wine: "#8B2942",         // brand wine red
        "wine-soft": "#B85A6F",  // lighter wine
        gold: "#D4A24C",         // mustard/gold accent
        "gold-soft": "#E8C988",  // lighter gold
        // Section badge tints — soft pastels
        "sec-korean": "#F7B7A8",   // coral pink
        "sec-western": "#C9B8E0",  // lavender
        "sec-japanese": "#B8CDB8", // sage green
        "sec-chinese": "#E8C988",  // mustard
        "sec-dessert": "#F7CDA8",  // peach
        "sec-snack": "#A8BFD4",    // dusty blue
        // Soft surfaces for empty states
        muted: "#EFE9DF",
        "muted-2": "#E5DDD0",
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(45, 31, 26, 0.08), 0 1px 2px rgba(45, 31, 26, 0.04)",
        "card-hover":
          "0 8px 24px -4px rgba(45, 31, 26, 0.12), 0 2px 4px rgba(45, 31, 26, 0.06)",
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
  plugins: [],
};
export default config;
