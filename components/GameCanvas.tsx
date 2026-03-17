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

  const level = LEVELS[levelIndex];
  const { playKnock, playClear, playFail } = useGameSounds();

  useEffect(() => {
    const bs = localStorage.getItem("daruma_best");
    if (bs) setBestScore(parseInt(bs));
  }, []);

  const handleClear = useCallback(() => {
    playClear();
    setCleared(true);
    const newScore = score + level.darumas * 100;
    setScore(newScore);
    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem("daruma_best", String(newScore));
    }
  }, [score, level, bestScore]);

  const handleFail = useCallback(() => {
    playFail();
    setFailed(true);
  }, [playFail]);

  const { phase, removedCount, initGame, onTouchStart, onTouchEnd, onMouseDown, onMouseUp } =
    usePhysicsGame({
      canvasRef,
      darumaCount: level.darumas,
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

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    setCleared(false);
    setFailed(false);
    prevRemovedRef.current = 0;
    initGame().then((c) => { cleanup = c; });
    return () => { cleanup?.(); };
  }, [levelIndex]);

  const handleNext = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex((i) => i + 1);
    }
  };

  const handleRetry = () => {
    setLevelIndex((i) => i);
    setCleared(false);
    setFailed(false);
    initGame();
  };

  const shareText = `\u{1F38E} \u30c0\u30eb\u30de\u843d\u3068\u3057PHYSICS\u3067${level.name}\u30ec\u30d9\u30ebクリア！\n\u30b9\u30b3\u30a2: ${score}点\n#\u30c0\u30eb\u30de\u843d\u3068\u3057 #\u7269\u7406\u30d1\u30ba\u30eb\nhttps://daruma-physics.vercel.app`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="flex flex-col items-center min-h-dvh py-2 px-2"
      style={{ background: "linear-gradient(160deg, #1a0a00, #2d1500)" }}>

      <div className="w-full max-w-sm flex items-center justify-between mb-2">
        <a href="/" className="text-amber-500 text-sm">← トップ</a>
        <span className="font-black text-lg" style={{ color: "#ff6b2b" }}>
          🎎 Lv.{level.id} {level.name}
        </span>
        <span className="text-xs text-amber-600">
          Best: {bestScore}
        </span>
      </div>

      <div className="w-full max-w-sm flex gap-1 mb-2">
        {Array.from({ length: level.darumas }).map((_, i) => (
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

        {cleared && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bounce-in"
            style={{ background: "rgba(0,0,0,0.8)" }}>
            <div className="text-6xl mb-3">🎉</div>
            <div className="text-3xl font-black mb-1" style={{ color: "#ff6b2b" }}>クリア！</div>
            <div className="text-amber-300 mb-4">+{level.darumas * 100}点</div>
            <div className="space-y-2 w-48">
              {levelIndex < LEVELS.length - 1 ? (
                <button onClick={handleNext}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)" }}>
                  次のレベルへ →
                </button>
              ) : (
                <div className="text-amber-300 text-center text-sm font-bold">全レベルクリア！🏆</div>
              )}
              <a href={shareUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-bold"
                style={{ background: "#000", color: "#fff" }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Xでシェア
              </a>
            </div>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl shake"
            style={{ background: "rgba(0,0,0,0.8)" }}>
            <div className="text-6xl mb-3">💥</div>
            <div className="text-2xl font-black mb-1 text-red-400">崩れた！</div>
            <div className="text-amber-500 text-sm mb-4">タワーが倒れました</div>
            <button onClick={handleRetry}
              className="px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #ff6b2b, #dc2626)" }}>
              もう一度 🎎
            </button>
          </div>
        )}
      </div>

      {phase === "playing" && !cleared && !failed && (
        <div className="w-full max-w-sm mt-2 text-center">
          <p className="text-xs text-amber-600">
            黄色のだるまを左右にスワイプして叩き抜け！
          </p>
          <p className="text-xs text-amber-700 mt-0.5">{level.hint}</p>
        </div>
      )}
    </div>
  );
}