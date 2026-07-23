"use client";

import { useState } from "react";
import Link from "next/link";
import { ANIMALS } from "@/data/animals";
import { soundFx } from "@/lib/audio";

export default function CatalogPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const animals = Object.values(ANIMALS);
  const selected = selectedId ? ANIMALS[selectedId] : null;

  const openDetail = (id: string) => {
    soundFx.playTap();
    setSelectedId(id);
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-6 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-orange-900">
              どうぶつ図鑑
            </h1>
            <p className="text-sm font-bold text-orange-700">
              全24種類。タップするとトリセツが見られます。
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border-2 border-orange-300 px-4 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-100"
          >
            トップへ
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {animals.map((animal) => (
            <button
              key={animal.id}
              onClick={() => openDetail(animal.id)}
              className="flex flex-col items-center gap-1 rounded-2xl border-2 p-3 text-center shadow-md transition-transform active:scale-95"
              style={{
                backgroundColor: animal.color.card,
                borderColor: animal.color.primary,
              }}
            >
              <div className="text-4xl">{animal.emoji}</div>
              <div
                className="text-xs font-black leading-tight"
                style={{ color: animal.color.text }}
              >
                {animal.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-3xl p-6 shadow-2xl"
            style={{ backgroundColor: selected.color.card }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-6xl">{selected.emoji}</div>
              <h2
                className="mt-2 text-xl font-black"
                style={{ color: selected.color.text }}
              >
                {selected.name}
              </h2>
              <p
                className="mt-1 text-sm font-bold"
                style={{ color: selected.color.primary }}
              >
                {selected.catchphrase}
              </p>
            </div>

            <div className="mt-5 space-y-3 text-left">
              <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: selected.color.bg }}
              >
                <p
                  className="text-xs font-bold"
                  style={{ color: selected.color.primary }}
                >
                  ✨ リフレーミングされた才能
                </p>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: selected.color.text }}
                >
                  {selected.reframedTalent}
                </p>
              </div>
              <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: selected.color.bg }}
              >
                <p
                  className="text-xs font-bold"
                  style={{ color: selected.color.primary }}
                >
                  🤝 トリセツ
                </p>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: selected.color.text }}
                >
                  {selected.interactionTip}
                </p>
              </div>
              <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: selected.color.bg }}
              >
                <p
                  className="text-xs font-bold"
                  style={{ color: selected.color.primary }}
                >
                  💬 かけてほしい言葉
                </p>
                <p
                  className="mt-1 text-sm font-bold leading-relaxed"
                  style={{ color: selected.color.text }}
                >
                  {selected.praiseWord}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedId(null)}
              className="mt-5 w-full rounded-xl py-3 text-sm font-bold text-white"
              style={{ backgroundColor: selected.color.primary }}
            >
              とじる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
