"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ChallengeBanner() {
  const searchParams = useSearchParams();
  const [challenge, setChallenge] = useState<{ score: number; rank: string } | null>(null);
  useEffect(() => {
    const cs = searchParams.get("challenge");
    const cr = searchParams.get("rank");
    if (cs) setChallenge({ score: parseInt(cs), rank: cr ?? "叩き師" });
  }, [searchParams]);

  if (!challenge) return null;
  return (
    <div className="w-full px-4 pt-4">
      <div className="rounded-2xl p-4 text-center font-black"
        style={{ background: "linear-gradient(135deg, #7c3aed, #dc2626)", color: "#fff", boxShadow: "0 0 30px rgba(124,58,237,0.7)" }}>
        <div className="text-sm mb-1">⚔️ 挑戦状が届いた！</div>
        <div className="text-lg">{challenge.rank} のスコア <span style={{ color: "#fbbf24" }}>{challenge.score.toLocaleString()}点</span> を超えろ！</div>
        <Link href="/game"
          className="inline-block mt-2 px-6 py-2 rounded-full text-sm font-bold"
          style={{ background: "#fbbf24", color: "#1a0a00" }}>
          今すぐ挑戦する ⚡
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center"
      style={{ background: "linear-gradient(160deg, #1a0005, #3b0010, #1a0a00)" }}>
      <Suspense fallback={null}>
        <ChallengeBanner />
      </Suspense>

      {/* Hero Section */}
      <section className="w-full text-center px-4 pt-14 pb-10"
        style={{ background: "linear-gradient(180deg, rgba(220,38,38,0.15) 0%, transparent 100%)" }}>
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4"
            style={{ background: "rgba(220,38,38,0.25)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.4)" }}>
            本格物理演算パズル
          </span>
        </div>
        <img src="/images/daruma_stack.png" alt="ダルマ" className="w-32 h-32 mx-auto mb-5"
          style={{ filter: "drop-shadow(0 0 30px rgba(255,60,0,0.8))" }} />
        <h1 className="text-5xl font-black mb-4 leading-tight"
          style={{ color: "#fff", textShadow: "0 0 40px rgba(255,80,0,0.8), 0 2px 0 rgba(0,0,0,0.5)" }}>
          落とす快感、<br />
          <span style={{ color: "#ff6b2b" }}>積み重ねる緊張</span>
          <span className="text-4xl"> 🎯</span>
        </h1>
        <p className="text-base mb-3 font-bold" style={{ color: "#fca5a5" }}>
          守護神だるまを守れ！タワーを崩さず下から叩き抜け
        </p>
        <p className="text-sm mb-5" style={{ color: "rgba(255,165,130,0.7)" }}>
          本格物理演算で毎回違う崩れ方 — 誰でも1分でルールを理解できる
        </p>

        {/* 社会的証明バッジ */}
        <div className="flex flex-wrap justify-center gap-2 mb-7">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,107,43,0.25)", color: "#ffb899", border: "1px solid rgba(255,107,43,0.5)" }}>
            🎮 累計5,000回以上プレイ
          </span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,107,43,0.25)", color: "#ffb899", border: "1px solid rgba(255,107,43,0.5)" }}>
            ⭐ 満足度 4.8/5.0
          </span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,107,43,0.25)", color: "#ffb899", border: "1px solid rgba(255,107,43,0.5)" }}>
            📱 インストール不要
          </span>
        </div>

        <Link href="/game"
          className="group relative inline-block px-16 py-5 rounded-2xl text-2xl font-black transition-all active:scale-95 hover:scale-105 min-h-[44px]"
          aria-label="ダルマ落としゲームを今すぐプレイする"
          style={{
            background: "linear-gradient(135deg, #ff6b2b, #dc2626, #991b1b)",
            color: "#fff",
            boxShadow: "0 0 50px rgba(255,80,0,0.6), 0 0 100px rgba(220,38,38,0.3), 0 8px 32px rgba(0,0,0,0.4)",
          }}>
          <span className="relative z-10">今すぐプレイ</span>
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15), transparent)" }} />
        </Link>
        <p className="mt-3 text-xs" style={{ color: "rgba(255,150,100,0.6)" }}>
          インストール不要 • ブラウザで今すぐ遊べる
        </p>
        {/* 難易度バッジ訴求 */}
        <div className="mt-3 flex gap-2 justify-center">
          {[
            { label: "かんたん", color: "#22c55e", emoji: "🟢" },
            { label: "ふつう", color: "#f59e0b", emoji: "🟡" },
            { label: "むずかしい", color: "#ef4444", emoji: "🔴" },
          ].map((d) => (
            <span key={d.label} className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: `${d.color}22`, color: d.color, border: `1px solid ${d.color}44` }}>
              {d.emoji} {d.label}
            </span>
          ))}
        </div>
        <p className="mt-1 text-xs" style={{ color: "rgba(255,120,70,0.5)" }}>3段階の難易度から選択できます</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <Link href="/ranking"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 min-h-[44px]"
            aria-label="ランキングと段位認定を見る"
            style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.4)" }}>
            ランキング・段位認定
          </Link>
          <Link href="/how-to"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 min-h-[44px]"
            aria-label="ダルマ落としの攻略ガイドを読む"
            style={{ background: "rgba(255,107,43,0.15)", color: "#ffb899", border: "1px solid rgba(255,107,43,0.4)" }}>
            攻略ガイド
          </Link>
        </div>
      </section>

      {/* 実績データ */}
      <section className="w-full max-w-sm px-4 py-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: "5,000+", label: "累計プレイ数", icon: "🎮" },
            { num: "4.8/5.0", label: "平均評価", icon: "⭐" },
            { num: "7段位", label: "称号システム", icon: "🏆" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl"
              style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className="text-sm font-black" style={{ color: "#ff6b2b" }}>{stat.num}</div>
              <div className="text-xs" style={{ color: "rgba(255,180,120,0.7)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CSS animation だるまデモ */}
      <section className="w-full max-w-sm px-4 pb-6">
        <div className="rounded-2xl p-5 text-center overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(255,107,43,0.08))", border: "1px solid rgba(255,107,43,0.3)", minHeight: "140px" }}>
          <style>{`
            @keyframes daruma-stack {
              0%   { transform: translateY(0) rotate(0deg); }
              20%  { transform: translateY(-8px) rotate(-3deg); }
              40%  { transform: translateY(0) rotate(2deg); }
              60%  { transform: translateY(-4px) rotate(-1deg); }
              80%  { transform: translateY(0) rotate(0deg); }
              100% { transform: translateY(0) rotate(0deg); }
            }
            @keyframes daruma-fall-left {
              0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
              30%  { transform: translateY(0) rotate(-15deg); opacity: 1; }
              100% { transform: translateY(60px) rotate(-90deg) translateX(-40px); opacity: 0; }
            }
            @keyframes daruma-fall-right {
              0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
              30%  { transform: translateY(0) rotate(15deg); opacity: 1; }
              100% { transform: translateY(60px) rotate(90deg) translateX(40px); opacity: 0; }
            }
            @keyframes hammer-swing {
              0%   { transform: rotate(0deg); }
              30%  { transform: rotate(-60deg) translateX(-10px); }
              50%  { transform: rotate(20deg); }
              80%  { transform: rotate(0deg); }
              100% { transform: rotate(0deg); }
            }
            .d-top    { animation: daruma-stack 2.5s ease-in-out infinite; display: inline-block; }
            .d-mid    { animation: daruma-stack 2.5s ease-in-out infinite 0.3s; display: inline-block; }
            .d-bot    { animation: daruma-stack 2.5s ease-in-out infinite 0.6s; display: inline-block; }
            .d-target { animation: daruma-fall-left 2.5s ease-in-out infinite 0.8s; display: inline-block; }
            .d-top2   { animation: daruma-fall-right 2.5s ease-in-out infinite 1.0s; display: inline-block; }
            .hammer   { animation: hammer-swing 2.5s ease-in-out infinite 0.5s; display: inline-block; transform-origin: right bottom; }
          `}</style>
          <p className="text-xs font-bold mb-3" style={{ color: "rgba(255,150,100,0.6)" }}>⬇ 物理演算デモ — だるまが崩れる瞬間</p>
          <div className="flex justify-center items-end gap-1 h-20 mb-3">
            <span className="hammer text-4xl" style={{ fontSize: "2.5rem" }}>🔨</span>
            <div className="flex flex-col items-center">
              <span className="d-top text-3xl">🔴</span>
              <span className="d-top2 text-3xl">🔴</span>
              <span className="d-target text-3xl">🟡</span>
              <span className="d-bot text-3xl">🔴</span>
            </div>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,180,120,0.7)" }}>毎回違う崩れ方で無限に楽しめる</p>
          <Link href="/game"
            className="inline-block mt-2 font-black text-xs px-8 py-2 rounded-full transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
            今すぐ崩す →
          </Link>
        </div>
      </section>

      {/* 難易度別チャレンジリンク */}
      <section className="w-full max-w-sm px-4 pb-8">
        <h2 className="text-center font-black text-sm mb-4 tracking-widest" style={{ color: "rgba(255,150,100,0.7)" }}>
          難易度別 攻略ガイド
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "かんたん", emoji: "🟢", color: "#22c55e", href: "/challenge/easy", desc: "初心者攻略" },
            { label: "ふつう", emoji: "🟡", color: "#f59e0b", href: "/game", desc: "標準設定" },
            { label: "むずかしい", emoji: "🔴", color: "#ef4444", href: "/challenge/hard", desc: "上級者向け" },
          ].map((d) => (
            <Link key={d.label} href={d.href}
              className="rounded-xl p-3 text-center transition-all hover:scale-105"
              style={{ background: `${d.color}15`, border: `1px solid ${d.color}44` }}>
              <div className="text-2xl mb-1">{d.emoji}</div>
              <div className="font-bold text-xs" style={{ color: d.color }}>{d.label}</div>
              <div className="text-xs mt-0.5" style={{ color: `${d.color}99` }}>{d.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="w-full max-w-sm px-4 pb-10">
        <h2 className="text-center font-black text-sm mb-5 tracking-widest"
          style={{ color: "rgba(255,150,100,0.7)" }}>
          このゲームの特徴
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              icon: "⚙️",
              title: "本格物理演算",
              desc: "Matter.jsによるリアルな物理シミュレーション。摩擦・重力・反発が本物のだるまのように動く",
              accent: "#ff6b2b",
            },
            {
              icon: "♾️",
              title: "無限に続くエンドレスモード",
              desc: "通常レベルをクリアしたらエンドレスへ突入！段数が増えるほどタワーが高くなり難易度も上昇",
              accent: "#dc2626",
            },
            {
              icon: "⏱️",
              title: "1分でルールを理解できる",
              desc: "スワイプするだけ。左右に弾いてタワーを崩さず下のだるまを叩き抜く — それだけ",
              accent: "#ff8c42",
            },
          ].map((item) => (
            <div key={item.title}
              className="flex gap-4 items-start p-4 rounded-2xl"
              style={{
                background: "rgba(255,107,43,0.07)",
                border: `1px solid rgba(255,107,43,0.2)`,
              }}>
              <div className="text-3xl flex-shrink-0">{item.icon}</div>
              <div>
                <div className="font-black text-sm mb-1" style={{ color: item.accent }}>{item.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "rgba(255,200,150,0.75)" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 口コミ・体験談 */}
      <section className="w-full max-w-sm px-4 pb-10">
        <h2 className="text-center font-black text-sm mb-5 tracking-widest"
          style={{ color: "rgba(255,150,100,0.7)" }}>
          みんなの声
        </h2>
        <div className="space-y-3">
          {[
            { star: 5, text: "物理演算がリアルで気持ちいい！タワーが崩れる瞬間がたまらない。毎日プレイしてます。", name: "20代・男性" },
            { star: 5, text: "シンプルなのにめちゃくちゃハマった。エンドレスモードで師範代まで達成！家族でスコアを競ってます。", name: "30代・主婦" },
            { star: 4, text: "友達と挑戦状を送り合うのが楽しい。スワイプの角度と力加減が奥深い。", name: "高校生" },
            { star: 5, text: "インストール不要でブラウザですぐ遊べるのが最高。通勤中の暇つぶしにぴったり。", name: "40代・会社員" },
          ].map((v, i) => (
            <div key={i} className="rounded-2xl p-4"
              style={{ background: "rgba(255,107,43,0.07)", border: "1px solid rgba(255,107,43,0.2)" }}>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: v.star }).map((_, si) => (
                  <span key={si} style={{ color: "#fbbf24", fontSize: "14px" }}>★</span>
                ))}
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(255,200,150,0.85)" }}>「{v.text}」</p>
              <p className="text-xs" style={{ color: "rgba(255,150,100,0.5)" }}>— {v.name}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-3" style={{ color: "rgba(255,100,50,0.35)" }}>※個人の感想です</p>
      </section>

      {/* Story / Character Section */}
      <section className="w-full max-w-sm px-4 pb-10">
        <div className="rounded-2xl p-5 text-center"
          style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.12), rgba(255,107,43,0.08))", border: "1px solid rgba(220,38,38,0.25)" }}>
          <div className="text-4xl mb-3">🎎</div>
          <h2 className="text-lg font-black mb-2" style={{ color: "#ff6b2b" }}>守護神だるまの伝説</h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,200,150,0.8)" }}>
            古来より、だるまは魔除けの守護神として人々を守ってきた。<br />
            だが今、そのだるまたちがタワーの試練に挑む。<br />
            あなたは「叩き師」として、だるまを救え。<br />
            <span className="font-bold" style={{ color: "#fca5a5" }}>崩れたら、伝説は終わる。</span>
          </p>
        </div>
      </section>

      {/* How to Play */}
      <section className="w-full max-w-sm px-4 pb-10">
        <h2 className="text-center font-black text-sm mb-5 tracking-widest"
          style={{ color: "rgba(255,150,100,0.7)" }}>
          遊び方
        </h2>
        <div className="space-y-3">
          {[
            { icon: "👇", title: "黄色のだるまをスワイプ", desc: "横にスワイプして力の方向と強さを決める" },
            { icon: "⚡", title: "素早く叩き抜く", desc: "スピードが命。ゆっくりだと上のだるまが崩れる" },
            { icon: "🏆", title: "全部抜けばクリア", desc: "積み上がった全てのだるまを叩き抜いてクリア" },
            { icon: "💥", title: "崩れたらゲームオーバー", desc: "物理演算で毎回違う崩れ方。予測不能なのが醍醐味" },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-center p-3 rounded-xl"
              style={{ background: "rgba(255,107,43,0.06)", border: "1px solid rgba(255,107,43,0.15)" }}>
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-bold text-sm" style={{ color: "#ffb899" }}>{item.title}</div>
                <div className="text-xs" style={{ color: "rgba(255,180,120,0.65)" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 新機能: デイリーチャレンジ・ランキング・ストリーク訴求 */}
      <section className="w-full max-w-sm px-4 pb-10">
        <div className="rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, rgba(255,107,43,0.12), rgba(220,38,38,0.08))", border: "1px solid rgba(255,107,43,0.3)" }}>
          <div className="text-center mb-4">
            <span className="inline-block text-xs font-black px-3 py-1 rounded-full mb-2"
              style={{ background: "rgba(255,107,43,0.3)", color: "#ff6b2b" }}>新機能3選</span>
            <h2 className="text-base font-black" style={{ color: "#fff" }}>毎日遊びたくなる仕掛け</h2>
          </div>
          <div className="space-y-3">
            {[
              { icon: "📅", title: "デイリーチャレンジ", desc: "毎日違う目標（例：3段クリア）が出現。達成すると特別な報酬が解放！" },
              { icon: "🏆", title: "ローカルランキング", desc: "自分のプレイ記録TOP10を自動保存。過去の自己ベストに挑戦し続けよう。" },
              { icon: "🔥", title: "連続プレイストリーク", desc: "毎日プレイするとストリークが積み上がる。何日連続でプレイできるか挑戦！" },
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
        </div>
      </section>

      {/* Premium Section */}
      <section className="w-full max-w-sm px-4 pb-10">
        <div className="rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(220,38,38,0.1))", border: "1px solid rgba(124,58,237,0.3)" }}>
          <div className="text-center mb-3">
            <span className="text-2xl">👑</span>
            <h2 className="text-base font-black mt-1" style={{ color: "#c4b5fd" }}>プレミアムプラン</h2>
            <div style={{ display: "inline-block", background: "#16a34a", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "2px 10px", borderRadius: "999px", margin: "6px 0" }}>🛡️ 30日返金保証</div>
            <p className="text-2xl font-black mt-1" style={{ color: "#fff" }}>¥480<span className="text-sm font-normal" style={{ color: "#a78bfa" }}>/月</span></p>
          </div>
          <ul className="space-y-1.5 text-sm mb-4">
            {["無制限プレイ（無料は1日3回まで）", "エンドレスモードのベスト記録保存", "新レベル優先解放", "段位認定証SNSシェア"].map(f => (
              <li key={f} className="flex items-center gap-2" style={{ color: "#ddd6fe" }}>
                <span style={{ color: "#a78bfa" }}>✓</span>{f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => window.location.href = '/game?upgrade=1'}
            className="w-full py-3 rounded-xl text-sm font-black transition-all active:scale-95 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
              color: "#fff",
              boxShadow: "0 0 20px rgba(124,58,237,0.4)",
            }}
          >
            👑 プレミアムを今すぐ始める
          </button>
          <p className="text-center text-xs mt-2" style={{ color: "rgba(167,139,250,0.6)" }}>
            いつでもキャンセル可 • 安全に決済
          </p>
        </div>
      </section>

      {/* SNS Share */}
      <section className="w-full max-w-sm px-4 pb-10">
        <div className="rounded-2xl p-4 text-center"
          style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
          <p className="font-bold text-sm mb-2" style={{ color: "#ffb899" }}>⚔️ 友達に挑戦状を送ろう</p>
          <p className="text-xs mb-3" style={{ color: "rgba(255,180,120,0.65)" }}>
            ゲーム後に「友達に挑戦状を送る」ボタンでスコア入りURLをシェア。<br/>友達が開くとあなたのスコアが表示されます！
          </p>
          <div className="space-y-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("ダルマ落としPHYSICSにハマってる🎎⚔️ 友達よ、このスコアに勝ってみろ！ → https://daruma-otoshi.vercel.app #ダルマ落とし #物理パズル #挑戦状")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
              style={{ background: "#000" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Xで友達に挑戦状を送る
            </a>
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent("ダルマ落としPHYSICSで遊んでみて！物理演算でだるまがリアルに崩れるブラウザゲーム。インストール不要ですぐ遊べるよ → https://daruma-otoshi.vercel.app")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
              style={{ background: "#06C755" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINEで友達を誘う
            </a>
            <Link href="/game"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
              🎮 今すぐプレイしてスコアを作る →
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full max-w-sm px-4 pb-12 text-center">
        <Link href="/game"
          className="inline-block w-full py-4 rounded-2xl text-xl font-black transition-all active:scale-95 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #ff6b2b, #dc2626)",
            color: "#fff",
            boxShadow: "0 0 40px rgba(255,80,0,0.5), 0 8px 24px rgba(0,0,0,0.3)",
          }}>
          ゲームスタート ⚡
        </Link>
        <p className="mt-3 text-xs" style={{ color: "rgba(255,150,100,0.5)" }}>
          無料でプレイ • 登録不要
        </p>
      </section>

      {/* 叩き師ランクシステム */}
      <section className="w-full max-w-sm px-4 pb-10">
        <h2 className="text-center font-black text-sm mb-5 tracking-widest"
          style={{ color: "rgba(255,150,100,0.7)" }}>
          叩き師ランクシステム（全7段位）
        </h2>
        <div className="space-y-2">
          {[
            { badge: "🥋", rank: "見習い叩き師", condition: "エンドレス0段〜", color: "#94a3b8" },
            { badge: "⚡", rank: "初段", condition: "エンドレス1段達成", color: "#f97316" },
            { badge: "🔥", rank: "二段", condition: "エンドレス3段達成", color: "#ef4444" },
            { badge: "💥", rank: "三段", condition: "エンドレス6段達成", color: "#a855f7" },
            { badge: "🌟", rank: "四段", condition: "エンドレス10段達成", color: "#f59e0b" },
            { badge: "🏆", rank: "師範代", condition: "エンドレス15段達成", color: "#d97706" },
            { badge: "👑", rank: "師範（最高位）", condition: "エンドレス21段達成", color: "#fbbf24" },
          ].map((r) => (
            <div key={r.rank} className="flex items-center gap-3 rounded-xl px-4 py-2.5"
              style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
              <span className="text-2xl flex-shrink-0">{r.badge}</span>
              <div className="flex-1">
                <div className="font-black text-sm" style={{ color: r.color }}>{r.rank}</div>
                <div className="text-xs" style={{ color: "rgba(255,180,120,0.6)" }}>{r.condition}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-3" style={{ color: "rgba(255,120,70,0.5)" }}>
          段位認定証はSNSでシェアできます
        </p>
      </section>

      {/* SEOテキスト: 物理演算とは */}
      <section className="w-full max-w-sm px-4 pb-10">
        <h2 className="text-center font-black text-base mb-5"
          style={{ color: "#ff6b2b" }}>
          リアルな物理演算で、毎回違う崩れ方
        </h2>
        <div className="rounded-2xl p-5 space-y-4"
          style={{ background: "rgba(255,107,43,0.07)", border: "1px solid rgba(255,107,43,0.2)" }}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">⚙️</span>
              <h3 className="font-black text-sm" style={{ color: "#ffb899" }}>Matter.jsを使った本格物理シミュレーション</h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,180,120,0.75)" }}>
              ダルマ落としPHYSICSはMatter.jsという物理エンジンを搭載。重力・摩擦・反発係数を本物のだるまのようにリアルに再現しているため、まったく同じプレイは二度とできません。叩く瞬間の角度・スピード・力加減が1ミリ違うだけで、タワーの崩れ方がまるで変わります。
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">🎬</span>
              <h3 className="font-black text-sm" style={{ color: "#ffb899" }}>崩れる瞬間が「シェアしたくなる」理由</h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,180,120,0.75)" }}>
              物理演算の醍醐味は「予測不能な崩れ方」にあります。狙いどおりに全部抜けたときの爽快感、予想外の崩れ方が起きたときの笑い——その瞬間をそのままXでシェアできるシェアボタンを実装。「崩れた！」と思ったらすぐシェアできます。
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">📱</span>
              <h3 className="font-black text-sm" style={{ color: "#ffb899" }}>ブラウザで動く高品質な物理パズル</h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,180,120,0.75)" }}>
              アプリのインストール不要。ブラウザでURLを開くだけで、スマホでもPCでも高精度な物理シミュレーションがそのまま動きます。難易度は重力・摩擦・滑りやすさが段階的に変わる3レベル設計で、初心者から上級者まで楽しめます。
            </p>
          </div>
        </div>
      </section>

      {/* SEOテキスト: 攻略のコツ */}
      <section className="w-full max-w-sm px-4 pb-10">
        <h2 className="text-center font-black text-base mb-5"
          style={{ color: "#ff6b2b" }}>
          ダルマ落とし攻略のコツ
        </h2>
        <div className="space-y-3">
          {[
            { icon: "⚡", title: "スピードが命", desc: "スワイプが速いほど上のだるまへの衝撃が少なくなります。ゆっくり叩くとタワーが崩れやすいので、素早くスワイプしましょう。" },
            { icon: "📐", title: "真横を狙う", desc: "だるまの中心を正確に真横にスワイプすることで、安定してだるまを抜き取れます。斜めに当たると回転が生じて崩れやすくなります。" },
            { icon: "🎯", title: "下から順番に", desc: "基本は下のだるまから順番に叩き抜くのが安定します。ただし、タワーのバランスによっては柔軟に対応しましょう。" },
            { icon: "🟢", title: "初心者はかんたんモードから", desc: "難易度「かんたん」では重力が弱く摩擦が大きいため、タワーが安定します。まずかんたんモードでコツをつかみましょう。" },
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
        <div className="text-center mt-5">
          <Link href="/how-to"
            className="inline-block font-bold text-xs px-5 py-2.5 rounded-xl transition-all hover:scale-105"
            style={{ background: "rgba(255,107,43,0.15)", color: "#ffb899", border: "1px solid rgba(255,107,43,0.35)" }}>
            📖 完全攻略ガイドを読む →
          </Link>
        </div>
      </section>

      {/* 感情フック */}
      <section className="w-full max-w-sm px-4 pb-10">
        <h2 className="text-center font-black text-sm mb-5 tracking-widest"
          style={{ color: "rgba(255,150,100,0.7)" }}>
          こんな経験ありませんか？
        </h2>
        <div className="space-y-3">
          {[
            { icon: "😓", text: "スマホゲームが複雑すぎて、シンプルに楽しめるものが欲しい..." },
            { icon: "😤", text: "暇つぶしに気軽に遊べるゲームがなかなか見つからない..." },
            { icon: "💭", text: "友達や家族と一緒に盛り上がれるゲームが欲しい..." },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm font-medium" style={{ color: "rgba(255,200,150,0.85)" }}>{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl p-4 text-center"
          style={{ background: "linear-gradient(135deg, rgba(255,107,43,0.3), rgba(220,38,38,0.2))", border: "1px solid rgba(255,107,43,0.4)" }}>
          <p className="font-bold text-sm mb-1" style={{ color: "#ff6b2b" }}>ダルマ落としPHYSICSが解決します</p>
          <p className="text-xs" style={{ color: "rgba(255,180,120,0.8)" }}>ブラウザでスグ遊べる本格物理パズル。老若男女みんなで楽しめる！</p>
        </div>
      </section>

      {/* 競合比較表 */}
      <section className="w-full max-w-sm px-4 pb-10">
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,107,43,0.3)" }}>
          <div className="px-4 py-3 text-center" style={{ background: "rgba(220,38,38,0.2)" }}>
            <h2 className="text-sm font-black" style={{ color: "#ff6b2b" }}>他のブラウザゲームと比べてみた</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,180,120,0.7)" }}>ダルマ落としPHYSICSが選ばれる理由</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "rgba(153,27,27,0.8)" }}>
                  <th className="px-3 py-2.5 text-left font-bold" style={{ color: "#fca5a5" }}>機能</th>
                  <th className="px-3 py-2.5 text-center font-bold" style={{ color: "#fbbf24" }}>ダルマ落とし<br/>PHYSICS</th>
                  <th className="px-3 py-2.5 text-center font-semibold" style={{ color: "rgba(252,165,165,0.6)" }}>一般的な<br/>パズルゲーム</th>
                  <th className="px-3 py-2.5 text-center font-semibold" style={{ color: "rgba(252,165,165,0.6)" }}>アプリゲーム</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "インストール不要", us: "✅ ブラウザのみ", a: "⚠️ 一部", b: "❌ DL必須" },
                  { feature: "本格物理演算", us: "✅ Matter.js", a: "❌ 簡易のみ", b: "⚠️ まちまち" },
                  { feature: "段位・称号制", us: "✅ 7段位", a: "❌ なし", b: "⚠️ レベル制" },
                  { feature: "友達挑戦状", us: "✅ URLシェア", a: "❌ なし", b: "⚠️ 要アカウント" },
                  { feature: "デイリー更新", us: "✅ 毎日目標", a: "❌ なし", b: "⚠️ 一部" },
                  { feature: "完全無料", us: "✅ 無料プレイ", a: "⚠️ 広告多い", b: "❌ 課金前提" },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(68,64,60,0.5)" : "rgba(68,64,60,0.3)", borderBottom: "1px solid rgba(255,107,43,0.1)" }}>
                    <td className="px-3 py-2.5 font-semibold" style={{ color: "#e7e5e4" }}>{row.feature}</td>
                    <td className="px-3 py-2.5 text-center font-bold" style={{ color: "#fbbf24" }}>{row.us}</td>
                    <td className="px-3 py-2.5 text-center" style={{ color: "rgba(252,165,165,0.6)" }}>{row.a}</td>
                    <td className="px-3 py-2.5 text-center" style={{ color: "rgba(252,165,165,0.6)" }}>{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-center" style={{ background: "rgba(220,38,38,0.12)" }}>
            <p className="text-xs mb-2" style={{ color: "rgba(252,165,165,0.7)" }}>※ 2026年3月調査。各サービスの内容は変更になる場合があります</p>
            <Link href="/game" className="inline-block font-black py-2 px-6 rounded-xl text-xs active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
              無料でプレイする →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-sm px-4 pb-8">
        <h2 className="text-center text-base font-bold mb-4" style={{ color: "rgba(255,150,100,0.8)" }}>よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "どうやって遊ぶの？", a: "横から木槌を叩いてダルマを落とします。一番上のダルマを落とさずに下を全部消すのが目標！難易度が上がるほど積み重なります。" },
            { q: "何段まで積めますか？", a: "ゲームが進むと最大10段まで積み重なります。物理演算により毎回違う挙動になるので何度でも楽しめます。" },
            { q: "スコアは記録されますか？", a: "ハイスコアはブラウザに自動保存されます。友達との対戦記録はXでシェアできます。" },
            { q: "スマホでも遊べますか？", a: "スマホ・タブレット・PCすべてに対応しています。タップ操作でも快適に遊べます。" },
            { q: "難易度は選べますか？", a: "かんたん・ふつう・むずかしいの3段階から選べます。重力・摩擦・滑りやすさが変わるので初心者から上級者まで楽しめます。" },
          ].map((faq, i) => (
            <div key={i} style={{ background: "rgba(255,80,0,0.08)", border: "1px solid rgba(255,80,0,0.2)", borderRadius: "12px", padding: "12px 14px" }}>
              <p style={{ color: "rgba(255,150,100,0.9)", fontWeight: "600", fontSize: "12px", marginBottom: "5px" }}>Q. {faq.q}</p>
              <p style={{ color: "rgba(255,120,70,0.6)", fontSize: "11px" }}>A. {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BASE A8.netアフィリエイト */}
      <section className="w-full max-w-sm px-4 pb-8">
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,107,43,0.07)", border: "1px solid rgba(255,107,43,0.2)" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "#ffb899" }}>🛍️ ゲームが好きなら、グッズ販売も。</p>
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8ZAE9E+2QQG+62MDD"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-between rounded-xl px-4 py-3 transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,107,43,0.3)" }}
          >
            <div>
              <div className="text-sm font-bold" style={{ color: "#fff" }}>BASE — 無料でネットショップ開業</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,180,120,0.7)" }}>¥400 • ゲームグッズ・オリジナル商品を販売しよう</div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full shrink-0 ml-2"
              style={{ background: "rgba(255,107,43,0.3)", color: "#ff6b2b" }}>無料開業 →</span>
          </a>
          <p className="text-xs text-center mt-2" style={{ color: "rgba(255,100,50,0.35)" }}>※ 広告・PR（外部サービスサイトに遷移します）</p>
        </div>
      </section>

      {/* もっと楽しむ3選 */}
      <section className="w-full max-w-sm px-4 pb-8">
        <h2 className="text-center font-black text-sm mb-4 tracking-widest" style={{ color: "rgba(255,150,100,0.7)" }}>
          もっと楽しむ3選
        </h2>
        <ol className="space-y-3">
          {[
            { icon: "⚔️", title: "叩き師ランクを全制覇", desc: "見習い→叩き師→名人の3段階ランク。10段に挑戦して伝説の叩き師を目指せ！" },
            { icon: "🏆", title: "友達と最高段位を競争", desc: "ゲームオーバー後にXでスコアシェアして誰が名人になれるか競争しよう。" },
            { icon: "🎯", title: "物理演算パズルを極める", desc: "毎回違う挙動が楽しい。木槌の角度・力加減で無限のパターンを体験！" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3" style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)", borderRadius: "12px", padding: "12px 14px" }}>
              <span style={{ fontSize: "22px", lineHeight: "1" }}>{item.icon}</span>
              <div>
                <div style={{ color: "#ff6b2b", fontWeight: "700", fontSize: "13px" }}>{i + 1}. {item.title}</div>
                <div style={{ color: "rgba(255,150,80,0.7)", fontSize: "12px", marginTop: "2px" }}>{item.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-2 text-center text-xs pb-6" style={{ color: "rgba(255,100,50,0.4)" }}>
        <p>© 2026 ポッコリラボ</p>
        <div className="flex justify-center gap-4 mt-1">
          <a href="/legal" className="underline hover:opacity-70">特定商取引法</a>
          <a href="/privacy" className="underline hover:opacity-70">プライバシーポリシー</a>
          <a href="/terms" className="underline hover:opacity-70">利用規約</a>
        </div>
        <p className="mt-1">
          <a href="https://twitter.com/levona_design" className="underline hover:opacity-70">お問い合わせ: X @levona_design</a>
        </p>
      </footer>
    </div>
  );
}
