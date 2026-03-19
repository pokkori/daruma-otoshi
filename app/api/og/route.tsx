import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rank = searchParams.get("rank") ?? "見習い叩き師";
  const emoji = searchParams.get("emoji") ?? "🥋";
  const stage = searchParams.get("stage") ?? "0";
  const color = searchParams.get("color") ?? "#94a3b8";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #1a0a00 0%, #2d1500 40%, #1a0a00 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 炎のグロー背景 */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* 認定証枠 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 80px",
            border: `3px solid ${color}`,
            borderRadius: "24px",
            background: "rgba(0,0,0,0.6)",
            boxShadow: `0 0 60px ${color}44, inset 0 0 40px rgba(0,0,0,0.5)`,
            minWidth: "800px",
          }}
        >
          {/* タイトル */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#d97706",
              letterSpacing: "0.2em",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            🎎 ダルマ落とし PHYSICS
          </div>

          <div
            style={{
              fontSize: "40px",
              fontWeight: 900,
              color: color,
              letterSpacing: "0.15em",
              marginBottom: "24px",
              textShadow: `0 0 30px ${color}88`,
            }}
          >
            ── 段位認定証 ──
          </div>

          {/* 絵文字 + 段位名 */}
          <div
            style={{
              fontSize: "100px",
              marginBottom: "16px",
              filter: `drop-shadow(0 0 30px ${color})`,
            }}
          >
            {emoji}
          </div>

          <div
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: color,
              marginBottom: "12px",
              textShadow: `0 0 40px ${color}`,
            }}
          >
            {rank}
          </div>

          {/* エンドレス段数 */}
          <div
            style={{
              fontSize: "32px",
              color: "#fbbf24",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            エンドレスモード {stage}段クリア達成
          </div>

          {/* フッター */}
          <div
            style={{
              fontSize: "22px",
              color: "#78350f",
              marginTop: "16px",
            }}
          >
            daruma-otoshi.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
