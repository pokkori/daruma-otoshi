"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { usePhysicsGame, DifficultyLevel } from "@/hooks/usePhysicsGame";
import { LEVELS } from "@/lib/levels";
import { useGameSounds } from "@/hooks/useGameSounds";
import { useDarmaBGM } from "@/hooks/useDarmaBGM";
import OrbBackground from "@/components/OrbBackground";
import DarmaMascot, { type DarumaPose } from "@/components/DarmaMascot";

//  スキン定義 
type DarumaSkin = { id: string; emoji: string; label: string; desc: string; premium: boolean };
const DARUMA_SKINS: DarumaSkin[] = [
  { id: "red",    emoji: "red",    label: "赤だるま",   desc: "定番の守護神",         premium: false },
  { id: "gold",   emoji: "gold",   label: "金だるま",   desc: "10連勝で解除",         premium: true },
  { id: "oni",    emoji: "oni",    label: "鬼だるま",   desc: "ホラー感MAX",          premium: true },
  { id: "neko",   emoji: "neko",   label: "招き猫",     desc: "縁起物バージョン",     premium: true },
];
const SKIN_KEY = "daruma_skin";
function loadSkin(): string {
  try { return localStorage.getItem(SKIN_KEY) ?? "red"; } catch { return "red"; }
}
function saveSkin(id: string): void {
  try { localStorage.setItem(SKIN_KEY, id); } catch { /* ignore */ }
}

//  シェア画像生成 
function generateShareImage(stage: number, score: number, skin: DarumaSkin): string {
  if (typeof window === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 800; canvas.height = 400;
  const ctx = canvas.getContext("2d")!;
  // 背景
  ctx.fillStyle = "#1a0a00";
  ctx.fillRect(0, 0, 800, 400);
  // グロー演出
  const grad = ctx.createRadialGradient(400, 200, 0, 400, 200, 300);
  grad.addColorStop(0, "rgba(255,80,0,0.25)");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 400);
  // だるま絵文字
  ctx.font = "bold 90px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(skin.emoji, 400, 130);
  // スコア
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px sans-serif";
  ctx.fillText(`${stage}段クリア！`, 400, 220);
  ctx.fillStyle = "#ffd700";
  ctx.font = "bold 38px sans-serif";
  ctx.fillText(`スコア: ${score}点`, 400, 290);
  ctx.fillStyle = "#ff9999";
  ctx.font = "22px sans-serif";
  ctx.fillText("ダルマ落とし | daruma-otoshi.vercel.app", 400, 360);
  return canvas.toDataURL("image/png");
}

//  段位認定 
type DanRank = { name: string; nameEn: string; emoji: string; color: string; minStage: number };
const DAN_RANKS: DanRank[] = [
  { name: "見習い叩き師", nameEn: "Apprentice", emoji: "beginner", color: "#94a3b8", minStage: 0 },
  { name: "初段", nameEn: "1st Dan", emoji: "dan1", color: "#f97316", minStage: 1 },
  { name: "二段", nameEn: "2nd Dan", emoji: "dan2", color: "#ef4444", minStage: 3 },
  { name: "三段", nameEn: "3rd Dan", emoji: "dan3", color: "#a855f7", minStage: 6 },
  { name: "四段", nameEn: "4th Dan", emoji: "dan4", color: "#f59e0b", minStage: 10 },
  { name: "師範代", nameEn: "Senior", emoji: "senior", color: "#d97706", minStage: 15 },
  { name: "師範", nameEn: "Master", emoji: "master", color: "#fbbf24", minStage: 21 },
];
function getDanRank(bestEndlessStage: number): DanRank {
  for (let i = DAN_RANKS.length - 1; i >= 0; i--) {
    if (bestEndlessStage >= DAN_RANKS[i].minStage) return DAN_RANKS[i];
  }
  return DAN_RANKS[0];
}

//  デイリーチャレンジ 
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

//  ローカルランキング 
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

//  ストリーク 

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

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: "かんたん",
  normal: "ふつう",
  hard: "むずかしい",
};
const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  easy: "#22c55e",
  normal: "#f59e0b",
  hard: "#ef4444",
};
const DIFFICULTY_EMOJIS: Record<DifficultyLevel, string> = {
  easy: "◎",
  normal: "●",
  hard: "★",
};

//  3秒チャレンジタイマーUI 
const THREE_SEC_DURATION = 3000; // ms

