import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchPartyList, fetchMyParties } from "../../hooks/party/partyService";
import {
  Sparkles,
  Users,
  Calendar,
  TrendingUp,
  Search,
  Eye,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function PartyListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [list, setList] = useState([]);
  const [myPartyIds, setMyPartyIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    loadParties();
    if (user) {
      loadMyParties();
    }
  }, [user]);

  const loadMyParties = async () => {
    try {
      const data = await fetchMyParties();
      if (data && Array.isArray(data)) {
        setMyPartyIds(data.map((p) => p.partyId));
      }
    } catch (error) {
      console.error("Failed to load my parties", error);
    }
  };

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
        bg: "bg-[#ffedd5] text-[#c2410c]",
        text: "모집중",
        icon: "✨",
      },
      ACTIVE: {
        bg: "bg-emerald-100 text-emerald-700",
        text: "진행중",
        icon: "🚀",
      },
      PENDING_PAYMENT: {
        bg: "bg-amber-100 text-amber-700",
        text: "결제대기",
        icon: "⏳",
      },
      CLOSED: {
        bg: "bg-stone-100 text-stone-500",
        text: "종료",
        icon: "🔒",
      },
    };
    return badges[status] || badges.RECRUITING;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#ea580c] border-t-transparent"></div>
          <p className="mt-4 text-lg text-stone-600 font-medium">
            파티 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Header */}
      <div className="bg-stone-900 text-white relative overflow-hidden">
        {/* Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950 to-stone-900 opacity-90"></div>
        {/* Blob Animations */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#fff7ed] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
              <span className="inline-block animate-pulse">🎉</span> 파티 찾기
            </h1>
            <p className="text-xl md:text-2xl text-[#ffedd5] font-medium mb-8">
              함께 나누면 더 저렴해요. 지금 파티에 참여하세요!
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-white rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2 flex items-center gap-2">
                  <Search className="w-6 h-6 text-stone-400 ml-3" />
                  <input
                    type="text"
                    placeholder="서비스 이름으로 검색 (예: Netflix, YouTube Premium...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent text-stone-900 placeholder-stone-500 outline-none text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
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
                className={`px-6 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-200 ${
                  filterStatus === filter.value
                    ? "bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5] shadow-lg scale-105"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
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
              <Sparkles className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <p className="text-xl text-stone-600 font-medium mb-2">
                {searchQuery
                  ? "검색 결과가 없습니다"
                  : "모집중인 파티가 없습니다"}
              </p>
              <p className="text-stone-500">
                {searchQuery
                  ? "다른 검색어로 시도해보세요"
                  : "지금 바로 새로운 파티를 만들어보세요!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate("/party/create")}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white rounded-2xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
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
              // monthlyFee는 이미 인당 금액으로 저장됨
              const perPersonFee = party.monthlyFee;
              // 총 금액 계산 (인당 금액 * 최대 인원)
              const totalFee = perPersonFee * party.maxMembers;
              const isFull = party.currentMembers >= party.maxMembers;
              const availableSlots = party.maxMembers - party.currentMembers;
              // 내가 참여 중인 파티인지 확인
              const isMyParty = myPartyIds.includes(party.partyId);

              return (
                <Link
                  key={party.partyId}
                  to={`/party/${party.partyId}`}
                  className="group relative"
                >
                  {/* Card Container */}
                  <div className="relative h-full bg-white rounded-3xl border border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#fff7ed] to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content */}
                    <div className="relative p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 ${badge.bg} text-xs font-bold rounded-full`}
                            >
                              {badge.icon} {badge.text}
                            </span>
                            {party.currentMembers > 0 && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-700 text-xs font-bold rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                인기
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-black text-stone-900 group-hover:text-[#ea580c] transition-colors">
                            {party.productName}
                          </h3>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-stone-600">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">인원</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {[...Array(party.currentMembers)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-7 h-7 rounded-full bg-stone-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                >
                                  {i + 1}
                                </div>
                              ))}
                              {[...Array(availableSlots)].map((_, i) => (
                                <div
                                  key={`empty-${i}`}
                                  className="w-7 h-7 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center"
                                >
                                  <span className="text-stone-400 text-xs">
                                    +
                                  </span>
                                </div>
                              ))}
                            </div>
                            <span className="font-bold text-stone-900">
                              {party.currentMembers}/{party.maxMembers}
                            </span>
                          </div>
                        </div>

                        {party.startDate && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-stone-600">
                              <Calendar className="w-5 h-5" />
                              <span className="font-medium">시작일</span>
                            </div>
                            <span className="font-semibold text-stone-900">
                              {party.startDate}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="bg-gradient-to-r from-stone-50 to-stone-100 rounded-2xl p-4 mb-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-sm text-stone-600 mb-1">
                              인당 월 구독료
                            </p>
                            <p className="text-3xl font-black text-stone-900">
                              {perPersonFee.toLocaleString()}
                              <span className="text-lg text-stone-600 font-normal ml-1">
                                원
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-stone-500 line-through">
                              {totalFee.toLocaleString()}원
                            </p>
                            <p className="text-sm font-bold text-[#ea580c]">
                              {Math.round(
                                ((totalFee - perPersonFee) / totalFee) * 100
                              )}
                              % 할인
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        className={`w-full py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                          isMyParty
                            ? "bg-stone-700 text-white hover:bg-stone-800"
                            : isFull
                            ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white hover:shadow-lg hover:scale-[1.02]"
                        }`}
                        disabled={isFull && !isMyParty}
                      >
                        {isMyParty ? (
                          <>
                            <Eye className="w-4 h-4" />
                            파티 보기
                          </>
                        ) : isFull ? (
                          "모집 마감"
                        ) : (
                          "파티 참여하기"
                        )}
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
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200 group z-50"
      >
        <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
