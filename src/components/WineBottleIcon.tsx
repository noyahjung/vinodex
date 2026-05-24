import type { SVGProps } from "react";

// Simple bordeaux-style wine bottle silhouette.
// Single-color SVG; consumer controls color via `currentColor`.
export function WineBottleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 96"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* neck + foil */}
      <rect x="20" y="4" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="19" y="11" width="10" height="14" rx="1.5" fill="currentColor" />
      {/* body: bordeaux shoulder — sharp transition from neck to wide cylinder */}
      <path
        d="M19 25
           C 15 27, 12 32, 12 40
           L 12 86
           C 12 89, 14 91, 17 91
           L 31 91
           C 34 91, 36 89, 36 86
           L 36 40
           C 36 32, 33 27, 29 25
           Z"
        fill="currentColor"
      />
      {/* paper label band */}
      <rect
        x="14"
        y="58"
        width="20"
        height="22"
        rx="1"
        fill="rgba(255,255,255,0.55)"
      />
    </svg>
  );
}
