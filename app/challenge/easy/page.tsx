import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "かんたんモード攻略 | ダルマ落としPHYSICS",
  description: "ダルマ落としPHYSICSのかんたんモード完全攻略ガイド。重力が弱く摩擦が大きいので初心者でも安心。段位「初段」達成を目指そう！",
};

export default function EasyChallengePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center"
      style={{ background: "linear-gradient(160deg, #1a0005, #3b0010, #1a0a00)" }}>
      <div className="w-full max-w-sm px-4 pt-6 pb-2 flex items-center gap-3">
        <Link href="/" className="text-orange-400 hover:text-orange-200 text-sm transition-colors">← トップ</Link>
        <h1 className="text-base font-black flex-1 text-center" style={{ color: "#ffb899" }}> かんたんモード攻略</h1>
        <Link href="/game" className="text-orange-400 hover:text-orange-200 text-sm transition-colors">プレイ →</Link>
      </div>

      <div className="w-full max-w-sm px-4 pb-12">
        {/* ヒーロー */}
        <div className="text-center py-8">
          <div className="text-6xl mb-4 animate-bounce"></div>
          <h2 className="text-2xl font-black mb-2" style={{ color: "#22c55e" }}>かんたんモード</h2>
          <p className="text-sm mb-4" style={{ color: "rgba(255,180,120,0.8)" }}>
            重力弱め・摩擦大きめで安定したタワー<br />初心者でも10段クリアを目指せる！
          </p>
          <Link href="/game"
            className="inline-block font-black px-10 py-3 rounded-2xl text-sm transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", boxShadow: "0 0 20px rgba(34,197,94,0.4)" }}>
            かんたんモードで遊ぶ 
          </Link>
        </div>

        {/* かんたんモードの特徴 */}
        <section className="mb-8">
          <h2 className="text-center font-black text-sm mb-4 tracking-widest" style={{ color: "rgba(255,150,100,0.7)" }}>
            かんたんモードの特徴
          </h2>
          <div className="space-y-3">
            {[
              { icon: "", title: "重力が弱い", desc: "通常より重力が40%弱く設定されています。タワーが崩れにくく、少しの失敗なら立て直せます。" },
              { icon: "", title: "摩擦が大きい", desc: "だるま同士の摩擦係数が高いため、叩いた後にだるまが滑りすぎず安定。ズレが最小限に抑えられます。" },
              { icon: "", title: "コントロールしやすい", desc: "スワイプの力加減がそのまま伝わりやすく、狙った方向に正確に叩き抜けます。初めての方に最適。" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-4 rounded-2xl"
                style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="font-bold text-sm mb-1" style={{ color: "#86efac" }}>{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "rgba(134,239,172,0.7)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 攻略のコツ */}
        <section className="mb-8">
          <h2 className="text-center font-black text-sm mb-4 tracking-widest" style={{ color: "rgba(255,150,100,0.7)" }}>
            かんたんモード攻略のコツ
          </h2>
          <div className="space-y-3">
            {[
              { icon: "", title: "スピードは速めに", desc: "かんたんモードでも素早くスワイプするほどうまく抜けます。ゆっくりだと上が崩れます。" },
              { icon: "", title: "中心を狙う", desc: "だるまの中心を真横に狙うのが基本。かんたんモードは多少ズレても安定します。" },
              { icon: "", title: "10段まで目指す", desc: "まずは連続10段クリアを目標に！10段達成で「四段」の段位認定を目指せます。" },
              { icon: "", title: "ふつうモードに挑戦", desc: "かんたんモードで安定してきたらふつうモードに挑戦。物理特性が上がりさらに奥深くなります。" },
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
            <Link href="/game"
              className="rounded-xl p-4 text-center transition-all hover:scale-105"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <div className="text-2xl mb-1"></div>
              <div className="font-bold text-sm" style={{ color: "#fbbf24" }}>ふつう</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(251,191,36,0.6)" }}>バランス設定</div>
            </Link>
            <Link href="/challenge/hard"
              className="rounded-xl p-4 text-center transition-all hover:scale-105"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <div className="text-2xl mb-1"></div>
              <div className="font-bold text-sm" style={{ color: "#fca5a5" }}>むずかしい</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(252,165,165,0.6)" }}>物理最大設定</div>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/game"
            className="inline-block w-full py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff", boxShadow: "0 0 30px rgba(255,80,0,0.4)" }}>
            かんたんモードで遊ぶ 
          </Link>
        </div>

        {/* JSON-LD HowTo */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "ダルマ落としPHYSICS かんたんモード攻略",
          "description": "初心者向けかんたんモードの攻略方法を4ステップで解説",
          "step": [
            { "@type": "HowToStep", "name": "スピードは速めに", "text": "素早くスワイプするほどうまく抜けます" },
            { "@type": "HowToStep", "name": "中心を狙う", "text": "だるまの中心を真横に狙うのが基本" },
            { "@type": "HowToStep", "name": "10段クリアを目指す", "text": "連続10段達成で四段の段位認定" },
            { "@type": "HowToStep", "name": "ふつうモードに挑戦", "text": "安定してきたら上位難易度へ" },
          ]
        }) }} />
      </div>
    </div>
  );
}
