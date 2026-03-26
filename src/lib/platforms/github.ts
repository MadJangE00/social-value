export interface GitHubMetrics {
  username: string;
  avatarUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalCommits: number; // 최근 1년
  profileUrl: string;
}

export async function fetchGitHubMetrics(accessToken: string): Promise<GitHubMetrics> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
  };

  // 기본 사용자 정보
  const userRes = await fetch("https://api.github.com/user", { headers });
  if (!userRes.ok) throw new Error("GitHub API 호출 실패");
  const user = await userRes.json();

  // 레포지토리 목록 (star 합산용)
  let totalStars = 0;
  let page = 1;
  while (true) {
    const reposRes = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}`,
      { headers }
    );
    if (!reposRes.ok) break;
    const repos = await reposRes.json();
    if (!repos.length) break;
    totalStars += repos.reduce((sum: number, r: { stargazers_count: number }) => sum + r.stargazers_count, 0);
    if (repos.length < 100) break;
    page++;
  }

  // 최근 1년 커밋 수 (contribution graph)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const since = oneYearAgo.toISOString();

  const eventsRes = await fetch(
    `https://api.github.com/users/${user.login}/events?per_page=100`,
    { headers }
  );
  let totalCommits = 0;
  if (eventsRes.ok) {
    const events = await eventsRes.json();
    totalCommits = events
      .filter((e: { type: string; created_at: string }) => e.type === "PushEvent" && e.created_at > since)
      .reduce((sum: number, e: { payload: { commits: unknown[] } }) => sum + (e.payload?.commits?.length ?? 0), 0);
  }

  return {
    username: user.login,
    avatarUrl: user.avatar_url,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    totalStars,
    totalCommits,
    profileUrl: user.html_url,
  };
}
