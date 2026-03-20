import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "むずかしいモード攻略 | ダルマ落としPHYSICS",
  description: "ダルマ落としPHYSICSのむずかしいモード完全攻略ガイド。重力が強く摩擦が小さい極限設定。段位「師範」達成への道を解説！",
};

export default function HardChallengePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center"
      style={{ background: "linear-gradient(160deg, #1a0005, #3b0010, #1a0a00)" }}>
      <div className="w-full max-w-sm px-4 pt-6 pb-2 flex items-center gap-3">
        <Link href="/" className="text-orange-400 hover:text-orange-200 text-sm transition-colors">← トップ</Link>
        <h1 className="text-base font-black flex-1 text-center" style={{ color: "#ffb899" }}>🔴 むずかしいモード攻略</h1>
        <Link href="/game" className="text-orange-400 hover:text-orange-200 text-sm transition-colors">プレイ →</Link>
      </div>

      <div className="w-full max-w-sm px-4 pb-12">
        {/* ヒーロー */}
        <div className="text-center py-8">
          <div className="text-6xl mb-4" style={{ animation: "pulse 1s infinite" }}>🔴</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: "#ef4444" }}>むずかしいモード</h2>
          <p className="text-sm mb-2" style={{ color: "rgba(255,180,120,0.8)" }}>
            重力MAX・摩擦ミニマムの物理地獄<br />師範達成者は上位1%の猛者のみ！
          </p>
          <div className="inline-block px-4 py-1 rounded-full mb-4 text-xs font-bold"
            style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.4)" }}>
            ⚠️ 上級者向け — かんたん・ふつうをマスターしてから
          </div>
          <br />
          <Link href="/game"
            className="inline-block font-black px-10 py-3 rounded-2xl text-sm transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)", color: "#fff", boxShadow: "0 0 20px rgba(239,68,68,0.5)" }}>
            むずかしいに挑む ⚡
          </Link>
        </div>

        {/* むずかしいモードの特徴 */}
        <section className="mb-8">
          <h2 className="text-center font-black text-sm mb-4 tracking-widest" style={{ color: "rgba(255,150,100,0.7)" }}>
            むずかしいモードの特徴
          </h2>
          <div className="space-y-3">
            {[
              { icon: "💥", title: "重力が1.4倍", desc: "通常の1.4倍の重力設定。少しの衝撃でもタワーが大きく揺れます。1段のミスが即崩壊に繋がります。" },
              { icon: "🌊", title: "摩擦が極小", desc: "だるまが滑りやすい設定。叩いた後に残っただるまがズレやすく、連鎖的な崩れが起きやすいです。" },
              { icon: "⚡", title: "反発係数が高い", desc: "だるまが弾みやすい設定。少しの力でも大きな動きになるため、微妙な力加減が求められます。" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-4 rounded-2xl"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="font-bold text-sm mb-1" style={{ color: "#fca5a5" }}>{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "rgba(252,165,165,0.7)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 上級攻略のコツ */}
        <section className="mb-8">
          <h2 className="text-center font-black text-sm mb-4 tracking-widest" style={{ color: "rgba(255,150,100,0.7)" }}>
            むずかしいモード 上級攻略
          </h2>
          <div className="space-y-3">
            {[
              { icon: "⚡", title: "限界まで速くスワイプ", desc: "むずかしいモードでは通常以上のスピードが必要。スワイプを思い切り速くして衝撃を最小化。" },
              { icon: "🎯", title: "完璧な中心狙い必須", desc: "少しのズレで上が崩れます。毎回だるまの中心に正確にスワイプする精度が求められます。" },
              { icon: "👁️", title: "タワーのバランスを読む", desc: "叩く前にタワーの重心を確認。偏りがある場合は反対方向から補正するように叩くのがコツ。" },
              { icon: "🧘", title: "焦らず一発一発集中", desc: "焦りが最大の敵。1段ずつ丁寧に叩き抜くことで師範達成が見えてきます。" },
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-xl"
                style={{ background: "rgba(255,107,43,0.06)", border: "1px solid rgba(255,107,43,0.15)" }}>
                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <div className="font-bold text-sm mb-0.5" style={{ color: "#ffb899" }}>{tip.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "rgba(255,180,120,0.65)" }}>{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 他の難易度リンク */}
        <section className="mb-8">
          <h2 className="text-center font-black text-sm mb-4" style={{ color: "rgba(255,150,100,0.7)" }}>他の難易度もチェック</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/challenge/easy"
              className="rounded-xl p-4 text-center transition-all hover:scale-105"
              style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}>
              <div className="text-2xl mb-1">🟢</div>
              <div className="font-bold text-sm" style={{ color: "#86efac" }}>かんたん</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(134,239,172,0.6)" }}>初心者向け</div>
            </Link>
            <Link href="/game"
              className="rounded-xl p-4 text-center transition-all hover:scale-105"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <div className="text-2xl mb-1">🟡</div>
              <div className="font-bold text-sm" style={{ color: "#fbbf24" }}>ふつう</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(251,191,36,0.6)" }}>バランス設定</div>
            </Link>
          </div>
        </section>

        {/* 師範への道 */}
        <section className="mb-8">
          <div className="rounded-2xl p-5"
            style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(239,68,68,0.08))", border: "1px solid rgba(251,191,36,0.3)" }}>
            <div className="text-center mb-3">
              <span className="text-3xl">👑</span>
              <h2 className="font-black text-base mt-1" style={{ color: "#fbbf24" }}>師範（最高位）への道</h2>
            </div>
            <p className="text-xs leading-relaxed text-center" style={{ color: "rgba(251,191,36,0.8)" }}>
              むずかしいモードでエンドレス21段クリアすることで<br />
              最高段位「師範（Master）」が認定されます。<br />
              段位認定証はXでシェアできます。
            </p>
            <div className="mt-3 text-center">
              <Link href="/game"
                className="inline-block font-black text-xs px-8 py-2.5 rounded-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
                師範を目指す ⚡
              </Link>
            </div>
          </div>
        </section>

        {/* JSON-LD HowTo */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "ダルマ落としPHYSICS むずかしいモード攻略",
          "description": "上級者向けむずかしいモードの攻略方法を4ステップで解説",
          "step": [
            { "@type": "HowToStep", "name": "限界まで速くスワイプ", "text": "むずかしいモードでは通常以上のスピードが必要" },
            { "@type": "HowToStep", "name": "完璧な中心狙い必須", "text": "少しのズレで上が崩れるため精度が重要" },
            { "@type": "HowToStep", "name": "タワーのバランスを読む", "text": "叩く前に重心を確認して補正する" },
            { "@type": "HowToStep", "name": "焦らず一発集中", "text": "1段ずつ丁寧に叩き抜いて師範を目指す" },
          ]
        }) }} />
      </div>
    </div>
  );
}
