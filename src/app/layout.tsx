import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import { BottomTabBar } from "@/components/BottomTabBar";
import { VinodexProvider } from "@/lib/store";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vinodex — 음식별 와인 도감",
  description: "당신만의 와인 도감을 채워보세요",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FAF7F2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={fraunces.variable}>
      <head>
        {/* Pretendard via CDN — comprehensive Korean weights, not on next/font/google. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <style
          // Hook the Pretendard CDN font into our --font-pretendard var
          // so tailwind's font-sans picks it up.
          dangerouslySetInnerHTML={{
            __html: `:root { --font-pretendard: "Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }`,
          }}
        />
      </head>
      <body className="font-sans">
        <VinodexProvider>
          <div className="phone-frame">
            <main className="phone-main">{children}</main>
            <BottomTabBar />
          </div>
        </VinodexProvider>
      </body>
    </html>
  );
}
