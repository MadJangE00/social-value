"use client";

import { signIn } from "next-auth/react";
import { GitBranch, Play } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl p-10 w-full max-w-md shadow-xl border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Social Value</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          SNS 활동으로 나의 소셜 가치를 측정하세요
        </p>

        <div className="space-y-3">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition"
          >
            <GitBranch size={20} />
            GitHub로 시작하기
          </button>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-medium py-3 px-6 rounded-xl transition"
          >
            <Play size={20} />
            Google (YouTube)로 시작하기
          </button>
        </div>

        <p className="text-gray-600 text-xs text-center mt-6">
          로그인 시 SNS 공개 데이터를 수집합니다
        </p>
      </div>
    </div>
  );
}
