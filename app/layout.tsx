import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import OrbBackground from "@/components/OrbBackground";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

const SITE_URL = "https://daruma-otoshi.vercel.app";
const TITLE = "ダルマ落とし PHYSICS | 物理だるまタワー — 毎日プレイで段位認定";
const DESC = "だるまタワーを下から叩いて抜く本格物理パズル。Matter.js物理演算で毎回違う崩れ方。デイリーチャレンジ・ランキング・段位認定。無料プレイ！";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["ダルマ落とし", "物理パズル", "ブラウザゲーム", "だるまゲーム", "無料ゲーム", "物理演算ゲーム", "脳トレ", "暇つぶしゲーム"],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "ダルマ落とし PHYSICS",
    type: "website",
    locale: "ja_JP",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "ダルマ落とし PHYSICS" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  other: { "theme-color": "#1a0a00" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "VideoGame",
      "name": "ダルマ落とし PHYSICS",
      "url": SITE_URL,
      "description": DESC,
      "genre": "Puzzle",
      "gamePlatform": "Web Browser",
      "applicationCategory": "Game",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "description": "無料プレイ" },
      "publisher": { "@type": "Organization", "name": "ポッコリラボ" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "ダルマ落としPHYSICSはどうやって遊ぶの？", "acceptedAnswer": { "@type": "Answer", "text": "横にスワイプして下のだるまを叩き抜きます。タワーを崩さず全てのだるまを取り除けばクリア！スピードが命で、ゆっくりだと上のだるまが崩れます。" } },
        { "@type": "Question", "name": "デイリーチャレンジとは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "毎日変わる特別なクリア目標です。例えば「エンドレス3段クリア」など。達成すると記録に残ります。毎日ログインする楽しみになります。" } },
        { "@type": "Question", "name": "段位認定はどのように決まりますか？", "acceptedAnswer": { "@type": "Answer", "text": "エンドレスモードで達成した最高段数によって段位が決まります。1段=初段、3段=二段、6段=三段、10段=四段、15段=師範代、21段=師範（最高位）です。" } },
        { "@type": "Question", "name": "スマホでも遊べますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、スマートフォン・タブレットに完全対応しています。タップ操作でも快適に遊べます。" } },
        { "@type": "Question", "name": "難易度は選べますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、かんたん・ふつう・むずかしいの3段階から選べます。難易度によって重力・摩擦・滑りやすさが変わるので、初心者から上級者まで楽しめます。" } },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${notoSansJP.className} text-slate-100 antialiased`}>
        <OrbBackground />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
