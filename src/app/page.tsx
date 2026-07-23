import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 px-6 py-16 text-center">
      <div className="text-7xl">🐾</div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-orange-900 sm:text-4xl">
        アニマルシナジー
      </h1>
      <p className="mt-6 max-w-md text-lg leading-8 text-orange-800">
        24種類のどうぶつから、
        <br />
        今日のあなたの才能を発見！
      </p>
      <Link
        href="/quiz"
        className="mt-10 inline-flex items-center justify-center rounded-full bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-105 hover:bg-orange-600 active:scale-95"
      >
        診断をはじめる
      </Link>
      <p className="mt-8 max-w-xs text-xs text-orange-700/70">
        全6問・約1分で完了！結果はその場でシェアもできます。
      </p>
      <Link
        href="/catalog"
        className="mt-4 text-sm font-bold text-orange-700 underline underline-offset-4 hover:text-orange-800"
      >
        どうぶつ図鑑（全24種）を見る
      </Link>
    </div>
  );
}
