"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { WineAddSheet } from "@/components/WineAddSheet";
import { WineBottleIcon } from "@/components/WineBottleIcon";
import {
  selectCategory,
  selectWinesForCategory,
  useVinodex,
} from "@/lib/store";
import type { WineEntry } from "@/lib/types";

interface PageProps {
  params: { id: string };
}

export default function FoodDetailPage({ params }: PageProps) {
  const router = useRouter();
  const state = useVinodex();
  const [sheetOpen, setSheetOpen] = useState(false);

  const category = selectCategory(state, params.id);
  const wines = category ? selectWinesForCategory(state, category.id) : [];

  if (!state.isReady) {
    return <div className="px-4 pt-7 text-[13px] text-ink-soft">로딩 중…</div>;
  }
  if (!category) {
    return (
      <div className="px-4 pt-7">
        <p className="text-[14px] text-ink">존재하지 않는 음식입니다.</p>
        <button
          className="mt-3 text-[13px] text-wine"
          onClick={() => router.push("/dex")}
        >
          ← 도감으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 pb-24 pt-5">
        {/* Top bar with back */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="-ml-1 flex items-center gap-1 rounded-full p-1 text-ink-soft hover:text-ink"
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
          <CategoryBadge section={category.section} />
        </div>

        {/* Title */}
        <div className="flex items-baseline gap-2">
          <span className="text-[26px] leading-none">{category.emoji}</span>
          <h1 className="font-serif text-[24px] font-semibold text-ink">
            {category.name}
          </h1>
        </div>
        <p className="mt-1 text-[12px] text-ink-soft">
          {wines.length === 0
            ? "아직 기록한 와인이 없어요"
            : `기록한 와인 ${wines.length}개`}
        </p>

        {/* Wine list or empty state */}
        {wines.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="mt-5 space-y-3">
            {wines.map((w) => (
              <WineRow
                key={w.id}
                entry={w}
                // Only surface the cover-picker when there's a choice to make.
                showCoverPick={wines.length >= 2}
              />
            ))}
          </ul>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-full bg-wine px-5 py-3 text-[14px] font-semibold text-paper shadow-lg shadow-wine/30 hover:bg-wine/90"
        style={{
          // keep the FAB inside the phone-frame width on desktop
          maxWidth: "calc(100% - 32px)",
        }}
      >
        + 와인 추가
      </button>

      {sheetOpen && (
        <WineAddSheet
          category={category}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 flex flex-col items-center rounded-2xl border-2 border-dashed border-muted-2 bg-muted/40 px-6 py-10 text-center">
      <WineBottleIcon className="h-16 w-auto text-muted-2" />
      <p className="mt-3 text-[14px] font-medium text-ink/70">
        첫 와인을 기록해보세요
      </p>
      <p className="mt-1 text-[12px] text-ink-soft">
        사진 한 장과 와인명만 있으면 충분해요
      </p>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.8l2.93 6.36 6.96.69-5.27 4.77 1.56 7.06L12 17.9l-6.18 3.78 1.56-7.06L2.11 9.85l6.96-.69z" />
    </svg>
  );
}

function WineRow({
  entry,
  showCoverPick,
}: {
  entry: WineEntry;
  showCoverPick: boolean;
}) {
  const { deleteWine, setRepresentativeWine } = useVinodex();
  const isRep = !!entry.isRepresentative;
  const date = new Date(entry.createdAt);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(date.getDate()).padStart(2, "0")}`;

  const onDelete = async () => {
    if (!confirm("이 와인 기록을 삭제할까요?")) return;
    await deleteWine(entry.id);
  };

  const onToggleRep = async () => {
    // Tapping a filled star clears (back to auto = most recent).
    // Tapping an empty star pins this wine as the cover.
    await setRepresentativeWine(entry.foodCategoryId, isRep ? null : entry.id);
  };

  return (
    <li
      className={[
        "flex gap-3 rounded-2xl border bg-white p-3 shadow-card transition-colors",
        isRep
          ? "border-wine/50 ring-1 ring-wine/15"
          : "border-muted-2",
      ].join(" ")}
    >
      <div className="h-[88px] w-[66px] shrink-0 overflow-hidden rounded-xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.photoDataUrl}
          alt={entry.wineName}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className="break-words font-bold leading-tight text-[14px] text-ink"
              title={entry.wineName}
            >
              {entry.wineName}
            </p>
            {isRep && (
              <span className="mt-1 inline-flex items-center rounded-full bg-wine/10 px-1.5 py-0.5 text-[10px] font-semibold text-wine">
                대표 와인
              </span>
            )}
          </div>

          {showCoverPick && (
            <button
              type="button"
              onClick={onToggleRep}
              aria-label={isRep ? "대표 와인 해제" : "대표 와인으로 설정"}
              title={isRep ? "대표 와인 해제" : "대표 와인으로 설정"}
              className={[
                "-mr-1 -mt-1 shrink-0 rounded-full p-1.5 transition-colors",
                isRep
                  ? "text-wine hover:bg-wine/10"
                  : "text-ink/25 hover:bg-muted/60 hover:text-ink/55",
              ].join(" ")}
            >
              <StarIcon filled={isRep} />
            </button>
          )}
        </div>

        {entry.memo && (
          <p className="mt-1 text-[12px] leading-snug text-ink-soft">
            {entry.memo}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-[11px] tabular-nums text-ink/40">
            {dateStr}
          </span>
          <button
            type="button"
            onClick={onDelete}
            className="text-[11px] text-ink/40 hover:text-wine"
          >
            삭제
          </button>
        </div>
      </div>
    </li>
  );
}
