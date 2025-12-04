import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Wallet, ChevronRight } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";
import { PartyStatus } from "@/constants/types";

export default function MainPage() {
  return (
    <div className="w-full pb-20">
      {/* HERO 영역 */}
      <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* 왼쪽 텍스트 */}
          <div className="text-center md:text-left max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              혼자 내면 부담,
              <br />
              <span className="text-white drop-shadow-lg">같이 내면 반값!</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              모든 OTT를 저렴하게 함께 이용하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/parties"
                className="px-8 py-3 bg-white text-indigo-600 rounded-xl text-lg font-bold shadow hover:bg-indigo-50 transition-all"
              >
                파티 찾기
              </Link>

              <Link
                to="/parties/create"
                className="px-8 py-3 bg-white/20 text-white border border-white rounded-xl text-lg font-bold backdrop-blur hover:bg-white/30 transition-all"
              >
                파티 만들기
              </Link>
            </div>
          </div>

          {/* 오른쪽 카드 비주얼 */}
          <div className="hidden md:block relative w-96 h-96">
            <div className="absolute top-0 right-10 bg-white p-4 rounded-2xl shadow-xl transform rotate-6">
              <img
                src="https://picsum.photos/id/1/60/60"
                className="w-12 h-12 rounded-xl mb-2"
                alt="Netflix"
              />
            </div>
            <div className="absolute left-10 bottom-10 bg-white p-4 rounded-2xl shadow-xl transform -rotate-3">
              <img
                src="https://picsum.photos/id/4/60/60"
                className="w-12 h-12 rounded-xl mb-2"
                alt="Youtube"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 섹션 */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              약속 걱정 NO
            </h3>
            <p className="text-gray-500">
              파티원 제공 정보는 100% 검증 후 매칭됩니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">즉시 매칭</h3>
            <p className="text-gray-500">가입 즉시 매칭! 실시간 정보 반영.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">자동 정산</h3>
            <p className="text-gray-500">매월 자동 정산되어 편리하게 이용.</p>
          </div>
        </div>
      </section>

      {/* 지금 뜨는 파티 */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold text-gray-900 mb-6">지금 뜨는 파티</h2>

        {MOCK_PARTIES.length === 0 ? (
          <p className="text-gray-500">로딩 중...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_PARTIES.slice(0, 3).map((party) => (
              <div
                key={party.id}
                className="bg-white rounded-3xl border p-6 shadow hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://picsum.photos/seed/${party.serviceName}/60/60`}
                      className="w-12 h-12 rounded-xl"
                      alt="icon"
                    />
                    <div>
                      <h3 className="font-bold">{party.serviceName}</h3>
                      <p className="text-sm text-gray-400">
                        파티장: {party.hostName}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      party.status === PartyStatus.RECRUITING
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {party.status === PartyStatus.RECRUITING
                      ? "모집중"
                      : "마감"}
                  </span>
                </div>

                <h4 className="font-bold text-gray-800 mb-2">{party.title}</h4>
                <p className="text-gray-500 text-sm mb-4">
                  {party.description}
                </p>

                <Link
                  to={`/parties/${party.id}`}
                  className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                >
                  자세히 보기 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
