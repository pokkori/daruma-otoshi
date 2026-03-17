"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { usePhysicsGame } from "@/hooks/usePhysicsGame";
import { LEVELS } from "@/lib/levels";
import { useGameSounds } from "@/hooks/useGameSounds";

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
    }
  }, [score, currentDarumaCount, bestScore, isEndless, endlessStage, bestEndlessStage]);

  const handleFail = useCallback(() => {
    playFail();
    setFailed(true);
  }, [playFail]);

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://daruma-physics.vercel.app";
  const shareText = isEndless
    ? `\u{1F38E} ダルマ落としPHYSICS エンドレスモード ${currentDarumaCount}段タワー攻略！\nスコア: ${score}点\n最高記録: ${9 + bestEndlessStage}段\n#ダルマ落とし #物理パズル\n${siteUrl}`
    : `\u{1F38E} ダルマ落としPHYSICSで${level.name}レベルクリア！\nスコア: ${score}点\n#ダルマ落とし #物理パズル\n${siteUrl}`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

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

      <div className="w-full max-w-sm flex items-center justify-between mb-2">
        <a href="/" className="text-amber-500 text-sm">&larr; トップ</a>
        <span className="font-black text-lg" style={{ color: "#ff6b2b" }}>
          {isEndless ? "🔥" : "🎎"} {displayName}
        </span>
        <span className="text-xs text-amber-600">
          Best: {bestScore}
        </span>
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
            <div className="text-amber-500 text-sm mb-4">タワーが倒れました</div>
            <div className="space-y-2 w-52">
              <a href={shareUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
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
