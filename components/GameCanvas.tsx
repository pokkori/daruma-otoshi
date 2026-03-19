"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { usePhysicsGame } from "@/hooks/usePhysicsGame";
import { LEVELS } from "@/lib/levels";
import { useGameSounds } from "@/hooks/useGameSounds";

// ─── 段位認定 ──────────────────────────────────────────────────────────────
type DanRank = { name: string; nameEn: string; emoji: string; color: string; minStage: number };
const DAN_RANKS: DanRank[] = [
  { name: "見習い叩き師", nameEn: "Apprentice", emoji: "🥋", color: "#94a3b8", minStage: 0 },
  { name: "初段", nameEn: "1st Dan", emoji: "⚡", color: "#f97316", minStage: 1 },
  { name: "二段", nameEn: "2nd Dan", emoji: "🔥", color: "#ef4444", minStage: 3 },
  { name: "三段", nameEn: "3rd Dan", emoji: "💥", color: "#a855f7", minStage: 6 },
  { name: "四段", nameEn: "4th Dan", emoji: "🌟", color: "#f59e0b", minStage: 10 },
  { name: "師範代", nameEn: "Senior", emoji: "🏆", color: "#d97706", minStage: 15 },
  { name: "師範", nameEn: "Master", emoji: "👑", color: "#fbbf24", minStage: 21 },
];
function getDanRank(bestEndlessStage: number): DanRank {
  for (let i = DAN_RANKS.length - 1; i >= 0; i--) {
    if (bestEndlessStage >= DAN_RANKS[i].minStage) return DAN_RANKS[i];
  }
  return DAN_RANKS[0];
}

// ─── デイリーチャレンジ ─────────────────────────────────────────────────────
type DailyChallenge = { target: number; label: string; key: string };
function getDailyChallenge(): DailyChallenge {
  const d = new Date();
  const dayKey = d.toISOString().slice(0, 10);
  const targets = [3, 4, 5, 3, 6, 4, 5, 3, 4, 6, 5, 3, 4, 5, 6, 3, 4, 5, 3, 4, 6, 5, 3, 5, 4, 6, 3, 4, 5, 6, 3];
  const target = targets[d.getDate() % targets.length];
  return { target, label: `エンドレス${target}段クリア`, key: dayKey };
}
function isDailyChallengeCleared(): boolean {
  try {
    const { key } = getDailyChallenge();
    return localStorage.getItem(`daruma_daily_${key}`) === "1";
  } catch { return false; }
}
function markDailyChallengeCleared(): void {
  try {
    const { key } = getDailyChallenge();
    localStorage.setItem(`daruma_daily_${key}`, "1");
  } catch { /* ignore */ }
}

// ─── ローカルランキング ──────────────────────────────────────────────────────
type RankEntry = { stage: number; mode: "normal" | "endless"; date: string };
const RANKING_KEY = "daruma_ranking";
const RANKING_MAX = 10;

function loadRanking(): RankEntry[] {
  try {
    return JSON.parse(localStorage.getItem(RANKING_KEY) ?? "[]") ?? [];
  } catch { return []; }
}

