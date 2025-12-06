import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchPartyList } from "../../services/partyService";
import { Sparkles, Users, Calendar, TrendingUp, Search } from "lucide-react";

export default function PartyListPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    loadParties();
  }, []);

  const loadParties = async () => {
    try {
      setLoading(true);
      const data = await fetchPartyList();
      setList(data || []);
    } catch (error) {
      console.error("Failed to load parties", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParties = list.filter((party) => {
    const matchesSearch = party.productName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus
      ? party.partyStatus === filterStatus
      : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      RECRUITING: {
        bg: "bg-gradient-to-r from-emerald-500 to-teal-500",
        text: "모집중",
        icon: "✨",
      },
      ACTIVE: {
        bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
        text: "진행중",
        icon: "🚀",
      },
      PENDING_PAYMENT: {
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        text: "결제대기",
        icon: "⏳",
      },
      CLOSED: {
        bg: "bg-gradient-to-r from-gray-500 to-slate-500",
        text: "종료",
        icon: "🔒",
      },
    };
    return badges[status] || badges.RECRUITING;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">
            파티 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
              <span className="inline-block animate-pulse">🎉</span> 파티 찾기
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 font-medium mb-8">
              함께 나누면 더 저렴해요. 지금 파티에 참여하세요!
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-white rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2 flex items-center gap-2">
                  <Search className="w-6 h-6 text-gray-400 ml-3" />
                  <input
                    type="text"
                    placeholder="서비스 이름으로 검색 (예: Netflix, YouTube Premium...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {[
              { value: "", label: "전체", emoji: "📋" },
              { value: "RECRUITING", label: "모집중", emoji: "✨" },
              { value: "ACTIVE", label: "진행중", emoji: "🚀" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ${
                  filterStatus === filter.value
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">{filter.emoji}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Parties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredParties.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-xl">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 font-medium mb-2">
                {searchQuery
                  ? "검색 결과가 없습니다"
                  : "모집중인 파티가 없습니다"}
              </p>
              <p className="text-gray-500">
                {searchQuery
                  ? "다른 검색어로 시도해보세요"
                  : "지금 바로 새로운 파티를 만들어보세요!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate("/party/create")}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  파티 만들기
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredParties.map((party) => {
              const badge = getStatusBadge(party.partyStatus);
              const perPersonFee = Math.floor(
                party.monthlyFee / party.maxMembers
              );
              const isFull = party.currentMembers >= party.maxMembers;
              const availableSlots = party.maxMembers - party.currentMembers;

              return (
                <Link
                  key={party.partyId}
                  to={`/party/${party.partyId}`}
                  className="group relative"
                >
                  {/* Card Container */}
                  <div className="relative h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content */}
                    <div className="relative p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 ${badge.bg} text-white text-xs font-bold rounded-full`}
                            >
                              {badge.icon} {badge.text}
                            </span>
                            {party.currentMembers > 0 && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                인기
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {party.productName}
                          </h3>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">인원</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                              {[...Array(party.currentMembers)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                >
                                  {i + 1}
                                </div>
                              ))}
                              {[...Array(availableSlots)].map((_, i) => (
                                <div
                                  key={`empty-${i}`}
                                  className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                                >
                                  <span className="text-gray-400 text-xs">
                                    +
                                  </span>
                                </div>
                              ))}
                            </div>
                            <span className="font-bold text-gray-900">
                              {party.currentMembers}/{party.maxMembers}
                            </span>
                          </div>
                        </div>

                        {party.startDate && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-5 h-5" />
                              <span className="font-medium">시작일</span>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {party.startDate}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              월 구독료
                            </p>
                            <p className="text-3xl font-black text-gray-900">
                              {perPersonFee.toLocaleString()}
                              <span className="text-lg text-gray-600 font-normal ml-1">
                                원
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 line-through">
                              {party.monthlyFee.toLocaleString()}원
                            </p>
                            <p className="text-sm font-bold text-indigo-600">
                              {Math.round(
                                ((party.monthlyFee - perPersonFee) /
                                  party.monthlyFee) *
                                  100
                              )}
                              % 할인
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${
                          isFull
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02]"
                        }`}
                        disabled={isFull}
                      >
                        {isFull ? "모집 마감" : "파티 참여하기"}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => navigate("/party/create")}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200 group z-50"
      >
        <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
