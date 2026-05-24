"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FoodCard } from "@/components/FoodCard";
import { SECTIONS } from "@/lib/sections";
import {
  selectCardData,
  selectFilledCount,
  useVinodex,
} from "@/lib/store";
import type { FoodCategory, SectionId } from "@/lib/types";

export default function DexPage() {
  const router = useRouter();
  const state = useVinodex();

  // Group categories by section, preserving seed order within each section.
  const grouped = useMemo(() => {
    const map = new Map<SectionId, FoodCategory[]>();
    for (const s of SECTIONS) map.set(s.id, []);
    for (const c of state.categories) {
      map.get(c.section)?.push(c);
    }
    return map;
  }, [state.categories]);

  const total = state.categories.length;
  const filled = selectFilledCount(state);
  const pct = total === 0 ? 0 : Math.round((filled / total) * 100);

  return (
    <div className="pb-8">
      {/* Header */}
      <header className="px-4 pt-7">
        <h1 className="font-serif text-[24px] font-semibold text-ink">
          나의 도감
        </h1>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-[13px] text-ink-soft">
            <span className="font-bold text-wine">{filled}</span>
            <span className="text-ink/40"> / {total} 채움</span>
          </span>
          <span className="text-[11px] tabular-nums text-ink-soft">{pct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-wine transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </header>

      {/* Section groups */}
      {SECTIONS.map((section) => {
        const items = grouped.get(section.id) ?? [];
        if (items.length === 0) return null;
        const sectionFilled = items.filter(
          (c) => (selectCardData(state, c.id)?.wineCount ?? 0) > 0
        ).length;

        return (
          <section key={section.id} className="mt-6">
            {/* Sticky section header so the chapter label stays visible
                while scrolling within the section. */}
            <div className="sticky top-0 z-10 -mx-0 bg-paper/95 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${section.badgeClass} inline-block`}
                  />
                  <h2 className="font-serif text-[16px] font-semibold text-ink">
                    {section.label}
                  </h2>
                </div>
                <span className="text-[11px] text-ink-soft">
                  {sectionFilled} / {items.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 px-4 pt-2">
              {items.map((c) => {
                const data = selectCardData(state, c.id);
                if (!data) return null;
                return (
                  <FoodCard
                    key={c.id}
                    data={data}
                    size="collection"
                    onClick={() => router.push(`/food/${c.id}`)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
