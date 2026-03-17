import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ダルマ落とし PHYSICS | 物理だるまタワー",
  description: "だるまタワーを下から叩いて抜く物理パズル。Matter.js本格物理演算で毎回異なる崩れ方が映える！",
  metadataBase: new URL("https://daruma-otoshi.vercel.app"),
  openGraph: {
    title: "ダルマ落とし PHYSICS — 本格物理演算パズル",
    description: "タワーを崩さず下のだるまを叩き抜け！本格物理演算で毎回違う崩れ方。無料プレイ！",
    url: "https://daruma-otoshi.vercel.app",
    siteName: "ダルマ落とし PHYSICS",
    type: "website",
    locale: "ja_JP",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
