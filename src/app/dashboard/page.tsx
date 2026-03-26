"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GitBranch, Play, RefreshCw, LogOut, BookOpen } from "lucide-react";
import ScoreGauge from "@/components/ScoreGauge";
import PlatformCard from "@/components/PlatformCard";
import { calcGitHubScore, calcYouTubeScore, calcTotalScore, SocialValueResult } from "@/lib/score";
import type { GitHubMetrics } from "@/lib/platforms/github";
import type { YouTubeMetrics } from "@/lib/platforms/youtube";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [githubMetrics, setGithubMetrics] = useState<GitHubMetrics | null>(null);
  const [youtubeMetrics, setYoutubeMetrics] = useState<YouTubeMetrics | null>(null);
  const [result, setResult] = useState<SocialValueResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    const scores = [];

    try {
      const ghRes = await fetch("/api/metrics/github");
      if (ghRes.ok) {
        const gh: GitHubMetrics = await ghRes.json();
        setGithubMetrics(gh);
        scores.push(calcGitHubScore(gh));
      }
    } catch {}

    try {
      const ytRes = await fetch("/api/metrics/youtube");
      if (ytRes.ok) {
        const yt: YouTubeMetrics = await ytRes.json();
        setYoutubeMetrics(yt);
        scores.push(calcYouTubeScore(yt));
      }
    } catch {}

    if (scores.length > 0) {
      setResult(calcTotalScore(scores));
    } else {
      setError("연결된 플랫폼이 없습니다. 아래에서 계정을 연결하세요.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchAll();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-400">Social Value</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{session?.user?.name}</span>
          <Link href="/guide" className="text-gray-500 hover:text-white transition">
            <BookOpen size={18} />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-gray-500 hover:text-white transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* 종합 점수 */}
        <section className="flex flex-col items-center mb-12">
          {result ? (
            <ScoreGauge score={result.totalScore} grade={result.grade} />
          ) : (
            <div className="text-gray-500">데이터를 불러오는 중...</div>
          )}
          <button
            onClick={fetchAll}
            disabled={loading}
            className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm px-5 py-2.5 rounded-xl transition"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "수집 중..." : "데이터 갱신"}
          </button>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </section>

        {/* 플랫폼 연결 버튼 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">플랫폼 연결</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-sm text-white px-4 py-2 rounded-lg transition"
            >
              <GitBranch size={16} />
              GitHub 연결
            </button>
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-sm text-white px-4 py-2 rounded-lg transition"
            >
              <Play size={16} />
              YouTube 연결
            </button>
          </div>
        </section>

        {/* 플랫폼별 카드 */}
        {result && (
          <section>
            <h2 className="text-lg font-semibold text-gray-300 mb-4">플랫폼별 분석</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.platforms.map((p) => {
                if (p.platform === "GitHub" && githubMetrics) {
                  return (
                    <PlatformCard
                      key="github"
                      platform="GitHub"
                      score={p.score}
                      breakdown={p.breakdown}
                      icon={<GitBranch size={20} />}
                      metrics={{
                        팔로워: githubMetrics.followers,
                        스타: githubMetrics.totalStars,
                        커밋: githubMetrics.totalCommits,
                        레포: githubMetrics.publicRepos,
                      }}
                    />
                  );
                }
                if (p.platform === "YouTube" && youtubeMetrics) {
                  return (
                    <PlatformCard
                      key="youtube"
                      platform="YouTube"
                      score={p.score}
                      breakdown={p.breakdown}
                      icon={<Play size={20} className="text-red-500" />}
                      metrics={{
                        구독자: youtubeMetrics.subscriberCount,
                        조회수: youtubeMetrics.viewCount,
                        영상수: youtubeMetrics.videoCount,
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
