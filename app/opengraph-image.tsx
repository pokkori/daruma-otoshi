import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = " ダルマ落とし PHYSICS | 物理だるまタワー";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #1a0a00, #2d1500, #1a0a00)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20, filter: "drop-shadow(0 0 40px rgba(255,100,0,0.7))" }}></div>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#ff6b2b", marginBottom: 12, textShadow: "0 0 30px rgba(255,107,43,0.5)" }}>
          ダルマ落とし
        </div>
        <div style={{ fontSize: 32, color: "#fbbf24", fontWeight: 700, marginBottom: 8 }}>
          PHYSICS
        </div>
        <div style={{ fontSize: 24, color: "#d97706" }}>
          タワーを崩さず下のだるまを叩き抜け！
        </div>
      </div>
    ),
    { ...size }
  );
}
