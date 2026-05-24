"use client";

import { CategoryBadge } from "./CategoryBadge";
import { WineBottleIcon } from "./WineBottleIcon";
import type { FoodCardData } from "@/lib/types";

interface Props {
  data: FoodCardData;
  onClick?: () => void;
  // "home" = signature size used on the 3x3 share grid
  // "collection" = slightly smaller for the dex view
  size?: "home" | "collection";
}

// Filled cards: full-bleed wine photo, top-left food chip, bottom gradient
// overlay with the wine name. Memo is intentionally not surfaced here — it
// belongs to the detail view.
//
// The wine name uses line-clamp-2 so most user-entered names render in full
// across the 3x3 grid without ellipsis.
export function FoodCard({ data, onClick, size = "home" }: Props) {
  const { category, latestWine, wineCount } = data;
  const isEmpty = !latestWine;

  const wineNameSize = size === "home" ? "text-[13px]" : "text-[11px]";
  const chipText = size === "home" ? "text-[11px]" : "text-[10px]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative aspect-[3/4] w-full overflow-hidden rounded-card text-left transition-all",
        isEmpty
          ? "border-2 border-dashed border-muted-2 bg-muted/50 hover:border-wine/40 hover:bg-muted/70"
          : "border border-ink/5 bg-ink shadow-card hover:-translate-y-0.5 hover:shadow-card-hover",
      ].join(" ")}
    >
      {/* Photo (filled) or silhouette (empty) */}
      {isEmpty ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <WineBottleIcon className="h-[52%] w-auto text-muted-2" />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={latestWine.photoDataUrl}
          alt={latestWine.wineName}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Top-left: food slot chip. Dark translucent on photos (reads on any
          image); soft paper chip on the empty state. */}
      <div
        className={[
          "absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 backdrop-blur-sm",
          isEmpty
            ? "bg-paper/70 text-ink/60"
            : "bg-ink/55 text-white",
        ].join(" ")}
      >
        <span className="text-[11px] leading-none">{category.emoji}</span>
        <span className={`font-medium leading-none ${chipText}`}>
          {category.name}
        </span>
        <CategoryBadge section={category.section} variant="dot" />
      </div>

      {/* Top-right: "+N" counter for multiple wines */}
      {!isEmpty && wineCount > 1 && (
        <span className="absolute right-2 top-2 rounded-full bg-paper/85 px-1.5 py-0.5 text-[10px] font-semibold text-ink backdrop-blur-sm">
          +{wineCount - 1}
        </span>
      )}

      {/* Bottom overlay: wine name only (memo lives on the detail view). */}
      {isEmpty ? (
        <div className="absolute inset-x-0 bottom-0 px-2.5 pb-2.5">
          <p className={`truncate font-semibold text-ink/40 ${wineNameSize}`}>
            + 취향 채우기
          </p>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-2.5 pb-2.5 pt-10">
          <p
            className={`line-clamp-2 break-words font-bold leading-[1.2] text-white ${wineNameSize}`}
            title={latestWine.wineName}
          >
            {latestWine.wineName}
          </p>
        </div>
      )}
    </button>
  );
}