function ThreeSecTimer({ startTime, duration }: { startTime: number; duration: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    let raf: number;
    const tick = () => {
      setElapsed(Date.now() - startTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startTime]);
  const remaining = Math.max(0, (duration - elapsed) / 1000);
  const pct = Math.min(1, elapsed / duration);
  const color = remaining > 1.5 ? "#38bdf8" : remaining > 0.8 ? "#fbbf24" : "#ef4444";
  return (
    <div className="flex flex-col items-center mb-1">
      <span className="text-2xl font-black tabular-nums" style={{ color }}>
        {remaining.toFixed(2)}s
      </span>
      <div className="w-40 h-2 rounded-full overflow-hidden mt-0.5" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div className="h-full rounded-full transition-none" style={{ width: `${(1 - pct) * 100}%`, background: color }} />
      </div>
    </div>
  );
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
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("normal");
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  // スキン
  const [selectedSkin, setSelectedSkin] = useState<string>("red");
  // 3秒チャレンジ
  const [threeSec, setThreeSec] = useState(false);
  const [threeSecTime, setThreeSecTime] = useState<number | null>(null); // ms elapsed
  const [threeSecBest, setThreeSecBest] = useState<number | null>(null);
  const threeSecStartRef = useRef<number | null>(null);
  const threeSecRafRef = useRef<number>(0);
  // シェア画像
  const [shareImageUrl, setShareImageUrl] = useState<string>("");

  // In endless mode, daruma count = 9 + endlessStage
  const isEndless = endlessMode;
  const currentDarumaCount = isEndless
    ? 9 + endlessStage
    : LEVELS[levelIndex].darumas;

  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)];
  const { playKnock, playClear, playFail } = useGameSounds();
  const { start: bgmStart, stop: bgmStop, setMuted: bgmSetMuted } = useDarmaBGM();
  const [bgmMuted, setBgmMuted] = useState(false);
  const [mascotPose, setMascotPose] = useState<DarumaPose>("idle");
  const bgmStartedRef = useRef(false);

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
    // スキン読み込み
    setSelectedSkin(loadSkin());
    // 3秒チャレンジベスト
    const tsb = localStorage.getItem("daruma_3sec_best");
    if (tsb) setThreeSecBest(parseFloat(tsb));

    // BGM: 初回ユーザーインタラクションで起動
    const startBgmOnce = () => {
      if (!bgmStartedRef.current) {
        bgmStartedRef.current = true;
        bgmStart();
      }
      document.removeEventListener("click", startBgmOnce);
      document.removeEventListener("touchstart", startBgmOnce);
    };
    document.addEventListener("click", startBgmOnce);
    document.addEventListener("touchstart", startBgmOnce);
    return () => {
      document.removeEventListener("click", startBgmOnce);
      document.removeEventListener("touchstart", startBgmOnce);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClear = useCallback(() => {
    playClear();
    triggerSlowMotion();
    setMascotPose("happy");
    setTimeout(() => setMascotPose("excited"), 500);
    setCleared(true);
    const newScore = score + currentDarumaCount * 100;
    setScore(newScore);
    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem("daruma_best", String(newScore));
    }
    // 3秒チャレンジ計測終了
    if (threeSec && threeSecStartRef.current !== null) {
      const elapsed = Date.now() - threeSecStartRef.current;
      setThreeSecTime(elapsed);
      cancelAnimationFrame(threeSecRafRef.current);
      if (threeSecBest === null || elapsed < threeSecBest) {
        setThreeSecBest(elapsed);
        localStorage.setItem("daruma_3sec_best", String(elapsed));
      }
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
    // シェア画像生成
    const skin = DARUMA_SKINS.find(s => s.id === selectedSkin) ?? DARUMA_SKINS[0];
    const stage = isEndless ? endlessStage + 1 : levelIndex + 1;
    const img = generateShareImage(stage, newScore, skin);
    setShareImageUrl(img);
  }, [score, currentDarumaCount, bestScore, isEndless, endlessStage, bestEndlessStage, dailyChallenge.target, threeSec, threeSecBest, selectedSkin, levelIndex]);

  const handleFail = useCallback(() => {
    playFail();
    bgmStop();
    setMascotPose("crying");
    setFailed(true);
    // 3秒チャレンジ計測キャンセル
    if (threeSec) {
      cancelAnimationFrame(threeSecRafRef.current);
    }
    // ランキング保存
    const today = new Date().toISOString().slice(0, 10);
    const stage = isEndless ? endlessStage : levelIndex;
    const entry: RankEntry = { stage, mode: isEndless ? "endless" : "normal", date: today };
    setRanking(saveRanking(entry));
    // シェア画像生成（失敗時）
    const skin = DARUMA_SKINS.find(s => s.id === selectedSkin) ?? DARUMA_SKINS[0];
    const img = generateShareImage(stage, score, skin);
    setShareImageUrl(img);
  }, [playFail, isEndless, endlessStage, levelIndex, threeSec, selectedSkin, score]);

  const { phase, removedCount, swipeFeedback, initGame, triggerSlowMotion, onTouchStart, onTouchEnd, onMouseDown, onMouseUp } =
    usePhysicsGame({
      canvasRef,
      darumaCount: currentDarumaCount,
      difficulty,
      onClear: handleClear,
      onFail: handleFail,
    });

  const prevRemovedRef = useRef(0);
  useEffect(() => {
    if (removedCount > prevRemovedRef.current) {
      playKnock();
      setMascotPose("excited");
      setTimeout(() => setMascotPose("idle"), 600);
      prevRemovedRef.current = removedCount;
    }
  }, [removedCount, playKnock]);

  // Re-init game when level or endless stage changes
  const gameKey = isEndless ? `endless_${endlessStage}_${difficulty}` : `level_${levelIndex}_${difficulty}`;
  useEffect(() => {
    if (showDifficultySelect) return; // 難易度選択中はゲームを初期化しない
    let cleanup: (() => void) | undefined;
    setCleared(false);
    setFailed(false);
    prevRemovedRef.current = 0;
    initGame().then((c) => { cleanup = c; });
    return () => { cleanup?.(); };
  }, [gameKey, showDifficultySelect]);

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
    setThreeSecTime(null);
    setShareImageUrl("");
    if (threeSec) {
      threeSecStartRef.current = null;
    }
    initGame();
  };

  const handleRetryFromStart = () => {
    setEndlessMode(false);
    setEndlessStage(0);
    setLevelIndex(0);
    setScore(0);
    setCleared(false);
    setFailed(false);
    setThreeSec(false);
    setThreeSecTime(null);
    setShareImageUrl("");
  };

  // 3秒チャレンジスタート
  const handleStart3Sec = () => {
    setThreeSec(true);
    setThreeSecTime(null);
    setShareImageUrl("");
    setEndlessMode(false);
    setEndlessStage(0);
    setLevelIndex(0);
    setScore(0);
    setCleared(false);
    setFailed(false);
    threeSecStartRef.current = Date.now();
    // タイマーティック（UIに残り時間表示）は cleared/failed で終了
  };

  // 30秒チャレンジスタート
  const handleStart30Sec = () => {
    setThreeSec(false);
    setThreeSecTime(null);
    setShareImageUrl("");
    setCleared(false);
    setFailed(false);
    setScore(0);
    initGame();
  };

  // Share text
  const siteUrl = "https://daruma-otoshi.vercel.app";
  const danRank = getDanRank(bestEndlessStage);

  // 挑戦状URL生成（友達がこのURLを開くとスコアとランクが表示される）
  const challengeUrl = `${siteUrl}/game?challenge_score=${score}&challenge_rank=${encodeURIComponent(danRank.name)}`;
  const challengeShareText = isEndless
    ? `【${danRank.name}】のオレに勝てるか？\nダルマ落としPHYSICS エンドレス${currentDarumaCount}段・スコア${score}点\n挑戦受付中\n#ダルマ落とし #物理パズル`
    : `【${danRank.name}】のオレのスコア${score}点に勝てるか？\nダルマ落としPHYSICS\n挑戦受付中\n#ダルマ落とし #物理パズル`;
  const challengeShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(challengeShareText)}&url=${encodeURIComponent(challengeUrl)}`;

  // エンドレスモード時: 段位認定証OGP画像URLを生成
  const ogImageUrl = isEndless
    ? `${siteUrl}/api/og?rank=${encodeURIComponent(danRank.name)}&stage=${encodeURIComponent(String(9 + bestEndlessStage))}&color=${encodeURIComponent(danRank.color)}`
    : null;

  const shareText = isEndless
    ? `ダルマ落としPHYSICS【${danRank.name}】エンドレスモード ${currentDarumaCount}段タワー攻略！\nスコア: ${score}点 / 最高: ${9 + bestEndlessStage}段\n#ダルマ落とし #物理パズル #${danRank.name}`
    : `ダルマ落としPHYSICSで${level.name}レベルクリア！\nスコア: ${score}点\n段位: ${danRank.name}\n#ダルマ落とし #物理パズル\n${siteUrl}`;

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

  // 難易度選択スタート画面
  if (showDifficultySelect) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh py-4 px-4 overflow-y-auto" style={{ position: "relative" }}>
        <OrbBackground />
        <div className="w-full max-w-sm" style={{ position: "relative", zIndex: 1 }}>
          <div className="text-center mb-6">
            {/* だるまSVGマスコット */}
            <div className="flex justify-center mb-3">
              <DarmaMascot pose="idle" size={90} />
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ color: "#ff6b2b" }}>ダルマ落とし</h1>
            <p className="text-sm" style={{ color: "rgba(255,180,120,0.7)" }}>難易度とスキンを選んでスタート！</p>
          </div>

          {/* スキン選択 */}
          <div className="mb-5 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4" style={{ border: "1px solid rgba(255,107,43,0.15)" }}>
            <div className="text-xs font-black mb-2 tracking-widest" style={{ color: "rgba(255,180,120,0.6)" }}>だるまスキン</div>
            <div className="grid grid-cols-4 gap-2">
              {DARUMA_SKINS.map((skin) => {
                const isSelected = selectedSkin === skin.id;
                const isLocked = skin.premium;
                return (
                  <button
                    key={skin.id}
                    onClick={() => {
                      if (!isLocked) {
                        setSelectedSkin(skin.id);
                        saveSkin(skin.id);
                      }
                    }}
                    aria-label={`${skin.label}スキンを選択する${isLocked ? "（プレミアム限定）" : ""}`}
                    aria-pressed={isSelected}
                    className="relative flex flex-col items-center py-3 rounded-xl transition-all active:scale-95"
                    style={{
                      background: isSelected ? "rgba(255,107,43,0.25)" : "rgba(255,107,43,0.06)",
                      border: isSelected ? "2px solid rgba(255,107,43,0.8)" : "1px solid rgba(255,107,43,0.2)",
                      boxShadow: isSelected ? "0 0 16px rgba(255,107,43,0.4)" : "none",
                      opacity: isLocked ? 0.6 : 1,
                    }}
                  >
                    <div className="mb-1" style={{ width: 40, height: 40 }}>
                      <DarmaMascot pose={isSelected ? "happy" : "idle"} size={40} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: isSelected ? "#ff6b2b" : "rgba(255,200,150,0.7)" }}>
                      {skin.label}
                    </span>
                    {isLocked && (
                      <span className="absolute top-1 right-1 text-xs font-black" style={{ color: "#94a3b8" }}>鍵</span>
                    )}
                    {isSelected && !isLocked && (
                      <svg className="absolute top-1 right-1" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" fill="#d97706" />
                        <path d="M3 6 L5.5 8.5 L9 4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs mt-1.5" style={{ color: "rgba(255,120,70,0.45)" }}>プレミアムで解放（金・鬼・招き猫）</p>
          </div>

          <div className="space-y-3 mb-5">
            {(["easy", "normal", "hard"] as DifficultyLevel[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  setShowDifficultySelect(false);
                }}
                aria-label={`難易度を${DIFFICULTY_LABELS[d]}に設定する`}
                aria-pressed={difficulty === d}
                className="w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 hover:scale-105 flex items-center justify-between px-6"
                style={{
                  background: difficulty === d
                    ? `linear-gradient(135deg, ${DIFFICULTY_COLORS[d]}22, ${DIFFICULTY_COLORS[d]}11)`
                    : "rgba(255,107,43,0.08)",
                  border: `2px solid ${DIFFICULTY_COLORS[d]}${difficulty === d ? "aa" : "44"}`,
                  color: DIFFICULTY_COLORS[d],
                  boxShadow: difficulty === d ? `0 0 20px ${DIFFICULTY_COLORS[d]}33` : "none",
                }}
              >
                <span>{DIFFICULTY_EMOJIS[d]} {DIFFICULTY_LABELS[d]}</span>
                <span className="text-sm font-normal" style={{ color: "rgba(255,200,150,0.6)" }}>
                  {d === "easy" ? "ゆっくり・安定" : d === "normal" ? "標準・バランス" : "速い・高難度"}
                </span>
              </button>
            ))}
          </div>
          <div className="rounded-xl p-4 text-xs space-y-1.5 backdrop-blur-md"
            style={{ background: "rgba(255,107,43,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="font-bold mb-2" style={{ color: "#ffb899" }}>難易度の違い</div>
            <div style={{ color: "rgba(255,180,120,0.7)" }}>◎ かんたん — 重力弱め・摩擦大。初心者・子どもにおすすめ</div>
            <div style={{ color: "rgba(255,180,120,0.7)" }}>● ふつう — バランス型。物理演算の醍醐味を楽しめる</div>
            <div style={{ color: "rgba(255,180,120,0.7)" }}>★ むずかしい — 重力強め・滑りやすい。上級者向け</div>
          </div>
          <p className="text-center text-xs mt-4" style={{ color: "rgba(255,120,70,0.5)" }}>
            ゲーム中も設定から難易度変更できます
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-dvh py-2 px-2" style={{ position: "relative" }}>
      <OrbBackground />

      {/* ストリークバナー */}
      {showStreakBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-6 py-3 rounded-2xl font-black text-lg shadow-2xl animate-bounce"
            style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", color: "#fff", boxShadow: "0 0 30px rgba(255,107,43,0.7)" }}>
            {darumaStreak}日連続！叩き師の証！
          </div>
        </div>
      )}

      <div className="w-full max-w-sm flex items-center justify-between mb-2" style={{ position: "relative", zIndex: 10 }}>
        <a href="/" className="text-amber-500 text-sm" style={{ minHeight: 44, display: "flex", alignItems: "center" }}>&larr; トップ</a>
        <span className="font-black text-lg" style={{ color: "#ff6b2b" }}>
          {displayName}
          {darumaStreak >= 2 && <span className="text-xs ml-1 text-amber-400">{darumaStreak}日</span>}
        </span>
        <button
          onClick={() => setShowDifficultySelect(true)}
          aria-label="難易度設定を開く"
          className="text-xs px-2 py-1 rounded-full font-bold"
          style={{ minHeight: 44, minWidth: 44, background: `${DIFFICULTY_COLORS[difficulty]}22`, color: DIFFICULTY_COLORS[difficulty], border: `1px solid ${DIFFICULTY_COLORS[difficulty]}55` }}
        >
          {DIFFICULTY_EMOJIS[difficulty]} {DIFFICULTY_LABELS[difficulty]}
        </button>
      </div>

      {/* DarmaMascot + BGMミュートボタン */}
      <div className="w-full max-w-sm flex items-center justify-between mb-1" style={{ position: "relative", zIndex: 10 }}>
        <DarmaMascot pose={mascotPose} size={60} />
        <button
          onClick={() => {
            const next = !bgmMuted;
            setBgmMuted(next);
            bgmSetMuted(next);
          }}
          style={{
            minHeight: 44,
            minWidth: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            padding: "0 10px",
          }}
          aria-label={bgmMuted ? "BGMをオンにする" : "BGMをオフにする"}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {bgmMuted ? (
              <>
                <path d="M9 9v6h4l5 5V4l-5 5H9z" fill="rgba(255,255,255,0.3)" />
                <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M9 9v6h4l5 5V4l-5 5H9z" fill="#ff6b2b" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="#ff6b2b" strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            )}
          </svg>
        </button>
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
          <span>今日のチャレンジ: {dailyChallenge.label}</span>
          {dailyChallengeCleared ? (
            <span className="text-amber-300 font-black animate-pulse">達成！</span>
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
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bounce-in backdrop-blur-md"
            style={{ background: "rgba(0,0,0,0.82)" }}>
            {/* クリア演出: DarmaMascot happy */}
            <div className="flex justify-center mb-2 animate-bounce">
              <DarmaMascot pose="happy" size={70} />
            </div>
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
                次: {currentDarumaCount + 1}段タワーに挑戦！
              </div>
            )}

            {/* 段位バッジ */}
            <div className="mb-3 px-5 py-2 rounded-full font-black text-sm flex items-center gap-2"
              style={{ background: "rgba(0,0,0,0.5)", border: `2px solid ${danRank.color}`, color: danRank.color, boxShadow: `0 0 15px ${danRank.color}40` }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: danRank.color, flexShrink: 0 }} />
              <span>{danRank.name}</span>
              <span className="text-xs opacity-70">/ {danRank.nameEn}</span>
            </div>

            <div className="space-y-2 w-52">
              {isEndless ? (
                <button onClick={handleEndlessNext}
                  aria-label="次の段へ進む"
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)", boxShadow: "0 0 20px rgba(255,107,43,0.5)" }}>
                  次の段へ
                </button>
              ) : levelIndex < LEVELS.length - 1 ? (
                <button onClick={handleNext}
                  aria-label="次のレベルへ進む"
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)" }}>
                  次のレベルへ &rarr;
                </button>
              ) : (
                <button onClick={handleEnterEndless}
                  aria-label="エンドレスモードに突入する"
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95 animate-pulse"
                  style={{ background: "linear-gradient(135deg, #ff6b2b, #7c3aed)", boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}>
                  エンドレスモード突入！
                </button>
              )}
              {/* 崩れ瞬間シェアボタン（クリア時） */}
              {shareImageUrl && (
                <button
                  aria-label="この瞬間をシェアする（画像付き）"
                  onClick={async () => {
                    const stage = isEndless ? currentDarumaCount : levelIndex + 1;
                    const text = `ダルマ落とし ${stage}段クリア！物理演算がリアルすぎる #ダルマ落とし daruma-otoshi.vercel.app`;
                    // Web Share API（モバイル：画像+テキスト）
                    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare) {
                      try {
                        const res = await fetch(shareImageUrl);
                        const blob = await res.blob();
                        const file = new File([blob], "daruma-clear.png", { type: "image/png" });
                        if (navigator.canShare({ files: [file] })) {
                          await navigator.share({ files: [file], text, url: "https://daruma-otoshi.vercel.app" });
                          return;
                        }
                      } catch { /* fallthrough */ }
                    }
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ff4444, #dc2626)", color: "#fff", boxShadow: "0 0 14px rgba(255,68,68,0.4)" }}
                >
                  この瞬間をシェア（画像付き）
                </button>
              )}
              {/* 挑戦状ボタン */}
              <a href={challengeShareUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff", boxShadow: "0 0 12px rgba(124,58,237,0.5)" }}>
                友達に挑戦状を送る
              </a>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ background: "#000", color: "#fff" }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                {isEndless ? `${currentDarumaCount}段達成をシェア` : "クリアをXでシェア"}
              </a>
            </div>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl shake overflow-y-auto py-4 backdrop-blur-md"
            style={{ background: "rgba(0,0,0,0.88)" }}>
            {/* 失敗演出: DarmaMascot crying */}
            <div className="relative mb-3 text-center">
              <div className="flex justify-center mb-2">
                <DarmaMascot pose="crying" size={70} />
              </div>
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
            {/* もう一回ボタン（最優先・大きく表示） */}
            <button onClick={handleRetry}
              aria-label="もう一回プレイする"
              className="w-52 px-8 py-4 rounded-2xl font-black text-lg text-white transition-all active:scale-95 mb-3"
              style={{
                background: "linear-gradient(135deg, #ff6b2b, #dc2626)",
                boxShadow: "0 0 24px rgba(255,107,43,0.6)",
              }}>
              もう一回！
            </button>
            {/* 段位バッジ */}
            <div className="mb-3 px-5 py-2 rounded-full font-black text-sm flex items-center gap-2"
              style={{ background: "rgba(0,0,0,0.5)", border: `2px solid ${danRank.color}`, color: danRank.color, boxShadow: `0 0 15px ${danRank.color}40` }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: danRank.color, flexShrink: 0 }} />
              <span>現在: {danRank.name}</span>
              {danRank.minStage < DAN_RANKS[DAN_RANKS.length - 1].minStage && (
                <span className="text-xs opacity-60">次段まであと{(DAN_RANKS[Math.min(DAN_RANKS.findIndex(d => d.name === danRank.name) + 1, DAN_RANKS.length - 1)].minStage - bestEndlessStage)}段</span>
              )}
            </div>
            {/*  ハイスコアTOP5 */}
            {(() => {
              const modeKey: "endless" | "normal" = isEndless ? "endless" : "normal";
              const modeLabel = isEndless ? "エンドレス" : "通常";
              const top5 = ranking.filter(r => r.mode === modeKey).slice(0, 5);
              if (top5.length === 0) return null;
              return (
                <div className="w-52 mb-3 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(251,191,36,0.4)", background: "rgba(0,0,0,0.5)" }}>
                  <div className="px-3 py-1.5 text-xs font-black flex items-center gap-1" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                    ハイスコアTOP5（{modeLabel}）
                  </div>
                  {top5.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1 text-xs" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <span style={{ color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#d97706" : "#6b7280", fontWeight: "bold" }}>
                        {`${i + 1}.`}
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
              {/* 崩れ瞬間シェアボタン */}
              {shareImageUrl && (
                <button
                  aria-label="この瞬間をシェアする（画像付き）"
                  onClick={async () => {
                    const stage = isEndless ? currentDarumaCount - 1 : levelIndex + 1;
                    const text = `ダルマ落とし ${stage}段まで到達！物理演算がリアルすぎる #ダルマ落とし daruma-otoshi.vercel.app`;
                    // Web Share API（モバイル：画像+テキスト）
                    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare) {
                      try {
                        const res = await fetch(shareImageUrl);
                        const blob = await res.blob();
                        const file = new File([blob], "daruma-result.png", { type: "image/png" });
                        if (navigator.canShare({ files: [file] })) {
                          await navigator.share({ files: [file], text, url: "https://daruma-otoshi.vercel.app" });
                          return;
                        }
                      } catch { /* fallthrough */ }
                    }
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ff4444, #dc2626)", color: "#fff", boxShadow: "0 0 14px rgba(255,68,68,0.5)" }}
                >
                  この瞬間をシェア（画像付き）
                </button>
              )}
              {/* 挑戦状ボタン */}
              <a href={challengeShareUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ minHeight: 44, background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff", boxShadow: "0 0 15px rgba(124,58,237,0.5)" }}>
                友達に挑戦状を送る
              </a>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ minHeight: 44, background: "linear-gradient(135deg, #1a1a2e, #000)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                {isEndless ? `${currentDarumaCount - 1}段達成をシェア` : "結果をXでシェア"}
              </a>
              <button onClick={handleRetry}
                aria-label="もう一度プレイする"
                className="w-full px-8 py-4 rounded-2xl font-black text-lg text-white transition-all active:scale-95"
                style={{
                  minHeight: 44,
                  background: "linear-gradient(135deg, #ff6b2b, #dc2626)",
                  boxShadow: "0 0 20px rgba(255,107,43,0.5)",
                }}>
                もう一度！
              </button>
              {/* 3秒 / 30秒チャレンジボタン */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleStart3Sec}
                  aria-label="3秒チャレンジを開始する"
                  className="py-2.5 rounded-xl font-black text-xs transition-all active:scale-95"
                  style={{ minHeight: 44, background: "linear-gradient(135deg, #0ea5e9, #0284c7)", color: "#fff" }}
                >
                  3秒チャレンジ
                </button>
                <button
                  onClick={handleStart30Sec}
                  aria-label="30秒高得点チャレンジを開始する"
                  className="py-2.5 rounded-xl font-black text-xs transition-all active:scale-95"
                  style={{ minHeight: 44, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff" }}
                >
                  30秒高得点
                </button>
              </div>
              {threeSecBest !== null && (
                <p className="text-center text-xs" style={{ color: "#38bdf8" }}>
                  3秒ベスト: {(threeSecBest / 1000).toFixed(2)}秒
                </p>
              )}
              <button
                onClick={() => window.dispatchEvent(new Event("daruma:openPayjp"))}
                aria-label="プレミアムプランに登録する（¥480/月）"
                className="w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                style={{ minHeight: 44, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#1a0a00" }}
              >
                プレミアムで無制限プレイ ¥480/月
              </button>
              {isEndless && (
                <button onClick={handleRetryFromStart}
                  aria-label="最初からやり直す"
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
          {threeSec && threeSecStartRef.current !== null && (
            <ThreeSecTimer startTime={threeSecStartRef.current} duration={THREE_SEC_DURATION} />
          )}
          <p className="text-xs text-amber-600">
            黄色のだるまを左右にスワイプして叩き抜け！
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            {threeSec ? "3秒以内に1段クリア！タイムを競え！" : isEndless ? `${currentDarumaCount}段タワーを攻略せよ！` : level.hint}
          </p>
        </div>
      )}
    </div>
  );
}
