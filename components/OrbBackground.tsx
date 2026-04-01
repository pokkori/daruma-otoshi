"use client";
import React from "react";

// 白(#f1f5f9)・赤(#dc2626)・黒(#1a1a1a)・金(#d97706)テーマの8オーブ
const orbs = [
  { size: 360, left: 6,  top: 4,  color: "rgba(220,38,38,0.18)",  duration: 10, delay: 0,   blur: 95 },
  { size: 250, left: 80, top: 10, color: "rgba(217,119,6,0.15)",  duration: 12, delay: 1.3, blur: 80 },
  { size: 310, left: 38, top: 58, color: "rgba(241,245,249,0.06)",duration: 9,  delay: 0.7, blur: 100},
  { size: 200, left: 90, top: 52, color: "rgba(220,38,38,0.12)",  duration: 7,  delay: 2.0, blur: 65 },
  { size: 400, left: 4,  top: 70, color: "rgba(217,119,6,0.10)",  duration: 14, delay: 0.4, blur: 110},
  { size: 180, left: 60, top: 15, color: "rgba(241,245,249,0.05)",duration: 6,  delay: 1.1, blur: 70 },
  { size: 280, left: 25, top: 35, color: "rgba(220,38,38,0.13)",  duration: 11, delay: 2.8, blur: 88 },
  { size: 220, left: 70, top: 78, color: "rgba(217,119,6,0.11)",  duration: 8,  delay: 0.5, blur: 75 },
];

const OrbBackground = React.memo(function OrbBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: "linear-gradient(145deg, #0f0500 0%, #1a0a00 45%, #1f0d08 100%)",
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes orbFloatDaruma {
          0%   { transform: translate(-50%,-50%) scale(1);    opacity: 0.50; }
          25%  { transform: translate(-50%,-50%) translate(14px,-20px) scale(1.06); opacity: 0.80; }
          50%  { transform: translate(-50%,-50%) translate(-8px,-32px) scale(0.92); opacity: 0.60; }
          75%  { transform: translate(-50%,-50%) translate(18px,-12px) scale(1.02); opacity: 0.75; }
          100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.50; }
        }
      `}</style>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            animation: `orbFloatDaruma ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
});

export default OrbBackground;
