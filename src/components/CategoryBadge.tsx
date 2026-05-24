import { getSection } from "@/lib/sections";
import type { SectionId } from "@/lib/types";

interface Props {
  section: SectionId;
  variant?: "chip" | "dot";
  size?: "sm" | "xs";
}

export function CategoryBadge({ section, variant = "chip", size = "sm" }: Props) {
  const s = getSection(section);

  if (variant === "dot") {
    return (
      <span
        aria-label={s.label}
        className={`inline-block h-2 w-2 shrink-0 rounded-full ${s.badgeClass}`}
      />
    );
  }

  const sizing =
    size === "xs"
      ? "text-[10px] px-1.5 py-0.5"
      : "text-[11px] px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium text-ink/80 ${s.badgeClass} ${sizing}`}
    >
      {s.label}
    </span>
  );
}
