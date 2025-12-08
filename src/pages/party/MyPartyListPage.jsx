import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyParties } from "../../api/partyApi";
import { fetchCurrentUser } from "../../api/authApi";
import {
  Users,
  Crown,
  TrendingUp,
  Calendar,
  Sparkles,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";

export default function MyPartyListPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadUserAndParties();
  }, []);

  const loadUserAndParties = async () => {
    try {
      const userResponse = await fetchCurrentUser();
      if (userResponse.success && userResponse.data) {
        setCurrentUserId(userResponse.data.userId);
      }

      await loadMyParties();
    } catch (error) {
      console.error("Failed to load user or parties", error);
      setLoading(false);
    }
  };

  const loadMyParties = async () => {
    try {
      const response = await getMyParties();
      if (response.success && response.data) {
        setList(response.data);
      } else {
        setList([]);
      }
    } catch (error) {
      console.error("Failed to load my parties", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: list.length,
    asLeader: list.filter((p) => p.partyLeaderId === currentUserId).length,
    asMember: list.filter((p) => p.partyLeaderId !== currentUserId).length,
    active: list.filter((p) => p.partyStatus === "ACTIVE").length,
    recruiting: list.filter((p) => p.partyStatus === "RECRUITING").length,
  };

  const getStatusBadge = (status) => {
    const badges = {
      RECRUITING: {
        bg: "bg-emerald-500",
        text: "모집중",
        icon: "✨",
      },
      ACTIVE: {
        bg: "bg-blue-500",
        text: "진행중",
        icon: "🚀",
      },
      PENDING_PAYMENT: {
        bg: "bg-amber-500",
        text: "결제대기",
        icon: "⏳",
      },
      CLOSED: {
        bg: "bg-stone-500",
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
            파티 목록 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-orange-950 to-stone-900 text-white relative overflow-hidden">
        {/* Blob animations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#fff7ed] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                내 파티 대시보드
              </h1>
              <p className="text-xl text-stone-300 font-medium">
                참여 중인 파티를 한눈에 확인하세요
              </p>
            </div>
            <button
              onClick={() => navigate("/party/create")}
              className="flex items-center gap-2 px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-2xl font-bold transition-all duration-200 hover:translate-y-1 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              새 파티 만들기
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {list.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Parties */}
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center shadow">
                  <Users className="w-6 h-6 text-[#ea580c]" />
                </div>
                <span className="text-3xl font-black text-gray-900">
                  {stats.total}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-600">전체 파티</p>
            </div>

            {/* As Leader */}
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center shadow">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-3xl font-black text-gray-900">
                  {stats.asLeader}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-600">파티장</p>
            </div>

            {/* Active Parties */}
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center shadow">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-3xl font-black text-gray-900">
                  {stats.active}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-600">진행 중</p>
            </div>

            {/* Recruiting */}
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center shadow">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-3xl font-black text-gray-900">
                  {stats.recruiting}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-600">모집 중</p>
            </div>
          </div>
        </div>
      )}

      {/* Parties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {list.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-xl border border-stone-200">
              <Sparkles className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <p className="text-xl text-stone-900 font-extrabold mb-2">
                가입한 파티가 없습니다
              </p>
              <p className="text-stone-500 mb-6">
                새로운 파티를 만들거나 참여해보세요!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate("/party")}
                  className="px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-200 hover:translate-y-1"
                >
                  파티 찾아보기
                </button>
                <button
                  onClick={() => navigate("/party/create")}
                  className="px-6 py-3 bg-white border-2 border-[#ea580c] text-[#ea580c] rounded-2xl font-bold hover:bg-[#fff7ed] transition-all duration-200"
                >
                  파티 만들기
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Leader Parties Section */}
            {stats.asLeader > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-2xl font-black text-gray-900">
                    내가 방장인 파티
                  </h2>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                    {stats.asLeader}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list
                    .filter((item) => item.partyLeaderId === currentUserId)
                    .map((item) => {
                      const badge = getStatusBadge(item.partyStatus);
                      // monthlyFee는 이미 인당 금액으로 저장됨
                      const perPersonFee = item.monthlyFee;

                      return (
                        <Link
                          key={item.partyId}
                          to={`/party/${item.partyId}`}
                          className="group relative"
                        >
                          <div className="relative h-full bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200 hover:translate-y-1">
                            <div className="relative p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span
                                      className={`inline-flex items-center gap-1 px-3 py-1 ${badge.bg} text-white text-xs font-bold rounded-full`}
                                    >
                                      {badge.icon} {badge.text}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                      <Crown className="w-3 h-3" /> 파티장
                                    </span>
                                  </div>
                                  <h3 className="text-xl font-black text-gray-900 group-hover:text-[#ea580c] transition-colors">
                                    {item.productName}
                                  </h3>
                                </div>
                              </div>

                              <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-stone-600">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                      멤버
                                    </span>
                                  </div>
                                  <span className="font-bold text-gray-900">
                                    {item.currentMembers}/{item.maxMembers}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-stone-100 rounded-2xl p-4">
                                <p className="text-sm text-stone-600 mb-1">
                                  인당 월 구독료
                                </p>
                                <p className="text-2xl font-extrabold text-gray-900">
                                  {perPersonFee.toLocaleString()}
                                  <span className="text-sm text-stone-600 font-normal ml-1">
                                    원
                                  </span>
                                </p>
                              </div>

                              <div className="mt-4 flex items-center justify-end text-[#ea580c] group-hover:text-[#c2410c] font-bold text-sm">
                                <span>상세 보기</span>
                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Member Parties Section */}
            {stats.asMember > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-black text-gray-900">
                    참여 중인 파티
                  </h2>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
                    {stats.asMember}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list
                    .filter((item) => item.partyLeaderId !== currentUserId)
                    .map((item) => {
                      const badge = getStatusBadge(item.partyStatus);
                      // monthlyFee는 이미 인당 금액으로 저장됨
                      const perPersonFee = item.monthlyFee;

                      return (
                        <Link
                          key={item.partyId}
                          to={`/party/${item.partyId}`}
                          className="group relative"
                        >
                          <div className="relative h-full bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200 hover:translate-y-1">
                            <div className="relative p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span
                                      className={`inline-flex items-center gap-1 px-3 py-1 ${badge.bg} text-white text-xs font-bold rounded-full`}
                                    >
                                      {badge.icon} {badge.text}
                                    </span>
                                  </div>
                                  <h3 className="text-xl font-black text-gray-900 group-hover:text-[#ea580c] transition-colors">
                                    {item.productName}
                                  </h3>
                                  <p className="text-sm text-stone-600 mt-1">
                                    방장: {item.leaderNickname}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-stone-600">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                      멤버
                                    </span>
                                  </div>
                                  <span className="font-bold text-gray-900">
                                    {item.currentMembers}/{item.maxMembers}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-stone-100 rounded-2xl p-4">
                                <p className="text-sm text-stone-600 mb-1">
                                  내 월 구독료
                                </p>
                                <p className="text-2xl font-extrabold text-gray-900">
                                  {perPersonFee.toLocaleString()}
                                  <span className="text-sm text-stone-600 font-normal ml-1">
                                    원
                                  </span>
                                </p>
                              </div>

                              <div className="mt-4 flex items-center justify-end text-[#ea580c] group-hover:text-[#c2410c] font-bold text-sm">
                                <span>상세 보기</span>
                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