function saveRanking(entry: RankEntry): RankEntry[] {
  const current = loadRanking();
  const next = [entry, ...current]
    .sort((a, b) => b.stage - a.stage)
    .slice(0, RANKING_MAX);
  try { localStorage.setItem(RANKING_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  return next;
}

// ─── ストリーク ─────────────────────────────────────────────────────────────

function getDarumaStreakData(): { streak: number; lastDate: string } {
  try {
    return JSON.parse(localStorage.getItem("daruma_streak") ?? "{}") ?? { streak: 0, lastDate: "" };
  } catch { return { streak: 0, lastDate: "" }; }
}

function updateDarumaStreak(): { streak: number; isNew: boolean } {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const data = getDarumaStreakData();
  if (data.lastDate === today) return { streak: data.streak, isNew: false };
  const newStreak = data.lastDate === yesterday ? data.streak + 1 : 1;
  localStorage.setItem("daruma_streak", JSON.stringify({ streak: newStreak, lastDate: today }));
  return { streak: newStreak, isNew: true };
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [failed, setFailed] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [endlessMode, setEndlessMode] = useState(false);
  const [endlessStage, setEndlessStage] = useState(0);
  const [bestEndlessStage, setBestEndlessStage] = useState(0);
  const [darumaStreak, setDarumaStreak] = useState(0);
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [dailyChallenge] = useState<DailyChallenge>(getDailyChallenge);
  const [dailyChallengeCleared, setDailyChallengeCleared] = useState(false);
  const [ranking, setRanking] = useState<RankEntry[]>([]);

  // In endless mode, daruma count = 9 + endlessStage
  const isEndless = endlessMode;
  const currentDarumaCount = isEndless
    ? 9 + endlessStage
    : LEVELS[levelIndex].darumas;

  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)];
  const { playKnock, playClear, playFail } = useGameSounds();

  useEffect(() => {
    const bs = localStorage.getItem("daruma_best");
    if (bs) setBestScore(parseInt(bs));
    const bes = localStorage.getItem("daruma_endless_best");
    if (bes) setBestEndlessStage(parseInt(bes));
    // ストリーク更新
    const { streak, isNew } = updateDarumaStreak();
    setDarumaStreak(streak);
    if (isNew && streak >= 2) {
      setShowStreakBanner(true);
      setTimeout(() => setShowStreakBanner(false), 3000);
    }
    // デイリーチャレンジ状態
    setDailyChallengeCleared(isDailyChallengeCleared());
    // ランキング読み込み
    setRanking(loadRanking());
  }, []);

  const handleClear = useCallback(() => {
    playClear();
    setCleared(true);
    const newScore = score + currentDarumaCount * 100;
    setScore(newScore);
    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem("daruma_best", String(newScore));
    }
    if (isEndless) {
      const reachedStage = endlessStage + 1;
      if (reachedStage > bestEndlessStage) {
        setBestEndlessStage(reachedStage);
        localStorage.setItem("daruma_endless_best", String(reachedStage));
      }
      // デイリーチャレンジ達成チェック
      if (!isDailyChallengeCleared() && reachedStage >= dailyChallenge.target) {
        markDailyChallengeCleared();
        setDailyChallengeCleared(true);
      }
    }
  }, [score, currentDarumaCount, bestScore, isEndless, endlessStage, bestEndlessStage, dailyChallenge.target]);

  const handleFail = useCallback(() => {
    playFail();
    setFailed(true);
    // ランキング保存
    const today = new Date().toISOString().slice(0, 10);
    const stage = isEndless ? endlessStage : levelIndex;
    const entry: RankEntry = { stage, mode: isEndless ? "endless" : "normal", date: today };
    setRanking(saveRanking(entry));
  }, [playFail, isEndless, endlessStage, levelIndex]);

  const { phase, removedCount, swipeFeedback, initGame, onTouchStart, onTouchEnd, onMouseDown, onMouseUp } =
    usePhysicsGame({
      canvasRef,
      darumaCount: currentDarumaCount,
      onClear: handleClear,
      onFail: handleFail,
    });

  const prevRemovedRef = useRef(0);
  useEffect(() => {
    if (removedCount > prevRemovedRef.current) {
      playKnock();
      prevRemovedRef.current = removedCount;
    }
  }, [removedCount, playKnock]);

  // Re-init game when level or endless stage changes
  const gameKey = isEndless ? `endless_${endlessStage}` : `level_${levelIndex}`;
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    setCleared(false);
    setFailed(false);
    prevRemovedRef.current = 0;
    initGame().then((c) => { cleanup = c; });
    return () => { cleanup?.(); };
  }, [gameKey]);

  const handleNext = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex((i) => i + 1);
    }
  };

  const handleEnterEndless = () => {
    setEndlessMode(true);
    setEndlessStage(0);
    setCleared(false);
    setFailed(false);
  };

  const handleEndlessNext = () => {
    setEndlessStage((s) => s + 1);
    setCleared(false);
    setFailed(false);
  };

  const handleRetry = () => {
    setCleared(false);
    setFailed(false);
    initGame();
  };

  const handleRetryFromStart = () => {
    setEndlessMode(false);
    setEndlessStage(0);
    setLevelIndex(0);
    setScore(0);
    setCleared(false);
    setFailed(false);
  };

  // Share text
  const siteUrl = "https://daruma-otoshi.vercel.app";
  const danRank = getDanRank(bestEndlessStage);

  // 挑戦状URL生成（友達がこのURLを開くとスコアとランクが表示される）
  const challengeUrl = `${siteUrl}/game?challenge_score=${score}&challenge_rank=${encodeURIComponent(danRank.name)}`;
  const challengeShareText = isEndless
    ? `🎎 ${danRank.name} ${danRank.emoji} のオレに勝てるか？\nダルマ落としPHYSICS エンドレス${currentDarumaCount}段・スコア${score}点\n挑戦受付中👇\n#ダルマ落とし #物理パズル`
    : `🎎 ${danRank.name} ${danRank.emoji} のオレのスコア${score}点に勝てるか？\nダルマ落としPHYSICS\n挑戦受付中👇\n#ダルマ落とし #物理パズル`;
  const challengeShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(challengeShareText)}&url=${encodeURIComponent(challengeUrl)}`;

  // エンドレスモード時: 段位認定証OGP画像URLを生成
  const ogImageUrl = isEndless
    ? `${siteUrl}/api/og?rank=${encodeURIComponent(danRank.name)}&emoji=${encodeURIComponent(danRank.emoji)}&stage=${encodeURIComponent(String(9 + bestEndlessStage))}&color=${encodeURIComponent(danRank.color)}`
    : null;

  const shareText = isEndless
    ? `🎎 ダルマ落としPHYSICS【${danRank.name} ${danRank.emoji}】エンドレスモード ${currentDarumaCount}段タワー攻略！\nスコア: ${score}点 / 最高: ${9 + bestEndlessStage}段\n#ダルマ落とし #物理パズル #${danRank.name}`
    : `🎎 ダルマ落としPHYSICSで${level.name}レベルクリア！\nスコア: ${score}点\n段位: ${danRank.name} ${danRank.emoji}\n#ダルマ落とし #物理パズル\n${siteUrl}`;

  // エンドレスモード時はOGP画像URLをurlパラメータとして渡す（Twitter Cardに表示）
  const shareUrl = isEndless && ogImageUrl
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(ogImageUrl)}`
    : `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  // Display name
  const displayName = isEndless
    ? `${currentDarumaCount}段タワー`
    : `Lv.${level.id} ${level.name}`;

  // Swipe feedback styling
  const feedbackColor = swipeFeedback
    ? swipeFeedback.strength === "weak" ? "#60a5fa"
      : swipeFeedback.strength === "medium" ? "#fbbf24"
      : "#ef4444"
    : "";

  return (
    <div className="flex flex-col items-center min-h-dvh py-2 px-2"
      style={{ background: "linear-gradient(160deg, #1a0a00, #2d1500)" }}>

      {/* ストリークバナー */}
      {showStreakBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-6 py-3 rounded-2xl font-black text-lg shadow-2xl animate-bounce"
            style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff", boxShadow: "0 0 30px rgba(255,107,43,0.7)" }}>
            🎎 {darumaStreak}日連続！叩き師の証！
          </div>
        </div>
      )}

      <div className="w-full max-w-sm flex items-center justify-between mb-2">
        <a href="/" className="text-amber-500 text-sm">&larr; トップ</a>
        <span className="font-black text-lg" style={{ color: "#ff6b2b" }}>
          {isEndless ? "🔥" : "🎎"} {displayName}
          {darumaStreak >= 2 && <span className="text-xs ml-1 text-amber-400">🔥{darumaStreak}日</span>}
        </span>
        <span className="text-xs text-amber-600">
          Best: {bestScore}
        </span>
      </div>

      {/* デイリーチャレンジバナー */}
      <div className="w-full max-w-sm mb-2">
        <div className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
          dailyChallengeCleared
            ? "border-2 border-amber-400"
            : "border border-orange-700/50"
          }`}
          style={{
            background: dailyChallengeCleared
              ? "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(180,83,9,0.2))"
              : "rgba(120,53,15,0.4)",
            boxShadow: dailyChallengeCleared ? "0 0 12px rgba(245,158,11,0.4)" : "none",
          }}>
          <span>{dailyChallengeCleared ? "✅" : "🎯"} 今日のチャレンジ: {dailyChallenge.label}</span>
          {dailyChallengeCleared ? (
            <span className="text-amber-300 font-black animate-pulse">達成！🎉</span>
          ) : (
            <span className="text-orange-400">挑戦中</span>
          )}
        </div>
      </div>

      {isEndless && (
        <div className="w-full max-w-sm text-center mb-1">
          <span className="text-xs text-amber-400 font-bold">
            エンドレスモード | 最高記録: {9 + bestEndlessStage}段
          </span>
        </div>
      )}

      <div className="w-full max-w-sm flex gap-1 mb-2">
        {Array.from({ length: currentDarumaCount }).map((_, i) => (
          <div key={i} className="flex-1 h-2 rounded-full"
            style={{
              background: i < removedCount ? "#ff6b2b" : "rgba(255,107,43,0.2)",
              transition: "background 0.3s",
            }} />
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        <canvas
          ref={canvasRef}
          width={360}
          height={580}
          className="w-full rounded-2xl"
          style={{ touchAction: "none", cursor: "crosshair", maxHeight: "70dvh", objectFit: "contain" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />

        {/* Swipe visual feedback overlay */}
        {swipeFeedback && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center"
            style={{ zIndex: 10 }}>
            <div className="text-6xl font-black animate-ping"
              style={{
                color: feedbackColor,
                position: "absolute",
                top: "45%",
                left: swipeFeedback.direction === "left" ? "15%" : "65%",
                textShadow: `0 0 20px ${feedbackColor}`,
                opacity: 0.9,
              }}>
              {swipeFeedback.direction === "left" ? "←" : "→"}
            </div>
            <div className="absolute bottom-24 text-sm font-bold px-3 py-1 rounded-full"
              style={{
                background: feedbackColor,
                color: "#fff",
                opacity: 0.85,
              }}>
              {swipeFeedback.strength === "weak" ? "弱" : swipeFeedback.strength === "medium" ? "中" : "強"}
            </div>
          </div>
        )}

        {cleared && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bounce-in"
            style={{ background: "rgba(0,0,0,0.82)" }}>
            {/* GIF感クリア演出 */}
            <div className="text-6xl mb-2 animate-bounce">{isEndless ? "🔥" : "🎎"}</div>
            <div className="text-4xl font-black mb-1"
              style={{ color: "#ff6b2b", textShadow: "0 0 30px rgba(255,107,43,0.9)" }}>
              {isEndless ? `${currentDarumaCount}段クリア！` : "クリア！"}
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: "#fbbf24" }}>
              +{currentDarumaCount * 100}点
            </div>
            <div className="mb-3 px-4 py-1 rounded-full text-xs font-bold"
              style={{ background: "rgba(255,107,43,0.2)", color: "#ffb899" }}>
              {isEndless ? `合計スコア: ${score + currentDarumaCount * 100}点` : `スコア: ${score + currentDarumaCount * 100}点`}
            </div>

            {isEndless && (
              <div className="text-amber-400 text-sm mb-3 font-bold animate-pulse">
                次: {currentDarumaCount + 1}段タワーに挑戦！ 🔥
              </div>
            )}

            {/* 段位バッジ */}
            <div className="mb-3 px-5 py-2 rounded-full font-black text-sm flex items-center gap-2"
              style={{ background: "rgba(0,0,0,0.5)", border: `2px solid ${danRank.color}`, color: danRank.color, boxShadow: `0 0 15px ${danRank.color}40` }}>
              <span>{danRank.emoji}</span>
              <span>{danRank.name}</span>
              <span className="text-xs opacity-70">/ {danRank.nameEn}</span>
            </div>

            <div className="space-y-2 w-52">
              {isEndless ? (
                <button onClick={handleEndlessNext}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", boxShadow: "0 0 20px rgba(255,107,43,0.5)" }}>
                  次の段へ 🔥
                </button>
              ) : levelIndex < LEVELS.length - 1 ? (
                <button onClick={handleNext}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)" }}>
                  次のレベルへ &rarr;
                </button>
              ) : (
                <button onClick={handleEnterEndless}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95 animate-pulse"
                  style={{ background: "linear-gradient(135deg, #ff6b2b, #7c3aed)", boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}>
                  🔥 エンドレスモード突入！
                </button>
              )}
              {/* 挑戦状ボタン */}
              <a href={challengeShareUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff", boxShadow: "0 0 12px rgba(124,58,237,0.5)" }}>
                ⚔️ 友達に挑戦状を送る
              </a>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ background: "#000", color: "#fff" }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                {isEndless ? `${currentDarumaCount}段達成をシェア 🎯` : "クリアをXでシェア"}
              </a>
            </div>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl shake"
            style={{ background: "rgba(0,0,0,0.88)" }}>
            {/* GIF感スコア演出 */}
            <div className="relative mb-4 text-center">
              <div className="text-6xl mb-1 animate-bounce">💥</div>
              <div className="text-4xl font-black animate-pulse"
                style={{ color: "#ff6b2b", textShadow: "0 0 20px rgba(255,107,43,0.8)" }}>
                {isEndless ? `${currentDarumaCount - 1}段` : `スコア ${score}`}
              </div>
              <div className="text-xl font-black mt-1" style={{ color: "#fca5a5" }}>
                {isEndless ? "段積み達成！" : "点獲得！"}
              </div>
              {isEndless && (
                <div className="mt-2 px-4 py-1.5 rounded-full text-xs font-bold inline-block"
                  style={{ background: "rgba(255,107,43,0.2)", color: "#ffb899", border: "1px solid rgba(255,107,43,0.4)" }}>
                  最高記録: {9 + bestEndlessStage}段タワー
                </div>
              )}
            </div>
            <div className="text-amber-500 text-sm mb-2">タワーが倒れました</div>
            {/* 段位バッジ */}
            <div className="mb-4 px-5 py-2 rounded-full font-black text-sm flex items-center gap-2"
              style={{ background: "rgba(0,0,0,0.5)", border: `2px solid ${danRank.color}`, color: danRank.color, boxShadow: `0 0 15px ${danRank.color}40` }}>
              <span>{danRank.emoji}</span>
              <span>現在: {danRank.name}</span>
              {danRank.minStage < DAN_RANKS[DAN_RANKS.length - 1].minStage && (
                <span className="text-xs opacity-60">次段まであと{(DAN_RANKS[Math.min(DAN_RANKS.findIndex(d => d.name === danRank.name) + 1, DAN_RANKS.length - 1)].minStage - bestEndlessStage)}段</span>
              )}
            </div>
            {/* 🏆 ハイスコアTOP5 */}
            {(() => {
              const modeKey: "endless" | "normal" = isEndless ? "endless" : "normal";
              const modeLabel = isEndless ? "エンドレス" : "通常";
              const top5 = ranking.filter(r => r.mode === modeKey).slice(0, 5);
              if (top5.length === 0) return null;
              return (
                <div className="w-52 mb-3 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(251,191,36,0.4)", background: "rgba(0,0,0,0.5)" }}>
                  <div className="px-3 py-1.5 text-xs font-black flex items-center gap-1" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                    🏆 ハイスコアTOP5（{modeLabel}）
                  </div>
                  {top5.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1 text-xs" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <span style={{ color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#d97706" : "#6b7280", fontWeight: "bold" }}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                      </span>
                      <span className="font-bold" style={{ color: "#fde68a" }}>
                        {isEndless ? `${r.stage}段` : `Lv.${r.stage + 1}`}
                      </span>
                      <span style={{ color: "#6b7280" }}>{r.date}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
            <div className="space-y-2 w-52">
              {/* 挑戦状ボタン */}
              <a href={challengeShareUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff", boxShadow: "0 0 15px rgba(124,58,237,0.5)" }}>
                ⚔️ 友達に挑戦状を送る
              </a>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #1a1a2e, #000)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                {isEndless ? `${currentDarumaCount - 1}段達成をシェア 🔥` : "結果をXでシェア"}
              </a>
              <button onClick={handleRetry}
                className="w-full px-8 py-4 rounded-2xl font-black text-lg text-white transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #ff6b2b, #dc2626)",
                  boxShadow: "0 0 20px rgba(255,107,43,0.5)",
                }}>
                🎎 もう一度！
              </button>
              <button
                onClick={() => window.dispatchEvent(new Event("daruma:openPayjp"))}
                className="w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#1a0a00" }}
              >
                ⭐ プレミアムで無制限プレイ ¥480/月
              </button>
              {isEndless && (
                <button onClick={handleRetryFromStart}
                  className="w-full py-2 rounded-xl text-xs text-amber-600 underline">
                  最初からやり直す
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {phase === "playing" && !cleared && !failed && (
        <div className="w-full max-w-sm mt-2 text-center">
          <p className="text-xs text-amber-600">
            黄色のだるまを左右にスワイプして叩き抜け！
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            {isEndless ? `${currentDarumaCount}段タワーを攻略せよ！` : level.hint}
          </p>
        </div>
      )}
    </div>
  );
}
