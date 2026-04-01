import { useRef, useCallback } from "react";

/**
 * 和風BGM: 琴（三角波）+ 太鼓（低周波バースト）
 * BPM 110、ニ短調ペンタトニック（エネルギッシュ）
 */

const BPM = 110;
const BEAT = 60 / BPM; // 0.545s

// D minor pentatonic (D E F A C)
const PENTA_DARUMA = [
  220.00, // A3
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
];

// 琴メロディーパターン（8拍）
const KOTO_PATTERN = [4, 6, 5, 7, 4, 3, 5, 6];

// ベースパターン
const BASS_PATTERN = [0, 2, 1, 3, 0, 1, 2, 3];

export function useDarmaBGM() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const schedulerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextBeatRef = useRef<number>(0);
  const beatIndexRef = useRef<number>(0);
  const mutedRef = useRef<boolean>(false);
  const runningRef = useRef<boolean>(false);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => { /* noop */ });
    }
    return ctxRef.current;
  }, []);

  const note = useCallback(
    (
      freq: number,
      type: OscillatorType,
      startTime: number,
      duration: number,
      vol: number,
      detune = 0
    ) => {
      try {
        const ctx = getCtx();
        const gain = ctx.createGain();
        gain.connect(masterGainRef.current ?? ctx.destination);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(gain);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      } catch { /* silent fail */ }
    },
    [getCtx]
  );

  const scheduleBeat = useCallback(() => {
    if (!runningRef.current) return;
    const ctx = getCtx();
    const lookAhead = 0.10;
    const scheduleInterval = 60;

    while (nextBeatRef.current < ctx.currentTime + lookAhead) {
      const t = nextBeatRef.current;
      const bi = beatIndexRef.current;
      const bInBar = bi % 8;

      if (!mutedRef.current) {
        // --- 琴（三角波）---
        const kotoFreq = PENTA_DARUMA[KOTO_PATTERN[bInBar]];
        note(kotoFreq, "triangle", t, BEAT * 0.6, 0.25);

        // --- ベース（サイン波）---
        if (bInBar % 2 === 0) {
          const bassFreq = PENTA_DARUMA[BASS_PATTERN[bInBar]] * 0.5;
          note(bassFreq, "sine", t, BEAT * 1.5, 0.18);
        }

        // --- 太鼓（4分音符）---
        if (bInBar % 2 === 0) {
          // 強拍
          note(70, "sawtooth", t, 0.09, 0.45);
          note(55, "triangle", t, 0.14, 0.30);
        }
        // 裏拍（スネア的）
        if (bInBar % 4 === 2) {
          note(180, "sawtooth", t, 0.06, 0.22);
        }

        // 8拍目にハイハット的なアクセント
        if (bInBar === 7) {
          note(800, "triangle", t, 0.04, 0.10);
        }
      }

      nextBeatRef.current += BEAT;
      beatIndexRef.current = (bi + 1) % 32; // 4小節ループ
    }

    schedulerTimerRef.current = setTimeout(scheduleBeat, scheduleInterval);
  }, [getCtx, note]);

  const start = useCallback(() => {
    if (runningRef.current) return;
    try {
      const ctx = getCtx();
      const master = ctx.createGain();
      master.gain.value = 0.60;
      master.connect(ctx.destination);
      masterGainRef.current = master;
      runningRef.current = true;
      nextBeatRef.current = ctx.currentTime + 0.1;
      beatIndexRef.current = 0;
      scheduleBeat();
    } catch { /* silent fail */ }
  }, [getCtx, scheduleBeat]);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (schedulerTimerRef.current) {
      clearTimeout(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }
    if (masterGainRef.current && ctxRef.current) {
      try {
        masterGainRef.current.gain.exponentialRampToValueAtTime(
          0.001,
          ctxRef.current.currentTime + 0.3
        );
      } catch { /* noop */ }
      masterGainRef.current = null;
    }
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    mutedRef.current = muted;
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        muted ? 0 : 0.60,
        ctxRef.current.currentTime,
        0.05
      );
    }
  }, []);

  return { start, stop, setMuted };
}
