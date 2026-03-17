import { useRef, useCallback } from "react";

export function useGameSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const tone = useCallback((freq: number, type: OscillatorType, dur: number, vol = 0.3, delay = 0) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = type;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    } catch { /* silent fail */ }
  }, [getCtx]);

  // だるまを叩き抜いたとき「ドスッ」
  const playKnock = useCallback(() => {
    tone(180, "sine", 0.08, 0.5);
    tone(120, "triangle", 0.12, 0.4, 0.04);
  }, [tone]);

  // クリア「やった！」チャイム
  const playClear = useCallback(() => {
    const seq = [659, 784, 988, 1319];
    seq.forEach((f, i) => tone(f, "triangle", 0.35, 0.45, i * 0.14));
  }, [tone]);

  // 崩れた「ガシャン」
  const playFail = useCallback(() => {
    // noise-ish crash with multiple tones
    [80, 120, 200, 350].forEach((f, i) => tone(f, "sawtooth", 0.25 + i * 0.05, 0.35, i * 0.04));
  }, [tone]);

  return { playKnock, playClear, playFail };
}
