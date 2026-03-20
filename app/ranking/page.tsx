"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type RankEntry = { stage: number; mode: "normal" | "endless"; date: string; name?: string };

const RANKING_KEY = "daruma_ranking";
const PLAYER_NAME_KEY = "daruma_player_name";

const DAN_RANKS = [
  { name: "見習い叩き師", emoji: "🥋", color: "#94a3b8", minStage: 0 },
  { name: "初段", emoji: "⚡", color: "#f97316", minStage: 1 },
  { name: "二段", emoji: "🔥", color: "#ef4444", minStage: 3 },
  { name: "三段", emoji: "💥", color: "#a855f7", minStage: 6 },
  { name: "四段", emoji: "🌟", color: "#f59e0b", minStage: 10 },
  { name: "師範代", emoji: "🏆", color: "#d97706", minStage: 15 },
  { name: "師範", emoji: "👑", color: "#fbbf24", minStage: 21 },
];

function getDanRank(stage: number) {
  for (let i = DAN_RANKS.length - 1; i >= 0; i--) {
    if (stage >= DAN_RANKS[i].minStage) return DAN_RANKS[i];
  }
  return DAN_RANKS[0];
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [inputName, setInputName] = useState("");
  const [bestEndlessStage, setBestEndlessStage] = useState(0);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RANKING_KEY) ?? "[]") ?? [];
      const name = localStorage.getItem(PLAYER_NAME_KEY) ?? "";
      const best = parseInt(localStorage.getItem("daruma_endless_best") ?? "0") || 0;
      setRanking(stored);
      setPlayerName(name);
      setInputName(name);
      setBestEndlessStage(best);
    } catch { /* noop */ }
  }, []);

  const saveName = () => {
    const trimmed = inputName.trim().slice(0, 12);
    if (!trimmed) return;
    setPlayerName(trimmed);
    try { localStorage.setItem(PLAYER_NAME_KEY, trimmed); } catch { /* noop */ }
    setEditingName(false);
  };

  const danRank = getDanRank(bestEndlessStage);

  const siteUrl = "https://daruma-otoshi.vercel.app";
  const shareText = `🎎 ダルマ落としPHYSICS【${danRank.name} ${danRank.emoji}】\n最高エンドレス${bestEndlessStage + 9}段タワー達成！\nあなたも挑戦して → ${siteUrl}\n#ダルマ落とし #物理パズル #${danRank.name}`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="min-h-dvh px-4 py-6"
      style={{ background: "linear-gradient(160deg, #1a0005, #3b0010, #1a0a00)" }}>
      <div className="max-w-sm mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-amber-500 text-sm">&larr; トップ</Link>
          <h1 className="text-xl font-black" style={{ color: "#fff" }}>🏆 ランキング</h1>
        </div>

        {/* 自分の段位カード */}
        <div className="rounded-2xl p-5 mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(255,107,43,0.1))",
            border: `2px solid ${danRank.color}44`,
          }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,150,100,0.7)" }}>あなたの段位</span>
            {editingName ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={inputName}
                  onChange={e => setInputName(e.target.value)}
                  maxLength={12}
                  placeholder="名前を入力"
                  className="text-xs px-2 py-1 rounded-lg border w-28 text-center"
                  style={{ background: "rgba(0,0,0,0.3)", color: "#fff", borderColor: "rgba(255,107,43,0.5)" }}
                  onKeyDown={e => e.key === "Enter" && saveName()}
                />
                <button onClick={saveName}
                  className="text-xs px-2 py-1 rounded-lg font-bold"
                  style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
                  保存
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: "#ffb899" }}>
                  {playerName || "名無し叩き師"}
                </span>
                <button onClick={() => setEditingName(true)}
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{ background: "rgba(255,107,43,0.2)", color: "#ff6b2b" }}>
                  変更
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{danRank.emoji}</span>
            <div>
              <div className="text-2xl font-black" style={{ color: danRank.color }}>{danRank.name}</div>
              {bestEndlessStage > 0 ? (
                <div className="text-sm" style={{ color: "rgba(255,180,120,0.7)" }}>
                  最高エンドレス {9 + bestEndlessStage}段タワー
                </div>
              ) : (
                <div className="text-sm" style={{ color: "rgba(255,150,100,0.5)" }}>
                  エンドレスモードをプレイしよう
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <a href={shareUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{ background: "#000", color: "#fff" }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              {danRank.name}をXで自慢する {danRank.emoji}
            </a>
            <Link href="/game"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
              ゲームに戻る ⚡
            </Link>
          </div>
        </div>

        {/* ローカルランキング */}
        <div className="rounded-2xl p-5 mb-6"
          style={{ background: "rgba(255,107,43,0.07)", border: "1px solid rgba(255,107,43,0.25)" }}>
          <h2 className="text-base font-black mb-4" style={{ color: "#fca5a5" }}>
            📊 このブラウザのプレイ記録 TOP10
          </h2>
          {ranking.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-sm font-bold" style={{ color: "rgba(255,150,100,0.7)" }}>まだ記録がありません</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,120,70,0.5)" }}>ゲームを終了するとここに記録されます</p>
              <Link href="/game"
                className="inline-block mt-4 px-6 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff" }}>
                プレイしてランキングに載る →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {ranking.map((entry, i) => {
                const dr = getDanRank(entry.stage);
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{
                      background: i === 0 ? "rgba(251,191,36,0.12)" : "rgba(255,107,43,0.07)",
                      border: i === 0 ? "1px solid rgba(251,191,36,0.35)" : "1px solid rgba(255,107,43,0.2)",
                    }}>
                    <span className="text-lg w-6 text-center flex-shrink-0">
                      {i < 3 ? medals[i] : `${i + 1}`}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black" style={{ color: "#fff" }}>
                          {entry.mode === "endless" ? `エンドレス ${entry.stage + 9}段` : `通常 Lv.${entry.stage + 1}`}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(255,107,43,0.2)", color: dr.color }}>
                          {dr.emoji}{dr.name}
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: "rgba(255,150,100,0.5)" }}>{entry.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 全段位一覧 */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,107,43,0.07)", border: "1px solid rgba(255,107,43,0.2)" }}>
          <h2 className="text-base font-black mb-4" style={{ color: "#fca5a5" }}>
            🥋 全7段位一覧
          </h2>
          <div className="space-y-2">
            {DAN_RANKS.map((r) => {
              const achieved = bestEndlessStage >= r.minStage;
              return (
                <div key={r.name}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{
                    background: achieved ? "rgba(255,107,43,0.1)" : "rgba(255,107,43,0.04)",
                    border: `1px solid ${achieved ? r.color + "44" : "rgba(255,107,43,0.15)"}`,
                    opacity: achieved ? 1 : 0.6,
                  }}>
                  <span className="text-xl">{achieved ? r.emoji : "🔒"}</span>
                  <div className="flex-1">
                    <div className="font-black text-sm" style={{ color: achieved ? r.color : "rgba(255,150,100,0.4)" }}>
                      {r.name}
                    </div>
                    <div className="text-xs" style={{ color: "rgba(255,150,100,0.5)" }}>
                      {r.minStage === 0 ? "初回プレイで取得" : `エンドレス${r.minStage}段以上`}
                    </div>
                  </div>
                  {achieved && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: r.color + "22", color: r.color, border: `1px solid ${r.color}44` }}>
                      取得済み
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
