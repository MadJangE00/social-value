"use client";

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

const gradeColors: Record<string, string> = {
  S: "text-yellow-400",
  A: "text-green-400",
  B: "text-blue-400",
  C: "text-orange-400",
  D: "text-red-400",
};

export default function ScoreGauge({ score, grade }: ScoreGaugeProps) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1f2937" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#6366f1"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{score}</span>
          <span className="text-sm text-gray-400">/ 100</span>
        </div>
      </div>
      <div className={`text-5xl font-black mt-3 ${gradeColors[grade] ?? "text-gray-400"}`}>
        {grade}
      </div>
      <p className="text-gray-500 text-sm mt-1">소셜 가치 등급</p>
    </div>
  );
}
