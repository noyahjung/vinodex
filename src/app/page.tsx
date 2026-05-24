"use client";

import { useRouter } from "next/navigation";
import { FoodCard } from "@/components/FoodCard";
import { selectCardData, useVinodex } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const state = useVinodex();

  // While hydrating, show 9 placeholder slots so the layout doesn't jump.
  // Empty cards already render a clean unfilled state — perfect as a skeleton.
  const ids = state.settings.homeGridCategoryIds.slice(0, 9);

  return (
    <div className="px-4 pb-6 pt-7">
      <header className="mb-1 flex items-baseline gap-2 px-0.5">
        <h1 className="font-serif text-[26px] font-semibold tracking-tight text-wine">
          Vinodex
        </h1>
        <span className="text-[12px] text-ink-soft">비노덱스</span>
      </header>
      <p className="mb-5 px-0.5 text-[13px] text-ink-soft">
        당신만의 와인 도감을 채워보세요
      </p>

      <div className="grid grid-cols-3 gap-2">
        {ids.length === 0
          ? Array.from({ length: 9 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="aspect-[3/4] w-full animate-pulse rounded-card bg-muted/60"
              />
            ))
          : ids.map((id) => {
              const data = selectCardData(state, id);
              if (!data) return null;
              return (
                <FoodCard
                  key={id}
                  data={data}
                  size="home"
                  onClick={() => router.push(`/food/${id}`)}
                />
              );
            })}
      </div>

      <div className="mt-5 text-center text-[10px] tracking-wide text-ink-soft/70">
        made with <span className="font-serif text-wine">Vinodex</span>
      </div>
    </div>
  );
}
