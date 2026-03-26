import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchGitHubMetrics } from "@/lib/platforms/github";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "github" },
  });

  if (!account?.access_token) {
    return NextResponse.json({ error: "GitHub 계정이 연결되지 않았습니다" }, { status: 400 });
  }

  try {
    const metrics = await fetchGitHubMetrics(account.access_token);

    // 메트릭 저장
    const platformAccount = await prisma.platformAccount.upsert({
      where: { userId_platform: { userId: session.user.id, platform: "GITHUB" } },
      create: {
        userId: session.user.id,
        platform: "GITHUB",
        platformId: metrics.username,
        username: metrics.username,
        accessToken: account.access_token,
      },
      update: {
        username: metrics.username,
        accessToken: account.access_token,
      },
    });

    await prisma.metric.create({
      data: {
        platformAccountId: platformAccount.id,
        followers: metrics.followers,
        following: metrics.following,
        postCount: metrics.publicRepos,
        extra: {
          totalStars: metrics.totalStars,
          totalCommits: metrics.totalCommits,
          avatarUrl: metrics.avatarUrl,
          profileUrl: metrics.profileUrl,
        },
      },
    });

    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "데이터 수집 실패" },
      { status: 500 }
    );
  }
}
