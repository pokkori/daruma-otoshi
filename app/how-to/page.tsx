import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ダルマ落とし PHYSICS | 遊び方・攻略・段位認定ガイド",
  description: "ダルマ落としPHYSICSの遊び方・攻略法・段位認定システムを完全解説。インストール不要でブラウザからすぐ遊べる本格物理パズルゲームのコツを学ぼう。",
  openGraph: {
    title: "ダルマ落とし PHYSICS | 遊び方・攻略ガイド",
    description: "ダルマ落としPHYSICSの遊び方・攻略法・段位認定システムを完全解説。",
    url: "https://daruma-otoshi.vercel.app/how-to",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "ダルマ落とし PHYSICS — 遊び方・攻略法・段位認定ガイド",
  "description": "ダルマ落としPHYSICSの遊び方・攻略法・段位認定システムを解説。物理演算を活用した本格ブラウザゲームのコツを学ぼう。",
  "url": "https://daruma-otoshi.vercel.app/how-to",
  "publisher": { "@type": "Organization", "name": "ポッコリラボ" },
  "dateModified": "2026-03-20",
};

export default function HowToPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #1a0005, #3b0010, #1a0a00)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 sticky top-0 z-10"
        style={{ borderColor: "rgba(255,107,43,0.3)", background: "rgba(26,0,5,0.95)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-sm" style={{ color: "#ffb899" }}>← ダルマ落とし PHYSICS</Link>
          <Link href="/game"
            className="text-xs font-bold px-4 py-2 rounded-full"
            style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
            今すぐプレイ →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-14 px-4 text-center" style={{ borderBottom: "1px solid rgba(255,107,43,0.2)" }}>
        <div className="max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(255,107,43,0.25)", color: "#ffb899", border: "1px solid rgba(255,107,43,0.5)" }}>
            遊び方・攻略ガイド
          </span>
          <h1 className="text-3xl font-black mb-4 leading-tight" style={{ color: "#fff" }}>
            ダルマ落とし PHYSICS<br />
            <span style={{ color: "#ff6b2b" }}>完全攻略ガイド</span>
          </h1>
          <p className="text-sm mb-6" style={{ color: "rgba(255,165,130,0.7)" }}>
            物理演算を活かした攻略法・段位認定システム・コツを完全解説
          </p>
          <Link href="/game"
            className="inline-block font-black py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
            実際にプレイしてみる →
          </Link>
        </div>
      </section>

      {/* コンテンツ */}
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* 基本ルール */}
        <section className="mb-12">
          <h2 className="text-xl font-black mb-6" style={{ color: "#ff6b2b" }}>基本ルール</h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "タワーを観察する",
                desc: "まずはだるまタワーの積み方を確認しよう。どのだるまが「黄色（叩き対象）」か確認する。黄色のだるまを左右にスワイプして叩き抜く。",
              },
              {
                step: "2",
                title: "スワイプして叩き抜く",
                desc: "黄色のだるまをスワイプすると方向と速度が決まる。スピードが速いほど上のだるまへの衝撃が少なくなる。ゆっくりスワイプするとタワーが崩れやすい。",
              },
              {
                step: "3",
                title: "守護神だるまを守れ",
                desc: "一番上にいる「守護神だるま」を落としたらゲームオーバー。すべての黄色いだるまを叩き抜いて守護神を守り切ればクリア！",
              },
              {
                step: "4",
                title: "エンドレスモードに挑戦",
                desc: "通常レベルをクリアするとエンドレスモードが解放。段数が増えるほどタワーが高くなり難易度上昇。どこまで続けられるか挑戦しよう。",
              },
            ].map((step) => (
              <div key={step.step} className="flex gap-4 rounded-2xl p-5"
                style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.25)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                  style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: "#ffb899" }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,165,130,0.75)" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 攻略のコツ */}
        <section className="mb-12">
          <h2 className="text-xl font-black mb-6" style={{ color: "#ff6b2b" }}>攻略の5つのコツ</h2>
          <div className="space-y-4">
            {[
              {
                icon: "",
                title: "スピード最優先",
                desc: "物理演算では、叩くスピードが速いほど上段への衝撃が少なくなる。特に5段以上のタワーでは「速く叩く」ことが最重要。",
                level: "基本",
              },
              {
                icon: "",
                title: "角度を意識する",
                desc: "真横ではなく、少し下向きの角度でスワイプすると摩擦が減る。タワーの形状によって最適な角度が変わるので、まず試してみよう。",
                level: "中級",
              },
              {
                icon: "",
                title: "摩擦を利用する",
                desc: "だるまは木や石の上に置かれると摩擦が増える。その場合は少し力を入れてスワイプする必要がある。素材の違いを感じ取ろう。",
                level: "中級",
              },
              {
                icon: "",
                title: "中心を正確に叩く",
                desc: "だるまの中心を外れると回転が生じてタワーが揺れやすくなる。スワイプの始点はだるまの中心を狙おう。",
                level: "上級",
              },
              {
                icon: "",
                title: "タワーのバランスを予測",
                desc: "どのだるまを抜くかによって次の崩れ方が変わる。下から順番に抜くのが基本だが、タワーのバランスによっては上から抜いたほうがいいケースも。",
                level: "上級",
              },
            ].map((tip, i) => (
              <div key={i} className="flex gap-4 rounded-2xl p-5"
                style={{ background: "rgba(255,107,43,0.07)", border: "1px solid rgba(255,107,43,0.2)" }}>
                <span className="text-2xl shrink-0">{tip.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm" style={{ color: "#ffb899" }}>{tip.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: tip.level === "基本" ? "rgba(34,197,94,0.2)" : tip.level === "中級" ? "rgba(251,191,36,0.2)" : "rgba(239,68,68,0.2)", color: tip.level === "基本" ? "#86efac" : tip.level === "中級" ? "#fbbf24" : "#fca5a5" }}>
                      {tip.level}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,165,130,0.75)" }}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 段位認定システム */}
        <section className="mb-12">
          <h2 className="text-xl font-black mb-6" style={{ color: "#ff6b2b" }}>段位認定システム（全7段位）</h2>
          <div className="space-y-3">
            {[
              { badge: "", rank: "見習い叩き師", condition: "エンドレス0段〜", desc: "ゲームを始めたばかりの初心者。基本ルールをマスターしよう。", color: "#94a3b8" },
              { badge: "", rank: "初段", condition: "エンドレス1段達成", desc: "安定して1段クリアできるようになった。スピードの基本を習得。", color: "#f97316" },
              { badge: "", rank: "二段", condition: "エンドレス3段達成", desc: "3段タワーを安定してクリア。角度と力加減を習得した証。", color: "#ef4444" },
              { badge: "", rank: "三段", condition: "エンドレス6段達成", desc: "6段の高さでも動じない安定感。上級者の仲間入り。", color: "#a855f7" },
              { badge: "", rank: "四段", condition: "エンドレス10段達成", desc: "10段はかなりの難関。物理演算の特性を熟知した証。", color: "#f59e0b" },
              { badge: "", rank: "師範代", condition: "エンドレス15段達成", desc: "15段到達は実力者の証。もはや「師範」まであと一歩。", color: "#d97706" },
              { badge: "", rank: "師範（最高位）", condition: "エンドレス21段達成", desc: "伝説の段位。21段をクリアできる者はごくわずか。", color: "#fbbf24" },
            ].map((r) => (
              <div key={r.rank} className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
                <span className="text-2xl flex-shrink-0">{r.badge}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-black text-sm" style={{ color: r.color }}>{r.rank}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,43,0.15)", color: "rgba(255,180,120,0.8)" }}>{r.condition}</span>
                  </div>
                  <p className="text-xs" style={{ color: "rgba(255,165,130,0.65)" }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link href="/game"
              className="inline-block font-black py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
              段位認定に挑戦する →
            </Link>
          </div>
        </section>

        {/* 難易度ガイド */}
        <section className="mb-12">
          <h2 className="text-xl font-black mb-6" style={{ color: "#ff6b2b" }}>難易度の選び方</h2>
          <div className="space-y-4">
            {[
              {
                emoji: "",
                label: "かんたん",
                color: "#22c55e",
                for: "初心者・お子さま向け",
                desc: "重力が弱くだるまが安定します。摩擦が大きいためスワイプ後のだるまが滑りにくく、コントロールしやすい。まず「かんたん」で遊び方をマスターしよう。",
              },
              {
                emoji: "",
                label: "ふつう",
                color: "#f59e0b",
                for: "標準・バランス型",
                desc: "物理演算の醍醐味を最もバランスよく楽しめる難易度。程よい重力と摩擦で、スピードと角度の判断が問われます。物理パズルを本格的に楽しみたい方に。",
              },
              {
                emoji: "",
                label: "むずかしい",
                color: "#ef4444",
                for: "上級者・段位認定狙い向け",
                desc: "重力が強くだるまが滑りやすいため、タワーが不安定になりやすい。少しのミスで崩れる本格仕様。師範・師範代を目指す上級者に挑戦してほしい難易度。",
              },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 rounded-2xl p-5"
                style={{ background: `${item.color}11`, border: `1px solid ${item.color}44` }}>
                <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-base" style={{ color: item.color }}>{item.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${item.color}22`, color: item.color }}>{item.for}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,165,130,0.75)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* デイリーチャレンジ */}
        <section className="mb-12 rounded-2xl p-6"
          style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.25)" }}>
          <h2 className="text-lg font-black mb-4" style={{ color: "#ff6b2b" }}>デイリーチャレンジ・ランキングシステム</h2>
          <div className="space-y-3">
            {[
              { icon: "", title: "デイリーチャレンジ", desc: "毎日変わる特別なクリア目標。「今日は3段クリアを目指せ！」などの目標が毎朝更新。達成するとランキングに記録される。" },
              { icon: "", title: "ローカルランキング", desc: "あなたのプレイ記録がTOP10まで自動保存。日付・スコア・段位が記録される。過去の自己ベストを超え続けよう。" },
              { icon: "️", title: "友達への挑戦状", desc: "ゲームオーバー後に「挑戦状を送る」ボタンでスコア入りURLを生成。友達がそのURLを開くとあなたのスコアが表示され、対決ムードに！" },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 items-start p-3 rounded-xl"
                style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="font-bold text-sm mb-0.5" style={{ color: "#ff6b2b" }}>{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "rgba(255,180,120,0.8)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link href="/ranking"
              className="inline-block font-black py-2.5 px-6 rounded-xl text-xs active:scale-95 transition-transform"
              style={{ background: "rgba(255,107,43,0.2)", color: "#ffb899", border: "1px solid rgba(255,107,43,0.4)" }}>
              ランキングを見る →
            </Link>
          </div>
        </section>
      </div>

      <footer className="text-center text-xs pb-8" style={{ color: "rgba(255,100,50,0.4)", borderTop: "1px solid rgba(255,107,43,0.2)", paddingTop: "24px" }}>
        <Link href="/" className="underline hover:opacity-70">トップページ</Link>
        {" | "}
        <Link href="/game" className="underline hover:opacity-70">今すぐプレイ</Link>
        {" | "}
        <Link href="/ranking" className="underline hover:opacity-70">ランキング</Link>
        {" | "}
        <Link href="/legal" className="underline hover:opacity-70">特定商取引法</Link>
      </footer>
    </div>
  );
}
