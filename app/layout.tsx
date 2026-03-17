import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🎎 ダルマ落とし PHYSICS | 物理だるまタワー",
  description: "だるまタワーを下から叩いて抜く物理パズル。Matter.js本格物理演算で毎回異なる崩れ方が映える！",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
