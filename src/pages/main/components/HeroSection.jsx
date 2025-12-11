import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";

const MOCK_SUBSCRIPTION = {
  productName: "Netflix 프리미엄",
  status: "ACTIVE",
  price: 17000,
  startDate: "2024-01-02",
  nextBilling: "2024-06-02",
};

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-indigo-50/40 to-white py-20 px-4 overflow-hidden">
      <div className="absolute -left-10 -top-10 w-52 h-52 bg-indigo-200/40 rounded-full blur-3xl" />
      <div className="absolute right-0 top-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative">
        <div className="text-center lg:text-left max-w-2xl">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border text-indigo-700 font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            검증된 파티 매칭
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-gray-900">
            혼자 내면 부담,
            <br />
            <span className="text-indigo-600">같이 내면 반값!</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            GetSubscription 화면에서 보던 안정적인 카드 UI를 그대로 메인에서
            경험하세요. 실시간 검증된 파티와 구독 상품 정보를 한눈에 확인할 수
            있습니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/parties"
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-bold shadow-sm hover:bg-indigo-500 transition-all"
            >
              파티 찾기
            </Link>

            <Link
              to="/parties/create"
              className="px-8 py-3 bg-white text-indigo-700 border border-indigo-100 rounded-xl text-lg font-bold shadow-sm hover:bg-indigo-50 transition-all"
            >
              파티 만들기
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 실시간 매칭
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 안전 정산
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 24시간
              고객센터
            </span>
          </div>
        </div>

        <div className="w-full lg:w-[420px]">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 p-8 text-center border-b border-gray-100">
              <img
                src="https://picsum.photos/seed/netflix/120/120"
                className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-sm"
                alt="Netflix"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {MOCK_SUBSCRIPTION.productName}
              </h2>
              <span
                className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                  MOCK_SUBSCRIPTION.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {MOCK_SUBSCRIPTION.status === "ACTIVE" ? "이용중" : "해지됨"}
              </span>
            </div>

            <div className="p-8 space-y-5">
              <div className="flex justify-between py-3 border-b border-gray-100 text-gray-700">
                <span className="text-gray-500">요금제</span>
                <span className="font-medium">프리미엄 4인</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 text-gray-700">
                <span className="text-gray-500">가격</span>
                <span className="font-bold text-brand-600">
                  {MOCK_SUBSCRIPTION.price.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 text-gray-700">
                <span className="text-gray-500">시작일</span>
                <span className="font-medium">
                  {MOCK_SUBSCRIPTION.startDate}
                </span>
              </div>
              <div className="flex justify-between py-3 text-gray-700">
                <span className="text-gray-500">다음 결제일</span>
                <span className="font-medium">
                  {MOCK_SUBSCRIPTION.nextBilling}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                  옵션 변경
                </button>
                <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors">
                  구독 해지
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
