import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { MOCK_PARTIES } from "@/constants/constants";
import { PartyStatus } from "@/constants/types";

function PartyCard({ party }) {
  const isRecruiting = party.status === PartyStatus.RECRUITING;

  return (
    <div className="bg-white rounded-3xl border p-6 shadow hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img
            src={`https://picsum.photos/seed/${party.serviceName}/60/60`}
            className="w-12 h-12 rounded-xl"
            alt={`${party.serviceName} icon`}
          />
          <div>
            <h3 className="font-bold">{party.serviceName}</h3>
            <p className="text-sm text-gray-400">파티장: {party.hostName}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            isRecruiting
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {isRecruiting ? "모집중" : "마감"}
        </span>
      </div>

      <h4 className="font-bold text-gray-800 mb-2">{party.title}</h4>
      <p className="text-gray-500 text-sm mb-4">{party.description}</p>

      <Link
        to={`/parties/${party.id}`}
        className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
      >
        자세히 보기 <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function TrendingParties() {
  const visibleParties = MOCK_PARTIES.slice(0, 6);

  if (MOCK_PARTIES.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold text-gray-900 mb-6">지금 뜨는 파티</h2>
        <p className="text-gray-500">로딩 중...</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 pb-20">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-600 tracking-wider">
              TRENDING PARTIES
            </p>
            <h2 className="text-xl font-extrabold text-gray-900">
              지금 뜨는 파티
            </h2>
          </div>
          <Link
            to="/parties"
            className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold"
          >
            전체보기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {visibleParties.length === 0 ? (
          <p className="text-gray-500 px-6 py-10">로딩 중...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            {visibleParties.map((party) => (
              <div
                key={party.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_6px_16px_rgba(17,24,39,0.06)] hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://picsum.photos/seed/${party.serviceName}/64/64`}
                      className="w-12 h-12 rounded-xl object-cover"
                      alt="icon"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {party.serviceName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        파티장 {party.hostName}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      party.status === PartyStatus.RECRUITING
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {party.status === PartyStatus.RECRUITING
                      ? "모집중"
                      : "마감"}
                  </span>
                </div>
                <div className="p-5 space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">제목</span>
                    <span className="font-medium text-right line-clamp-1">
                      {party.title}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">요금</span>
                    <span className="font-bold text-brand-600">
                      {party.price?.toLocaleString() || 0}원
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">상세</span>
                    <span className="font-medium text-right line-clamp-2 max-w-[180px]">
                      {party.description}
                    </span>
                  </div>
                  <Link
                    to={`/parties/${party.id}`}
                    className="mt-2 inline-flex items-center justify-center w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                  >
                    자세히 보기
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
