# Social Value — 프로젝트 문서

## 개요

SNS 활동 데이터를 수집·분석하여 개인의 소셜 가치를 수치화하는 서비스.
팔로워, 조회수, 스타 등 플랫폼별 메트릭을 기반으로 0~100점 + S~D 등급을 산정하며,
협업/프로젝트 참여 시 기여도 산정 기준으로 활용 가능.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 인증 | NextAuth.js v5 (beta) |
| ORM | Prisma 7 |
| DB | PostgreSQL 16 (Docker) |
| 차트 | Recharts |
| 아이콘 | lucide-react |

---

## 프로젝트 구조

```
app/
├── prisma/
│   ├── schema.prisma          # DB 스키마
│   └── migrations/            # 마이그레이션 파일
├── prisma.config.ts           # Prisma 7 설정 (DB URL)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # NextAuth 핸들러
│   │   │   └── metrics/
│   │   │       ├── github/route.ts           # GitHub 메트릭 수집
│   │   │       └── youtube/route.ts          # YouTube 메트릭 수집
│   │   ├── dashboard/page.tsx  # 메인 대시보드
│   │   ├── login/page.tsx      # 로그인 페이지
│   │   ├── guide/page.tsx      # 사용 가이드
│   │   ├── layout.tsx
│   │   └── page.tsx            # / → 로그인 여부에 따라 redirect
│   ├── components/
│   │   ├── ScoreGauge.tsx      # 원형 점수 게이지
│   │   ├── PlatformCard.tsx    # 플랫폼별 레이더 차트 카드
│   │   └── SessionProvider.tsx
│   ├── lib/
│   │   ├── auth.ts             # NextAuth 설정 (GitHub, Google provider)
│   │   ├── prisma.ts           # Prisma 클라이언트 (pg adapter)
│   │   ├── score.ts            # 가치 점수 계산 엔진
│   │   └── platforms/
│   │       ├── github.ts       # GitHub API 연동
│   │       └── youtube.ts      # YouTube Data API v3 연동
│   └── types/
│       └── next-auth.d.ts      # Session 타입 확장
└── .env.local                  # 환경변수 (gitignore)
```

---

## DB 스키마 요약

```
User ─┬─ Account (OAuth 토큰)
      ├─ Session
      ├─ PlatformAccount (연결된 SNS 계정)
      │    └─ Metric (수집된 메트릭 스냅샷)
      └─ ScoreHistory (가치 점수 히스토리)
```

### 지원 플랫폼 (Platform enum)
`GITHUB` / `YOUTUBE` / `INSTAGRAM` / `NAVER_BLOG` / `CHZZK` / `SOOP` / `KAKAO`

---

## 점수 계산 알고리즘

로그 스케일 정규화로 팔로워 수의 극단값을 완화.

### GitHub 점수 (0~100)
| 항목 | 가중치 | 기준 max |
|------|--------|---------|
| 팔로워 | 35% | 10,000 |
| 스타 합산 | 30% | 5,000 |
| 연간 커밋 | 25% | 500 |
| 공개 레포 | 10% | 100 |

### YouTube 점수 (0~100)
| 항목 | 가중치 | 기준 max |
|------|--------|---------|
| 구독자 | 40% | 1,000,000 |
| 총 조회수 | 35% | 10,000,000 |
| 평균 좋아요 | 15% | 10,000 |
| 영상 수 | 10% | 500 |

### 등급
| 점수 | 등급 |
|------|------|
| 80 이상 | S |
| 60~79 | A |
| 40~59 | B |
| 20~39 | C |
| 20 미만 | D |

---

## 환경변수 (.env.local)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/social_value_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

---

## 로컬 실행 방법

```bash
# 1. DB 컨테이너 시작 (Docker 필요)
docker run -d --name social-value-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=social_value_db \
  -p 5432:5432 postgres:16

# 2. 의존성 설치
cd app
npm install

# 3. DB 마이그레이션
npx prisma migrate dev

# 4. 개발 서버 실행
npm run dev
```

→ http://localhost:3000

---

## OAuth 설정

### GitHub
- https://github.com/settings/developers → New OAuth App
- Callback URL: `http://localhost:3000/api/auth/callback/github`

### Google (YouTube)
- https://console.cloud.google.com → YouTube Data API v3 활성화
- OAuth 클라이언트 → Redirect URI: `http://localhost:3000/api/auth/callback/google`
- 필요 scope: `https://www.googleapis.com/auth/youtube.readonly`

---

## 향후 추가 예정 플랫폼

- [ ] Naver 블로그 (Naver Open API)
- [ ] 치지직 (크롤링 또는 비공개 API)
- [ ] SOOP (아프리카TV API)
- [ ] Instagram (Meta Basic Display API)
