"use client";
import React, { useEffect, useRef, useState } from "react";

export type DarumaPose = "idle" | "happy" | "crying" | "excited";

interface Props {
  pose: DarumaPose;
  size?: number;
}

// だるまSVGキャラ
function DarumaChar({ blink, pose }: { blink: boolean; pose: DarumaPose }) {
  const eyeH = blink ? 1 : 9;

  // ポーズ別ボディ形状
  const squish = pose === "excited" ? "scaleY(0.92) scaleX(1.08)" : "scale(1)";
  const bodyColor = pose === "crying" ? "#c93a2d" : "#e63729";

  return (
    <svg
      viewBox="0 0 100 120"
      width="100%"
      height="100%"
      style={{ overflow: "visible", transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      {/* 胴体（だるま丸い形） */}
      <ellipse
        cx="50" cy="72" rx="38" ry="42"
        fill={bodyColor}
        style={{ transform: squish, transformOrigin: "50px 72px", transition: "all 0.2s" }}
      />

      {/* 金色の帯（腹） */}
      <ellipse cx="50" cy="82" rx="28" ry="12" fill="#d97706" opacity="0.85" />

      {/* 内側の白い面 */}
      <ellipse cx="50" cy="68" rx="26" ry="28" fill="#fef9f0" />

      {/* 眉毛（太い・力強い） */}
      <path d="M32 46 Q36 41 42 44" stroke="#1a1a1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M58 44 Q64 41 68 46" stroke="#1a1a1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* 目 */}
      <ellipse cx="37" cy="54" rx="6" ry={eyeH / 2.5} fill="#1a1a1a" />
      <ellipse cx="63" cy="54" rx="6" ry={eyeH / 2.5} fill="#1a1a1a" />
      {/* 目の白ハイライト */}
      {!blink && <ellipse cx="39" cy="51" rx="2" ry="1.5" fill="white" />}
      {!blink && <ellipse cx="65" cy="51" rx="2" ry="1.5" fill="white" />}

      {/* 口（ポーズ別） */}
      {pose === "happy" && (
        <path d="M40 70 Q50 78 60 70" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {pose === "crying" && (
        <>
          <path d="M40 73 Q50 68 60 73" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* 涙 */}
          <ellipse cx="32" cy="64" rx="3" ry="5" fill="#60a5fa" opacity="0.9" />
          <ellipse cx="68" cy="64" rx="3" ry="5" fill="#60a5fa" opacity="0.9" />
        </>
      )}
      {pose === "excited" && (
        <>
          <path d="M39 70 Q50 80 61 70" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* 興奮の汗マーク */}
          <path d="M74 42 L78 38 L80 44" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      {pose === "idle" && (
        <path d="M42 70 Q50 75 58 70" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* 鼻 */}
      <circle cx="50" cy="62" r="3.5" fill="#c2410c" />

      {/* 頭部の丸みと飾り */}
      <ellipse cx="50" cy="32" rx="22" ry="18" fill={bodyColor} />
      <ellipse cx="50" cy="32" rx="14" ry="10" fill="#fef9f0" />

      {/* 頭頂の金装飾 */}
      <ellipse cx="50" cy="16" rx="8" ry="5" fill="#d97706" />
      <ellipse cx="50" cy="16" rx="4" ry="2.5" fill="#fbbf24" />

      {/* excitedポーズ: 腕（ばんざい）*/}
      {pose === "excited" && (
        <>
          <ellipse cx="16" cy="55" rx="8" ry="6" fill={bodyColor} transform="rotate(-40, 16, 55)" />
          <ellipse cx="84" cy="55" rx="8" ry="6" fill={bodyColor} transform="rotate(40, 84, 55)" />
        </>
      )}

      {/* happyポーズ: 両手広げる */}
      {pose === "happy" && (
        <>
          <ellipse cx="14" cy="65" rx="7" ry="5" fill={bodyColor} transform="rotate(-20, 14, 65)" />
          <ellipse cx="86" cy="65" rx="7" ry="5" fill={bodyColor} transform="rotate(20, 86, 65)" />
        </>
      )}

      {/* 胴体の紋様（丸） */}
      <circle cx="50" cy="82" r="6" fill="#fef9f0" opacity="0.7" />
      <circle cx="50" cy="82" r="3" fill="#d97706" opacity="0.9" />
    </svg>
  );
}

const DarmaMascot: React.FC<Props> = ({ pose, size = 100 }) => {
  const [blink, setBlink] = useState(false);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 4秒ごとに瞬き
  useEffect(() => {
    const schedule = () => {
      blinkTimerRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          schedule();
        }, 120);
      }, 4000 + Math.random() * 1200);
    };
    schedule();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  const floatStyle: React.CSSProperties =
    pose === "idle"
      ? { animation: "darumaFloat 2.8s ease-in-out infinite", willChange: "transform" }
      : pose === "happy"
      ? { animation: "darumaBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }
      : pose === "excited"
      ? { animation: "darumaShake 0.4s ease-in-out forwards" }
      : {};

  return (
    <>
      <style>{`
        @keyframes darumaFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%       { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes darumaBounce {
          0%   { transform: translateY(0) scale(1); }
          40%  { transform: translateY(-20px) scale(1.12); }
          70%  { transform: translateY(-8px) scale(0.94); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes darumaShake {
          0%   { transform: rotate(-8deg); }
          25%  { transform: rotate(10deg); }
          50%  { transform: rotate(-6deg); }
          75%  { transform: rotate(8deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
      <div style={{ width: size, height: size * 1.2, display: "inline-block", ...floatStyle }}>
        <DarumaChar blink={blink} pose={pose} />
      </div>
    </>
  );
};

export default DarmaMascot;
