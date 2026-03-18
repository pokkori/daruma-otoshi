"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import KomojuButton from "@/components/KomojuButton";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), { ssr: false });

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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            <div className="text-4xl mb-3">🎯</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">プレミアムプラン</h2>
            <p className="text-sm text-gray-500 mb-4">月額¥300で無制限プレイ・記録保存・新レベル優先解放</p>
            <ul className="text-sm text-gray-600 space-y-1 mb-5 text-left">
              <li>✓ 無制限プレイ（制限なし）</li>
              <li>✓ スコア記録・ランキング</li>
              <li>✓ 新レベル優先解放</li>
            </ul>
            <KomojuButton
              planId="standard"
              planLabel="¥300/月で始める"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            />
          </div>
        </div>
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
