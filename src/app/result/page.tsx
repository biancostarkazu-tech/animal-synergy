"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { calculateResult } from "@/lib/score";
import { soundFx } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { downloadCardImage } from "@/lib/card-image";

const STORAGE_KEY = "animal-synergy-answers";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

export default function ResultPage() {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"gacha" | "reveal">("gacha");
  const [gachaProgress, setGachaProgress] = useState(0);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!raw) return null;
    try {
      const answers = JSON.parse(raw) as { scoreX: number; scoreY: number }[];
      return calculateResult(answers);
    } catch {
      return null;
    }
  }, [raw]);

  const notFound = raw !== null && result === null;

  useEffect(() => {
    if (!result) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setGachaProgress(progress);
      soundFx.playGacha();

      if (progress >= 100) {
        clearInterval(interval);
        setPhase("reveal");
        soundFx.playFanfare();
        if (confettiCanvasRef.current) {
          triggerConfetti(confettiCanvasRef.current);
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, [result]);

  const handleRetry = () => {
    localStorage.removeItem(STORAGE_KEY);
    router.push("/");
  };

  if (notFound) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 px-6 py-16 text-center">
        <p className="text-lg font-medium text-orange-900">
          診断結果が見つかりませんでした。
        </p>
        <button
          onClick={handleRetry}
          className="rounded-full bg-orange-500 px-8 py-3 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-105 active:scale-95"
        >
          診断をはじめる
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-16">
        <div className="text-4xl">🐾</div>
      </div>
    );
  }

  const { animal } = result;

  const handleShare = async () => {
    const text = `【アニマルシナジー】私のタイプは「${animal.name}」でした！${animal.emoji}\n${animal.catchphrase}\n#アニマルシナジー #どうぶつ診断`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "アニマルシナジー診断結果", text });
      } catch {
        // user cancelled the share sheet
      }
    } else {
      await navigator.clipboard.writeText(text);
      setShareMessage("結果テキストをコピーしました！");
      setTimeout(() => setShareMessage(null), 2000);
    }
  };

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10"
      style={{ backgroundColor: animal.color.bg }}
    >
      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none fixed inset-0 z-50"
      />

      {phase === "gacha" ? (
        <div className="flex flex-col items-center gap-5 py-10 text-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-pulse rounded-full bg-orange-300/60 blur-xl" />
            <div className="relative z-10 flex h-20 w-20 animate-bounce items-center justify-center rounded-3xl bg-white text-5xl shadow-lg">
              🔮
            </div>
          </div>
          <h2 className="text-lg font-black text-orange-900">分析中...</h2>
          <div className="w-full max-w-xs space-y-1">
            <div className="h-4 w-full overflow-hidden rounded-full border-2 border-orange-900/20 bg-orange-100 p-0.5">
              <div
                className="h-full rounded-full bg-orange-400 transition-all duration-150"
                style={{ width: `${gachaProgress}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className="flex aspect-[9/16] w-full max-w-sm flex-col items-center justify-between rounded-3xl p-8 text-center shadow-2xl"
            style={{ backgroundColor: animal.color.card }}
          >
            <div className="w-full">
              <p
                className="text-sm font-bold tracking-wide"
                style={{ color: animal.color.primary }}
              >
                あなたの診断結果は…
              </p>
              <div className="mt-6 text-8xl">{animal.emoji}</div>
              <h1
                className="mt-4 text-3xl font-extrabold"
                style={{ color: animal.color.text }}
              >
                {animal.name}
              </h1>
              <p
                className="mt-3 text-base font-bold"
                style={{ color: animal.color.primary }}
              >
                {animal.catchphrase}
              </p>
            </div>

            <div className="w-full space-y-4 text-left">
              <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: animal.color.bg }}
              >
                <p
                  className="text-xs font-bold"
                  style={{ color: animal.color.primary }}
                >
                  ✨ リフレーミングされた才能
                </p>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: animal.color.text }}
                >
                  {animal.reframedTalent}
                </p>
              </div>
              <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: animal.color.bg }}
              >
                <p
                  className="text-xs font-bold"
                  style={{ color: animal.color.primary }}
                >
                  🤝 トリセツ
                </p>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: animal.color.text }}
                >
                  {animal.interactionTip}
                </p>
              </div>
              <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: animal.color.bg }}
              >
                <p
                  className="text-xs font-bold"
                  style={{ color: animal.color.primary }}
                >
                  💬 かけてほしい言葉
                </p>
                <p
                  className="mt-1 text-sm font-bold leading-relaxed"
                  style={{ color: animal.color.text }}
                >
                  {animal.praiseWord}
                </p>
              </div>
            </div>
          </div>

          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <button
              onClick={() => downloadCardImage(animal)}
              className="rounded-xl border-2 px-3 py-3 text-sm font-bold shadow-md transition-transform active:scale-95"
              style={{
                borderColor: animal.color.primary,
                color: animal.color.primary,
                backgroundColor: animal.color.card,
              }}
            >
              画像を保存
            </button>
            <button
              onClick={handleShare}
              className="rounded-xl px-3 py-3 text-sm font-bold text-white shadow-md transition-transform active:scale-95"
              style={{ backgroundColor: animal.color.primary }}
            >
              SNSにシェア
            </button>
          </div>

          {shareMessage && (
            <p className="text-xs font-bold text-orange-700">{shareMessage}</p>
          )}

          <button
            onClick={handleRetry}
            className="rounded-full px-8 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: animal.color.primary }}
          >
            もう一度診断する
          </button>

          <p className="max-w-sm text-center text-xs leading-relaxed text-black/50">
            ※本診断は科学的な性格テストではなく、自分や友達の才能を発見するためのエンターテインメント・コミュニケーションツールです。
          </p>
        </>
      )}
    </div>
  );
}
