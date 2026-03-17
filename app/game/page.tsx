"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PayjpModal from "@/components/PayjpModal";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), { ssr: false });

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

function GamePageInner() {
  const searchParams = useSearchParams();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgrade") === "1") {
      setShowUpgradeModal(true);
    }
    // ゲーム内からの課金トリガーを受け取る
    const handleOpenPayjp = () => setShowUpgradeModal(true);
    window.addEventListener("daruma:openPayjp", handleOpenPayjp);
    return () => window.removeEventListener("daruma:openPayjp", handleOpenPayjp);
  }, [searchParams]);

  return (
    <>
      {showUpgradeModal && (
        <PayjpModal
          publicKey={PAYJP_PUBLIC_KEY}
          planLabel="プレミアムプラン ¥300/月 — 無制限プレイ・記録保存・新レベル優先解放"
          plan="standard"
          onSuccess={() => {
            setShowUpgradeModal(false);
            window.location.href = "/game?premium=1";
          }}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
      <GameCanvas />
    </>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div />}>
      <GamePageInner />
    </Suspense>
  );
}
