import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center"
      style={{ background: "linear-gradient(160deg, #1a0005, #3b0010, #1a0a00)" }}>

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
        <p className="text-sm mb-8" style={{ color: "rgba(255,165,130,0.7)" }}>
          本格物理演算で毎回違う崩れ方 — 誰でも1分でルールを理解できる
        </p>

        <Link href="/game"
          className="group relative inline-block px-16 py-5 rounded-2xl text-2xl font-black transition-all active:scale-95 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #ff6b2b, #dc2626, #991b1b)",
            color: "#fff",
            boxShadow: "0 0 50px rgba(255,80,0,0.6), 0 0 100px rgba(220,38,38,0.3), 0 8px 32px rgba(0,0,0,0.4)",
          }}>
          <span className="relative z-10">今すぐプレイ ⚡</span>
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15), transparent)" }} />
        </Link>
        <p className="mt-3 text-xs" style={{ color: "rgba(255,150,100,0.6)" }}>
          インストール不要 • ブラウザで今すぐ遊べる
        </p>
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

      {/* Premium Section */}
      <section className="w-full max-w-sm px-4 pb-10">
        <div className="rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(220,38,38,0.1))", border: "1px solid rgba(124,58,237,0.3)" }}>
          <div className="text-center mb-3">
            <span className="text-2xl">👑</span>
            <h2 className="text-base font-black mt-1" style={{ color: "#c4b5fd" }}>プレミアムプラン</h2>
            <p className="text-2xl font-black mt-1" style={{ color: "#fff" }}>¥300<span className="text-sm font-normal" style={{ color: "#a78bfa" }}>/月</span></p>
          </div>
          <ul className="space-y-1.5 text-sm mb-4">
            {["無制限プレイ（無料は1日3回）", "エンドレスモードのベスト記録保存", "新レベル優先解放"].map(f => (
              <li key={f} className="flex items-center gap-2" style={{ color: "#ddd6fe" }}>
                <span style={{ color: "#a78bfa" }}>✓</span>{f}
              </li>
            ))}
          </ul>
          <p className="text-center text-xs" style={{ color: "rgba(167,139,250,0.6)" }}>
            ※ プレミアムプランは準備中です。近日公開予定！
          </p>
        </div>
      </section>

      {/* SNS Share */}
      <section className="w-full max-w-sm px-4 pb-10">
        <div className="rounded-2xl p-4 text-center"
          style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
          <p className="font-bold text-sm mb-2" style={{ color: "#ffb899" }}>🎎 記録をXでシェアしよう</p>
          <p className="text-xs mb-3" style={{ color: "rgba(255,180,120,0.65)" }}>
            クリア後にワンタップで投稿できます。友達と最高段数を競おう！
          </p>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("ダルマ落としPHYSICSにハマってる🎎 本格物理演算でリアルな崩れ方が最高！ → https://daruma-physics.vercel.app #ダルマ落とし #物理パズル")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: "#000" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Xで紹介する
          </a>
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

      <footer className="mt-2 text-center text-xs pb-6" style={{ color: "rgba(255,100,50,0.4)" }}>
        <p>© 2026 ポッコリラボ</p>
        <p className="mt-1">
          <a href="https://twitter.com/levona_design" className="underline hover:opacity-70">お問い合わせ: X @levona_design</a>
        </p>
      </footer>
    </div>
  );
}
