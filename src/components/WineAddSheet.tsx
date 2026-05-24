"use client";

import { useEffect, useRef, useState } from "react";
import { fileToResizedDataUrl } from "@/lib/imageUtils";
import { useVinodex } from "@/lib/store";
import type { FoodCategory } from "@/lib/types";

interface Props {
  category: FoodCategory;
  onClose: () => void;
  onSaved?: () => void;
}

export function WineAddSheet({ category, onClose, onSaved }: Props) {
  const { addWine } = useVinodex();
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [wineName, setWineName] = useState("");
  const [memo, setMemo] = useState("");
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setPhotoDataUrl(dataUrl);
    } finally {
      setProcessing(false);
      // allow picking the same file again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const canSave = !!photoDataUrl && wineName.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await addWine({
        foodCategoryId: category.id,
        wineName: wineName.trim(),
        memo: memo.trim() || undefined,
        photoDataUrl: photoDataUrl!,
      });
      onSaved?.();
      onClose();
    } catch (err) {
      // localStorage quota etc.
      console.error(err);
      alert("저장에 실패했어요. 사진이 너무 크거나 저장 공간이 부족할 수 있습니다.");
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[390px] rounded-t-[28px] bg-paper px-5 pb-7 pt-3 shadow-[0_-12px_40px_-8px_rgba(45,31,26,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-muted-2" />

        {/* Header */}
        <div className="mb-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[18px]">{category.emoji}</span>
            <h2 className="font-serif text-[17px] font-semibold text-ink">
              {category.name} 와인 기록
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] text-ink-soft hover:text-ink"
          >
            취소
          </button>
        </div>

        {/* Photo picker — tap label to open camera/gallery */}
        <label className="block cursor-pointer">
          <div className="relative mx-auto flex aspect-[3/4] w-[170px] items-center justify-center overflow-hidden rounded-card border-2 border-dashed border-muted-2 bg-muted/40">
            {photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoDataUrl}
                alt="선택된 와인 사진"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-ink/45">
                <div className="text-3xl">📷</div>
                <p className="mt-1 text-[12px] font-medium">
                  {processing ? "처리 중…" : "사진 추가"}
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={handleFileChange}
          />
          {photoDataUrl && (
            <p className="mt-1.5 text-center text-[11px] text-ink-soft">
              다시 선택하려면 사진을 탭하세요
            </p>
          )}
        </label>

        {/* Wine name */}
        <div className="mt-5">
          <label className="text-[12px] font-medium text-ink-soft">와인명</label>
          <input
            type="text"
            value={wineName}
            onChange={(e) => setWineName(e.target.value)}
            placeholder="예: Penfolds Bin 389"
            maxLength={80}
            className="mt-1 w-full rounded-xl border border-muted-2 bg-white px-3.5 py-3 text-[14px] text-ink placeholder:text-ink/30 focus:border-wine focus:outline-none"
          />
        </div>

        {/* Memo */}
        <div className="mt-3">
          <label className="text-[12px] font-medium text-ink-soft">
            메모 <span className="text-ink/30">(선택)</span>
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="짧은 한 줄 노트"
            rows={2}
            maxLength={80}
            className="mt-1 w-full resize-none rounded-xl border border-muted-2 bg-white px-3.5 py-3 text-[13px] text-ink placeholder:text-ink/30 focus:border-wine focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className={[
            "mt-5 w-full rounded-full py-3.5 text-[14px] font-semibold transition-colors",
            canSave
              ? "bg-wine text-paper hover:bg-wine/90"
              : "cursor-not-allowed bg-muted-2 text-ink/40",
          ].join(" ")}
        >
          {saving ? "저장 중…" : "도감에 기록하기"}
        </button>
      </div>
    </div>
  );
}
