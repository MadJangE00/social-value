import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchYouTubeMetrics } from "@/lib/platforms/youtube";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "google" },
  });

  if (!account?.access_token) {
    return NextResponse.json({ error: "Google 계정이 연결되지 않았습니다" }, { status: 400 });
  }

  try {
    const metrics = await fetchYouTubeMetrics(account.access_token);

    const platformAccount = await prisma.platformAccount.upsert({
      where: { userId_platform: { userId: session.user.id, platform: "YOUTUBE" } },
      create: {
        userId: session.user.id,
        platform: "YOUTUBE",
        platformId: metrics.channelId,
        username: metrics.channelTitle,
        accessToken: account.access_token,
      },
      update: {
        username: metrics.channelTitle,
        accessToken: account.access_token,
      },
    });

    await prisma.metric.create({
      data: {
        platformAccountId: platformAccount.id,
        followers: metrics.subscriberCount,
        totalViews: metrics.viewCount,
        totalLikes: metrics.likeCount,
        postCount: metrics.videoCount,
        extra: {
          channelUrl: metrics.channelUrl,
          thumbnailUrl: metrics.thumbnailUrl,
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
