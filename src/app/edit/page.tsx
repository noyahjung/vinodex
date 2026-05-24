"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FoodCard } from "@/components/FoodCard";
import { SECTIONS } from "@/lib/sections";
import { selectCardData, useVinodex } from "@/lib/store";
import type { FoodCategory, SectionId } from "@/lib/types";

const MAX = 9;

export default function EditBestPage() {
  const router = useRouter();
  const state = useVinodex();

  // Selection lives in local state until the user explicitly saves so they
  // can experiment without polluting the live home grid.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Seed local state once the store has hydrated.
  useEffect(() => {
    if (!initialized && state.isReady) {
      setSelectedIds(state.settings.homeGridCategoryIds.slice(0, MAX));
      setInitialized(true);
    }
  }, [initialized, state.isReady, state.settings.homeGridCategoryIds]);

  const grouped = useMemo(() => {
    const map = new Map<SectionId, FoodCategory[]>();
    for (const s of SECTIONS) map.set(s.id, []);
    for (const c of state.categories) map.get(c.section)?.push(c);
    return map;
  }, [state.categories]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const isFull = selectedIds.length >= MAX;
  const canSave =
    initialized && selectedIds.length === MAX && !saving;

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX) return prev; // hard cap
      return [...prev, id];
    });
  };

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await state.setHomeGrid(selectedIds);
      router.push("/");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-muted-2 bg-paper/95 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="-ml-1 flex items-center gap-0.5 rounded-full p-1 text-ink-soft hover:text-ink"
            aria-label="뒤로"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="font-serif text-[16px] font-semibold text-ink">
            베스트 9 편집
          </h1>
          <div className="flex items-center gap-2">
            <span
              className={`tabular-nums text-[12px] font-semibold ${
                isFull ? "text-wine" : "text-ink/45"
              }`}
            >
              {selectedIds.length} / {MAX}
            </span>
          </div>
        </div>
      </header>

      {/* Helper line */}
      <p className="px-4 pt-4 text-[12px] text-ink-soft">
        도감에서 자랑하고 싶은 음식 카드 9개를 골라주세요. 카드를 한 번 더 탭하면 선택이 해제됩니다.
      </p>

      {/* Sections */}
      {SECTIONS.map((section) => {
        const items = grouped.get(section.id) ?? [];
        if (items.length === 0) return null;
        const pickedHere = items.filter((c) => selectedSet.has(c.id)).length;

        return (
          <section key={section.id} className="mt-5">
            <div className="sticky top-[52px] z-10 bg-paper/95 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${section.badgeClass}`}
                  />
                  <h2 className="font-serif text-[15px] font-semibold text-ink">
                    {section.label}
                  </h2>
                </div>
                {pickedHere > 0 && (
                  <span className="text-[11px] font-medium text-wine">
                    {pickedHere}개 선택됨
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 px-4 pt-2">
              {items.map((c) => {
                const data = selectCardData(state, c.id);
                if (!data) return null;
                const isSelected = selectedSet.has(c.id);
                // When full, unselected cards are disabled — user must
                // deselect one before picking another.
                const isDisabled = isFull && !isSelected;
                return (
                  <FoodCard
                    key={c.id}
                    data={data}
                    size="collection"
                    selectMode
                    selected={isSelected}
                    disabled={isDisabled}
                    onClick={() => toggle(c.id)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Sticky save bar */}
      <div className="fixed bottom-14 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 px-4">
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className={[
            "w-full rounded-full py-3.5 text-[14px] font-semibold shadow-lg transition-colors",
            canSave
              ? "bg-wine text-paper shadow-wine/30 hover:bg-wine/90"
              : "bg-muted-2 text-ink/40 shadow-none cursor-not-allowed",
          ].join(" ")}
        >
          {saving
            ? "저장 중…"
            : selectedIds.length === MAX
            ? "베스트 9으로 저장"
            : `${MAX - selectedIds.length}개 더 골라주세요`}
        </button>
      </div>
    </div>
  );
}
