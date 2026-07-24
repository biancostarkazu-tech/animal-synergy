"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/data/questions";
import { soundFx } from "@/lib/audio";
import { analyzeGesture, GesturePoint } from "@/lib/gesture";

const STORAGE_KEY = "animal-synergy-answers";

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ scoreX: number; scoreY: number }[]>(
    []
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const gesturePointsRef = useRef<GesturePoint[]>([]);

  const question = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  useEffect(() => {
    if (!question.isGesture) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    gesturePointsRef.current = [];
  }, [currentIndex, question.isGesture]);

  const goToNext = (nextAnswers: { scoreX: number; scoreY: number }[]) => {
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
    goToNext(nextAnswers);
  };

  const getCanvasPoint = (
    canvas: HTMLCanvasElement,
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    isDrawingRef.current = true;
    const { x, y } = getCanvasPoint(canvas, e);
    gesturePointsRef.current.push({ x, y, t: performance.now() });
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#f97316";
    const { x, y } = getCanvasPoint(canvas, e);
    gesturePointsRef.current.push({ x, y, t: performance.now() });
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gesturePointsRef.current = [];
  };

  const submitGesture = () => {
    const canvas = canvasRef.current;
    soundFx.playTap();
    const score = canvas
      ? analyzeGesture(gesturePointsRef.current, canvas.width, canvas.height)
      : { scoreX: 1, scoreY: 1 };
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);
    goToNext(nextAnswers);
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

        {question.isGesture ? (
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50">
              <canvas
                ref={canvasRef}
                width={400}
                height={220}
                className="h-56 w-full touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
              <button
                onClick={clearCanvas}
                className="absolute bottom-2 right-2 rounded-lg border border-orange-300 bg-white/90 px-2.5 py-1 text-xs font-bold text-orange-700"
              >
                やりなおす
              </button>
            </div>
            <button
              onClick={submitGesture}
              className="w-full rounded-2xl bg-orange-500 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-transform active:scale-95"
            >
              描けたら次へ ➔
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
