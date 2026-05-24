"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  href: string;
  label: string;
  icon: React.ReactNode;
  // active for routes that start with `match`
  match: string;
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.4 : 1.8}
      className="h-[22px] w-[22px]"
      aria-hidden="true"
    >
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.5 10.5V20h13v-9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DexIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.4 : 1.8}
      className="h-[22px] w-[22px]"
      aria-hidden="true"
    >
      <path
        d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"
        strokeLinejoin="round"
      />
      <path d="M5 17a3 3 0 0 1 3-3h11" strokeLinejoin="round" />
      <path d="M9 8h6" strokeLinecap="round" />
    </svg>
  );
}

const TABS: Tab[] = [
  { href: "/", label: "홈", match: "/", icon: <></> },
  { href: "/dex", label: "도감", match: "/dex", icon: <></> },
];

export function BottomTabBar() {
  const pathname = usePathname() ?? "/";

  // Home is exact-match only so /dex and /food/* don't both light up "홈".
  const isActive = (tab: Tab) => {
    if (tab.match === "/") return pathname === "/";
    return pathname.startsWith(tab.match);
  };

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 border-t border-muted-2 bg-paper/95 backdrop-blur-md">
      <ul className="mx-auto flex max-w-[390px] items-stretch">
        {TABS.map((tab) => {
          const active = isActive(tab);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={[
                  "flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors",
                  active ? "text-wine" : "text-ink/45 hover:text-ink/70",
                ].join(" ")}
              >
                {tab.href === "/" ? (
                  <HomeIcon active={active} />
                ) : (
                  <DexIcon active={active} />
                )}
                <span
                  className={`text-[11px] ${
                    active ? "font-semibold" : "font-medium"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
