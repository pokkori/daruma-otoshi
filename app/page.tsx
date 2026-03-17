import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #1a0a00, #2d1500, #1a0a00)" }}>
      <div className="text-center mb-8">
        <img src="/images/daruma_stack.png" alt="ダルマ" className="w-28 h-28 mx-auto mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(255,100,0,0.6))" }} />
        <h1 className="text-4xl font-black mb-3"
          style={{ color: "#ff6b2b", textShadow: "0 0 20px rgba(255,107,43,0.5)" }}>
          ダルマ落とし
        </h1>
        <p className="text-amber-200 text-lg font-bold mb-1">PHYSICS</p>
        <p className="text-amber-600 text-sm">だるまタワーを崩さずに下から叩け！</p>
      </div>

      <Link href="/game"
        className="inline-block px-14 py-4 rounded-2xl text-xl font-black mb-10 transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #ff6b2b, #dc2626)",
          color: "#fff",
          boxShadow: "0 0 30px rgba(255,107,43,0.4)",
        }}>
        プレイ ⚡
      </Link>

      <div className="w-full max-w-sm space-y-3">
        {[
          { icon: "👇", title: "下のだるまをスワイプ", desc: "横にスワイプで力をかける方向と強さを決める" },
          { icon: "⚡", title: "素早く叩き抜く", desc: "ゆっくりだと上のだるまが崩れる。スピードが命" },
          { icon: "🏆", title: "全部抜けばクリア", desc: "積み上がったすべてのだるまを叩き抜け" },
          { icon: "💥", title: "崩れたら失敗", desc: "タワーが倒れたらゲームオーバー。物理演算で毎回違う崩れ方" },
        ].map((item, i) => (
          <div key={i} className="flex gap-3 items-center p-3 rounded-xl"
            style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.2)" }}>
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="font-bold text-amber-200 text-sm">{item.title}</div>
              <div className="text-xs text-amber-600">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <footer className="mt-10 text-center text-xs text-amber-900 pb-6">
        <p>© 2026 ポッコリラボ</p>
        <p className="mt-1">
          <a href="https://twitter.com/levona_design" className="underline hover:text-amber-700">お問い合わせ: X @levona_design</a>
        </p>
      </footer>
    </div>
  );
}
