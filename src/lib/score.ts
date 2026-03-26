import type { GitHubMetrics } from "./platforms/github";
import type { YouTubeMetrics } from "./platforms/youtube";

export interface PlatformScore {
  platform: string;
  score: number; // 0 ~ 100
  breakdown: Record<string, number>;
}

export interface SocialValueResult {
  totalScore: number;
  grade: "S" | "A" | "B" | "C" | "D";
  platforms: PlatformScore[];
}

// 로그 스케일 정규화: 큰 수치를 0~100으로 압축
function logNormalize(value: number, max: number): number {
  if (value <= 0) return 0;
  return Math.min(100, (Math.log10(value + 1) / Math.log10(max + 1)) * 100);
}

export function calcGitHubScore(metrics: GitHubMetrics): PlatformScore {
  const followerScore = logNormalize(metrics.followers, 10000) * 0.35;
  const starScore = logNormalize(metrics.totalStars, 5000) * 0.30;
  const commitScore = logNormalize(metrics.totalCommits, 500) * 0.25;
  const repoScore = logNormalize(metrics.publicRepos, 100) * 0.10;

  const score = Math.round(followerScore + starScore + commitScore + repoScore);

  return {
    platform: "GitHub",
    score,
    breakdown: {
      팔로워: Math.round(followerScore),
      스타: Math.round(starScore),
      커밋: Math.round(commitScore),
      레포: Math.round(repoScore),
    },
  };
}

export function calcYouTubeScore(metrics: YouTubeMetrics): PlatformScore {
  const subScore = logNormalize(metrics.subscriberCount, 1000000) * 0.40;
  const viewScore = logNormalize(metrics.viewCount, 10000000) * 0.35;
  const likeScore = logNormalize(metrics.likeCount, 10000) * 0.15;
  const videoScore = logNormalize(metrics.videoCount, 500) * 0.10;

  const score = Math.round(subScore + viewScore + likeScore + videoScore);

  return {
    platform: "YouTube",
    score,
    breakdown: {
      구독자: Math.round(subScore),
      조회수: Math.round(viewScore),
      좋아요: Math.round(likeScore),
      영상수: Math.round(videoScore),
    },
  };
}

function getGrade(score: number): SocialValueResult["grade"] {
  if (score >= 80) return "S";
  if (score >= 60) return "A";
  if (score >= 40) return "B";
  if (score >= 20) return "C";
  return "D";
}

export function calcTotalScore(platformScores: PlatformScore[]): SocialValueResult {
  const totalScore =
    platformScores.length > 0
      ? Math.round(platformScores.reduce((sum, p) => sum + p.score, 0) / platformScores.length)
      : 0;

  return {
    totalScore,
    grade: getGrade(totalScore),
    platforms: platformScores,
  };
}
