"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/data/questions";
import { soundFx } from "@/lib/audio";

const STORAGE_KEY = "animal-synergy-answers";

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ scoreX: number; scoreY: number }[]>(
    []
  );

  const question = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;

    soundFx.playTap();
    setSelectedOption(optionIndex);

    const option = question.options[optionIndex];
    const nextAnswers = [
      ...answers,
      { scoreX: option.scoreX, scoreY: option.scoreY },
    ];
    setAnswers(nextAnswers);

    setTimeout(() => {
      if (currentIndex + 1 < QUESTIONS.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAnswers));
        router.push("/result");
      }
    }, 400);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl shadow-orange-900/10 sm:p-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-orange-700">
            <span>
              質問 {currentIndex + 1} / {QUESTIONS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-orange-100">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="mb-6 text-xl font-bold leading-relaxed text-orange-900">
          {question.text}
        </h2>

        <div className="flex flex-col gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isDimmed = selectedOption !== null && !isSelected;
            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={selectedOption !== null}
                className={`rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition-all duration-200 ${
                  isSelected
                    ? "border-orange-500 bg-orange-500 text-white scale-[1.02]"
                    : "border-orange-100 bg-orange-50 text-orange-900 hover:border-orange-300 hover:bg-orange-100"
                } ${isDimmed ? "opacity-40" : ""}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
