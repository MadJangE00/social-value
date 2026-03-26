"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

import type { ReactNode } from "react";

interface PlatformCardProps {
  platform: string;
  score: number;
  breakdown: Record<string, number>;
  icon: ReactNode;
  metrics?: Record<string, string | number>;
}

export default function PlatformCard({ platform, score, breakdown, icon, metrics }: PlatformCardProps) {
  const radarData = Object.entries(breakdown).map(([key, value]) => ({
    subject: key,
    value,
  }));

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-white font-semibold text-lg">{platform}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-400">{score}</div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <Radar
              name={platform}
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {metrics && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.entries(metrics).map(([key, val]) => (
            <div key={key} className="bg-gray-800 rounded-lg p-2 text-center">
              <div className="text-white font-semibold text-sm">
                {typeof val === "number" ? val.toLocaleString() : val}
              </div>
              <div className="text-gray-500 text-xs">{key}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
