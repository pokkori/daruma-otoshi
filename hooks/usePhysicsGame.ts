"use client";

import { useRef, useCallback, useState } from "react";

export type GamePhase = "idle" | "playing" | "clear" | "failed";

export interface SwipeFeedback {
  direction: "left" | "right";
  strength: "weak" | "medium" | "strong";
  x: number;
  y: number;
  time: number;
}

interface UsePhysicsGameOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  darumaCount: number;
  onClear: () => void;
  onFail: () => void;
}

const CANVAS_W = 360;
const CANVAS_H = 580;
const DARUMA_W = 70;
const DARUMA_H = 55;
const GROUND_Y = CANVAS_H - 60;
const DARUMA_COLORS = ["#dc2626","#ea580c","#d97706","#16a34a","#2563eb","#7c3aed","#db2777","#0f172a"];

let darumaImgCache: HTMLImageElement | null = null;
function getDarumaImg(): HTMLImageElement | null {
  if (darumaImgCache?.complete && darumaImgCache.naturalWidth > 0) return darumaImgCache;
  if (!darumaImgCache) {
    darumaImgCache = new Image();
    darumaImgCache.src = "/images/daruma_red.png";
  }
  return null;
}

export function usePhysicsGame({ canvasRef, darumaCount, onClear, onFail }: UsePhysicsGameOptions) {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [removedCount, setRemovedCount] = useState(0);
  const [swipeFeedback, setSwipeFeedback] = useState<SwipeFeedback | null>(null);
  const engineRef = useRef<import("matter-js").Engine | null>(null);
  const runnerRef = useRef<import("matter-js").Runner | null>(null);
  const bodiesRef = useRef<import("matter-js").Body[]>([]);
  const phaseRef = useRef<GamePhase>("idle");
  const removedRef = useRef(0);
  const targetIndexRef = useRef(0);
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isAnimatingRef = useRef(false);
  const rafRef = useRef<number>(0);
  const matterRef = useRef<typeof import("matter-js") | null>(null);
  const pendingRemovalRef = useRef(false);

  const updatePhase = (p: GamePhase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const initGame = useCallback(async () => {
    const Matter = await import("matter-js");
    matterRef.current = Matter;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (runnerRef.current && engineRef.current) {
      Matter.Runner.stop(runnerRef.current);
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const engine = Matter.Engine.create({ gravity: { y: 1.5 } });
    engineRef.current = engine;

    const ground = Matter.Bodies.rectangle(CANVAS_W / 2, GROUND_Y + 25, CANVAS_W, 50, { isStatic: true, label: "ground" });
    const wallL = Matter.Bodies.rectangle(-10, CANVAS_H / 2, 20, CANVAS_H, { isStatic: true, label: "wall" });
    const wallR = Matter.Bodies.rectangle(CANVAS_W + 10, CANVAS_H / 2, 20, CANVAS_H, { isStatic: true, label: "wall" });

    const centerX = CANVAS_W / 2;
    const darumas: import("matter-js").Body[] = [];

    for (let i = 0; i < darumaCount; i++) {
      const y = GROUND_Y - DARUMA_H / 2 - i * DARUMA_H;
      const body = Matter.Bodies.rectangle(centerX, y, DARUMA_W, DARUMA_H, {
        restitution: 0.1,
        friction: 0.8,
        frictionAir: 0.05,
        label: `daruma_${i}`,
        collisionFilter: { category: 0x0001, mask: 0x0001 | 0x0002 },
      });
      darumas.push(body);
    }
    bodiesRef.current = darumas;
    targetIndexRef.current = 0;
    removedRef.current = 0;
    setRemovedCount(0);
    isAnimatingRef.current = false;
    pendingRemovalRef.current = false;

    Matter.Composite.add(engine.world, [ground, wallL, wallR, ...darumas]);

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    updatePhase("playing");

    const draw = () => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#1a0a00";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const grd = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_H);
      grd.addColorStop(0, "#8B4513");
      grd.addColorStop(1, "#3d1a00");
      ctx.fillStyle = grd;
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
      ctx.strokeStyle = "#cd853f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_W, GROUND_Y);
      ctx.stroke();

      const darumaImg = getDarumaImg();
      darumas.forEach((body, i) => {
        const { x, y } = body.position;
        const angle = body.angle;
        const color = DARUMA_COLORS[i % DARUMA_COLORS.length];
        const isTarget = i === targetIndexRef.current;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        const rx = DARUMA_W / 2;
        const ry = DARUMA_H / 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (isTarget) {
          ctx.strokeStyle = "#ffff00";
          ctx.lineWidth = 3;
          ctx.shadowColor = "#ffff00";
          ctx.shadowBlur = 12;
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        if (darumaImg) {
          ctx.drawImage(darumaImg, -rx * 0.8, -ry * 0.8, rx * 1.6, ry * 1.6);
        } else {
          ctx.font = `${Math.min(DARUMA_W, DARUMA_H) * 0.65}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("\u{1F38E}", 0, 0);
        }

        ctx.restore();
      });

      if (phaseRef.current === "playing") {
        const targetBody = darumas[targetIndexRef.current];
        if (targetBody && !pendingRemovalRef.current) {
          const { x, y } = targetBody.position;
          ctx.fillStyle = "#ffff00";
          ctx.font = "bold 16px system-ui";
          ctx.textAlign = "center";
          ctx.fillText("\u2190 \u53e9\u304f \u2192", x, y - DARUMA_H / 2 - 20);
        }
      }

      // --- BUG FIX: Event-driven out-of-bounds detection per frame ---
      if (phaseRef.current === "playing" && pendingRemovalRef.current) {
        const targetBody = darumas[targetIndexRef.current];
        if (targetBody) {
          const { x, y } = targetBody.position;
          const outOfBounds = x < -100 || x > CANVAS_W + 100 || y > GROUND_Y + 100;
          // Also check if body has essentially stopped moving (failed to leave)
          const vel = targetBody.velocity;
          const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
          const stopped = speed < 0.5 && !outOfBounds;

          if (outOfBounds) {
            Matter.Composite.remove(engine.world, targetBody);
            const newRemoved = removedRef.current + 1;
            removedRef.current = newRemoved;
            setRemovedCount(newRemoved);
            targetIndexRef.current++;
            pendingRemovalRef.current = false;

            if (newRemoved >= darumaCount) {
              updatePhase("clear");
              setTimeout(onClear, 500);
            }
            isAnimatingRef.current = false;
          } else if (stopped) {
            // Body didn't leave — swipe was too weak, allow retry
            pendingRemovalRef.current = false;
            isAnimatingRef.current = false;
          }
        }
      }

      // Fail detection for non-target darumas
      if (phaseRef.current === "playing") {
        let hasFailed = false;
        darumas.forEach((body, i) => {
          if (i <= targetIndexRef.current) return;
          if (body.position.y > GROUND_Y + 50) hasFailed = true;
          const normalizedAngle = Math.abs(body.angle % (Math.PI * 2));
          if (normalizedAngle > Math.PI / 4 && normalizedAngle < Math.PI * 7 / 4) {
            hasFailed = true;
          }
        });
        if (hasFailed && !isAnimatingRef.current) {
          updatePhase("failed");
          setTimeout(onFail, 300);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    };
  }, [canvasRef, darumaCount, onClear, onFail]);

  const handleSwipe = useCallback(async (startX: number, startY: number, endX: number, endY: number, duration: number) => {
    if (phaseRef.current !== "playing" || isAnimatingRef.current) return;
    const Matter = matterRef.current || await import("matter-js");

    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 30) return;

    const engine = engineRef.current;
    if (!engine) return;

    const targetBody = bodiesRef.current[targetIndexRef.current];
    if (!targetBody) return;

    const speed = Math.min(dist / Math.max(duration, 50) * 30, 60);
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed * 0.3;

    isAnimatingRef.current = true;
    pendingRemovalRef.current = true;

    // Swipe visual feedback
    const direction: "left" | "right" = dx < 0 ? "left" : "right";
    const absSpeed = Math.abs(speed);
    const strength: "weak" | "medium" | "strong" = absSpeed < 20 ? "weak" : absSpeed < 40 ? "medium" : "strong";
    setSwipeFeedback({
      direction,
      strength,
      x: targetBody.position.x,
      y: targetBody.position.y,
      time: Date.now(),
    });
    setTimeout(() => setSwipeFeedback(null), 500);

    Matter.Body.setVelocity(targetBody, { x: vx, y: vy });
  }, [darumaCount, onClear]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeStartRef.current) return;
    const t = e.changedTouches[0];
    const duration = Date.now() - swipeStartRef.current.time;
    handleSwipe(swipeStartRef.current.x, swipeStartRef.current.y, t.clientX, t.clientY, duration);
    swipeStartRef.current = null;
  }, [handleSwipe]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    swipeStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  }, []);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    if (!swipeStartRef.current) return;
    const duration = Date.now() - swipeStartRef.current.time;
    handleSwipe(swipeStartRef.current.x, swipeStartRef.current.y, e.clientX, e.clientY, duration);
    swipeStartRef.current = null;
  }, [handleSwipe]);

  return {
    phase,
    removedCount,
    swipeFeedback,
    initGame,
    onTouchStart,
    onTouchEnd,
    onMouseDown,
    onMouseUp,
  };
}
