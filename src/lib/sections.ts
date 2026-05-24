import type { Section, SectionId } from "./types";

export const SECTIONS: Section[] = [
  { id: "korean", label: "한식", badgeClass: "bg-sec-korean" },
  { id: "western", label: "양식", badgeClass: "bg-sec-western" },
  { id: "japanese", label: "일식", badgeClass: "bg-sec-japanese" },
  { id: "chinese", label: "중식", badgeClass: "bg-sec-chinese" },
  { id: "dessert", label: "디저트", badgeClass: "bg-sec-dessert" },
  { id: "snack", label: "안주", badgeClass: "bg-sec-snack" },
];

const SECTION_MAP: Record<SectionId, Section> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s])
) as Record<SectionId, Section>;

export function getSection(id: SectionId): Section {
  return SECTION_MAP[id];
}
