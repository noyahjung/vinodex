"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FoodCard } from "@/components/FoodCard";
import { selectCardData, useVinodex } from "@/lib/store";
import { captureAndShare } from "@/lib/share";

export default function Home() {
  const router = useRouter();
  const state = useVinodex();
  const shareRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  // While hydrating, show 9 placeholder slots so the layout doesn't jump.
  const ids = state.settings.homeGridCategoryIds.slice(0, 9);

  const onShare = async () => {
    if (!shareRef.current || sharing) return;
    setSharing(true);
    try {
      await captureAndShare({
        element: shareRef.current,
        filename: `vinodex-best-${dateStamp()}.png`,
        title: "나의 베스트 페어링 — Vinodex",
      });
    } catch (err) {
      console.error(err);
      alert("공유 이미지를 만들지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="px-4 pb-6 pt-5">
      {/* Action bar — sits OUTSIDE the capture region so the buttons don't
          end up in the shared image. */}
      <div className="mb-2 flex items-center justify-end gap-1.5 px-0.5">
        <button
          type="button"
          onClick={onShare}
          disabled={sharing}
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
            sharing
              ? "bg-muted text-ink/40"
              : "bg-wine text-paper hover:bg-wine/90",
          ].join(" ")}
        >
          <ShareIcon />
          {sharing ? "준비 중…" : "공유"}
        </button>
        <Link
          href="/edit"
          className="shrink-0 rounded-full bg-muted/70 px-3 py-1.5 text-[12px] font-medium text-ink/70 hover:bg-muted"
        >
          편집
        </Link>
      </div>

      {/* Share canvas — this exact subtree is what gets captured to PNG. */}
      <div ref={shareRef} className="bg-paper px-1 pb-4 pt-3">
        <header className="mb-4 px-1">
          <h1 className="font-serif text-[26px] font-semibold leading-tight text-ink">
            나의 베스트 페어링
          </h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            내가 고른 음식과 와인 9컷
          </p>
        </header>

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

        <div className="mt-5 text-center text-[10px] tracking-[0.08em] text-ink-soft/70">
          made with <span className="font-serif text-wine">Vinodex</span>
        </div>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  );
}

function dateStamp(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}
