"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { calculateResult } from "@/lib/score";

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

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10"
      style={{ backgroundColor: animal.color.bg }}
    >
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
        </div>
      </div>

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
    </div>
  );
}
