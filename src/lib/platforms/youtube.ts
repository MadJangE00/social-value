export interface YouTubeMetrics {
  channelId: string;
  channelTitle: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  likeCount: number; // 최근 동영상 기반 평균
  channelUrl: string;
  thumbnailUrl: string;
}

export async function fetchYouTubeMetrics(accessToken: string): Promise<YouTubeMetrics> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  // 내 채널 정보
  const channelRes = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
    { headers }
  );
  if (!channelRes.ok) throw new Error("YouTube API 호출 실패");
  const channelData = await channelRes.json();

  if (!channelData.items?.length) {
    throw new Error("YouTube 채널이 없습니다");
  }

  const channel = channelData.items[0];
  const stats = channel.statistics;

  // 최근 동영상 좋아요 평균 계산
  let likeCount = 0;
  const videosRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channel.id}&order=date&maxResults=10&type=video`,
    { headers }
  );
  if (videosRes.ok) {
    const videosData = await videosRes.json();
    const videoIds = videosData.items?.map((v: { id: { videoId: string } }) => v.id.videoId).join(",");
    if (videoIds) {
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`,
        { headers }
      );
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        const totalLikes = statsData.items?.reduce(
          (sum: number, v: { statistics: { likeCount: string } }) => sum + parseInt(v.statistics.likeCount ?? "0"),
          0
        ) ?? 0;
        likeCount = statsData.items?.length ? Math.round(totalLikes / statsData.items.length) : 0;
      }
    }
  }

  return {
    channelId: channel.id,
    channelTitle: channel.snippet.title,
    subscriberCount: parseInt(stats.subscriberCount ?? "0"),
    viewCount: parseInt(stats.viewCount ?? "0"),
    videoCount: parseInt(stats.videoCount ?? "0"),
    likeCount,
    channelUrl: `https://www.youtube.com/channel/${channel.id}`,
    thumbnailUrl: channel.snippet.thumbnails?.default?.url ?? "",
  };
}
