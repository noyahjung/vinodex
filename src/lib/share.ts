import { toPng } from "html-to-image";

interface ShareOptions {
  element: HTMLElement;
  filename: string;
  title?: string;
  // Background color baked into the PNG (transparent areas render this).
  backgroundColor?: string;
}

export type ShareResult =
  | { kind: "shared" }      // Native share sheet succeeded
  | { kind: "downloaded" }  // Fallback file download
  | { kind: "cancelled" };  // User dismissed the share sheet

// Capture the given element as a PNG and offer it to the user.
// Mobile (iOS Safari, Android Chrome) with file-share support gets the
// native share sheet; everywhere else we fall back to a file download.
export async function captureAndShare({
  element,
  filename,
  title,
  backgroundColor = "#FAF7F2",
}: ShareOptions): Promise<ShareResult> {
  const dataUrl = await toPng(element, {
    pixelRatio: 2, // crisp on retina; also gives Instagram-ready resolution
    backgroundColor,
    cacheBust: true,
  });

  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], filename, { type: "image/png" });

  // Try the native share sheet first.
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  if (
    nav?.share &&
    nav.canShare &&
    nav.canShare({ files: [file] })
  ) {
    try {
      await nav.share({ files: [file], title });
      return { kind: "shared" };
    } catch (err) {
      // User-initiated cancellations come back as AbortError; treat them
      // distinctly from real failures so the UI can stay quiet.
      if ((err as Error)?.name === "AbortError") {
        return { kind: "cancelled" };
      }
      // Fall through to the download fallback if share itself broke.
    }
  }

  // Fallback: trigger a normal file download.
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  return { kind: "downloaded" };
}
