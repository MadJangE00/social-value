import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const platforms = [
  {
    name: "GitHub",
    color: "bg-gray-800 border-gray-600",
    badge: "연동 가능",
    badgeColor: "bg-green-600",
    metrics: ["팔로워 수", "공개 레포지토리", "스타 합산", "연간 커밋 수"],
    weights: [
      { label: "팔로워", value: 35 },
      { label: "스타", value: 30 },
      { label: "커밋", value: 25 },
      { label: "레포", value: 10 },
    ],
  },
  {
    name: "YouTube",
    color: "bg-red-950 border-red-800",
    badge: "연동 가능",
    badgeColor: "bg-green-600",
    metrics: ["구독자 수", "총 조회수", "평균 좋아요", "업로드 영상 수"],
    weights: [
      { label: "구독자", value: 40 },
      { label: "조회수", value: 35 },
      { label: "좋아요", value: 15 },
      { label: "영상수", value: 10 },
    ],
  },
  {
    name: "Instagram",
    color: "bg-purple-950 border-purple-800",
    badge: "예정",
    badgeColor: "bg-yellow-600",
    metrics: ["팔로워", "팔로잉", "게시물 수", "참여율"],
    weights: [],
  },
  {
    name: "치지직 / SOOP",
    color: "bg-blue-950 border-blue-800",
    badge: "예정",
    badgeColor: "bg-yellow-600",
    metrics: ["팔로워", "평균 시청자", "방송 횟수"],
    weights: [],
  },
  {
    name: "Naver 블로그",
    color: "bg-green-950 border-green-800",
    badge: "예정",
    badgeColor: "bg-yellow-600",
    metrics: ["방문자 수", "글 수", "이웃 수"],
    weights: [],
  },
];

const grades = [
  { grade: "S", range: "80 ~ 100", color: "text-yellow-400", desc: "상위 인플루언서급 영향력" },
  { grade: "A", range: "60 ~ 79", color: "text-green-400", desc: "활발한 크리에이터/기여자" },
  { grade: "B", range: "40 ~ 59", color: "text-blue-400", desc: "꾸준한 활동 중" },
  { grade: "C", range: "20 ~ 39", color: "text-orange-400", desc: "기초 활동 단계" },
  { grade: "D", range: "0 ~ 19", color: "text-red-400", desc: "활동 데이터 부족" },
];

const steps = [
  {
    step: "01",
    title: "계정 연결",
    desc: "로그인 화면에서 GitHub 또는 Google 계정으로 로그인합니다. 각 플랫폼의 공개 데이터에만 접근하며, 게시·수정 권한은 요청하지 않습니다.",
  },
  {
    step: "02",
    title: "데이터 수집",
    desc: "대시보드에서 '데이터 갱신' 버튼을 누르면 연결된 플랫폼에서 팔로워, 조회수 등의 메트릭을 수집합니다.",
  },
  {
    step: "03",
    title: "점수 산정",
    desc: "수집된 데이터를 로그 스케일로 정규화하여 0~100점 사이의 플랫폼별 점수를 계산하고, 전체 평균으로 종합 등급을 산정합니다.",
  },
  {
    step: "04",
    title: "가치 활용",
    desc: "산정된 점수는 협업·프로젝트 참여 시 기여도 기준으로 활용할 수 있습니다. 대시보드에서 플랫폼별 강점을 레이더 차트로 확인하세요.",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-400">Social Value</h1>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          대시보드로
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* 소개 */}
        <section className="text-center">
          <h2 className="text-4xl font-bold mb-4">Social Value 가이드</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            나의 SNS 활동을 데이터로 분석해 소셜 영향력을 수치화합니다.
            다양한 플랫폼의 메트릭을 종합하여 객관적인 가치 지수를 제공합니다.
          </p>
        </section>

        {/* 사용 방법 */}
        <section>
          <h3 className="text-2xl font-bold mb-6">사용 방법</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="text-4xl font-black text-indigo-500 opacity-40 mb-3">{s.step}</div>
                <h4 className="text-lg font-semibold mb-2">{s.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 등급 기준 */}
        <section>
          <h3 className="text-2xl font-bold mb-6">등급 기준</h3>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {grades.map((g, i) => (
              <div
                key={g.grade}
                className={`flex items-center gap-6 px-6 py-4 ${i !== grades.length - 1 ? "border-b border-gray-800" : ""}`}
              >
                <span className={`text-3xl font-black w-8 ${g.color}`}>{g.grade}</span>
                <span className="text-gray-400 text-sm w-24">{g.range}점</span>
                <span className="text-gray-300 text-sm">{g.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">
            * 점수는 로그 스케일 정규화 방식으로 계산되어 팔로워 수의 극단값 영향을 완화합니다.
          </p>
        </section>

        {/* 플랫폼별 메트릭 */}
        <section>
          <h3 className="text-2xl font-bold mb-6">플랫폼별 메트릭</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((p) => (
              <div key={p.name} className={`border rounded-2xl p-6 ${p.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">{p.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>
                <ul className="space-y-1 mb-4">
                  {p.metrics.map((m) => (
                    <li key={m} className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-500 rounded-full inline-block" />
                      {m}
                    </li>
                  ))}
                </ul>
                {p.weights.length > 0 && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-2">가중치</p>
                    {p.weights.map((w) => (
                      <div key={w.label} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-14">{w.label}</span>
                        <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${w.value}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{w.value}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="text-2xl font-bold mb-6">자주 묻는 질문</h3>
          <div className="space-y-3">
            {[
              {
                q: "개인정보는 안전한가요?",
                a: "OAuth를 통해 공개 데이터만 읽으며, 게시·수정 권한은 요청하지 않습니다. 수집된 데이터는 본인의 점수 산정에만 사용됩니다.",
              },
              {
                q: "점수는 실시간으로 업데이트되나요?",
                a: "자동 업데이트는 없으며, 대시보드의 '데이터 갱신' 버튼을 눌러 수동으로 최신 데이터를 가져올 수 있습니다.",
              },
              {
                q: "YouTube 채널이 없으면 어떻게 되나요?",
                a: "Google 계정으로 로그인해도 YouTube 채널이 없으면 해당 플랫폼 점수는 산정되지 않습니다. 채널이 있는 플랫폼의 점수만 종합 평균에 반영됩니다.",
              },
              {
                q: "점수 기준이 너무 낮게 나오는데요?",
                a: "기준값(GitHub 팔로워 max 10,000 등)은 일반 사용자 기준으로 설정되어 있습니다. 추후 업데이트를 통해 조정될 수 있습니다.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="font-medium text-white mb-2">Q. {faq.q}</p>
                <p className="text-gray-400 text-sm leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3 rounded-xl transition"
          >
            대시보드로 이동
          </Link>
        </div>
      </main>
    </div>
  );
}
