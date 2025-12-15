import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getMyParties } from "../../api/partyApi";
import { fetchCurrentUser } from "../../api/authApi";
import {
  useTheme,
  ThemeSwitcher,
  ThemeBackground,
  ThemeMarquee,
  themeConfig
} from "../../config/themeConfig";
import {
  Users,
  Crown,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowRight,
  Activity,
  LayoutGrid,
} from "lucide-react";

export default function MyPartyListPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Theme
  const { theme, setTheme, currentTheme } = useTheme("appTheme");

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} pb-20 transition-colors duration-300`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Pop Theme Marquee */}
      <ThemeMarquee theme={theme} />

      {/* Hero Header */}
      <div className={`relative overflow-hidden ${theme === "dark" ? "bg-[#0B1120]" : theme === "pop" ? "bg-slate-50" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        }`}>
        <ThemeBackground theme={theme} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight flex items-center gap-3 ${currentTheme.text}`}>
                <LayoutGrid className={`w-8 h-8 md:w-10 md:h-10 ${theme === "pop" ? "text-pink-500" : "text-blue-600"}`} />
                내 파티
              </h1>
              <p className={`text-base md:text-lg ${currentTheme.subtext}`}>
                참여 중인 파티를 한눈에 확인하세요
              </p>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/party/create")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all shadow-lg ${theme === "pop"
                  ? "bg-pink-500 text-white border-4 border-black rounded-2xl"
                  : "bg-slate-900 hover:bg-slate-800 text-white rounded-lg"
                }`}
            >
              <Plus className="w-5 h-5" />
              새 파티 만들기
            </motion.button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {list.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Parties */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  {stats.total}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">전체 파티</p>
            </div>

            {/* As Leader */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  {stats.asLeader}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">파티장</p>
            </div>

            {/* Active Parties */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  {stats.active}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">진행 중</p>
            </div>

            {/* Recruiting */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  {stats.recruiting}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">모집 중</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Parties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {list.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-block p-8 bg-white rounded-xl border border-slate-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-xl text-slate-900 font-bold mb-2">
                가입한 파티가 없습니다
              </p>
              <p className="text-slate-500 mb-6">
                새로운 파티를 만들거나 참여해보세요!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate("/party")}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all"
                >
                  파티 찾아보기
                </button>
                <button
                  onClick={() => navigate("/party/create")}
                  className="px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  파티 만들기
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Leader Parties Section */}
            {stats.asLeader > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    내가 파티장인 파티
                  </h2>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                    {stats.asLeader}
                  </span>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {list
                    .filter((item) => item.partyLeaderId === currentUserId)
                    .map((item) => {
                      const badge = getStatusBadge(item.partyStatus);
                      const perPersonFee = item.monthlyFee;

                      return (
                        <motion.div key={item.partyId} variants={itemVariants}>
                          <Link
                            to={`/party/${item.partyId}`}
                            className="group block"
                          >
                            <div className="relative h-full bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1">
                              <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                      <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 ${badge.bg} text-white text-xs font-bold rounded-md`}
                                      >
                                        {badge.text}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-md">
                                        <Crown className="w-3 h-3" /> 파티장
                                      </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                      {item.productName}
                                    </h3>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mb-4 text-sm">
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <Users className="w-4 h-4" />
                                    <span>멤버</span>
                                  </div>
                                  <span className="font-bold text-slate-900">
                                    {item.currentMembers}/{item.maxMembers}
                                  </span>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                                  <p className="text-xs text-slate-500 mb-1">
                                    인당 월 구독료
                                  </p>
                                  <p className="text-xl font-bold text-slate-900">
                                    {perPersonFee.toLocaleString()}
                                    <span className="text-sm text-slate-500 font-medium ml-1">
                                      원
                                    </span>
                                  </p>
                                </div>

                                <div className="mt-4 flex items-center justify-end text-blue-600 group-hover:text-blue-700 font-semibold text-sm">
                                  <span>상세 보기</span>
                                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                </motion.div>
              </div>
            )}

            {/* Member Parties Section */}
            {stats.asMember > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    참여 중인 파티
                  </h2>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                    {stats.asMember}
                  </span>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {list
                    .filter((item) => item.partyLeaderId !== currentUserId)
                    .map((item) => {
                      const badge = getStatusBadge(item.partyStatus);
                      const perPersonFee = item.monthlyFee;

                      return (
                        <motion.div key={item.partyId} variants={itemVariants}>
                          <Link
                            to={`/party/${item.partyId}`}
                            className="group block"
                          >
                            <div className="relative h-full bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1">
                              <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                      <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 ${badge.bg} text-white text-xs font-bold rounded-md`}
                                      >
                                        {badge.text}
                                      </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                      {item.productName}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                      파티장: {item.leaderNickname}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mb-4 text-sm">
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <Users className="w-4 h-4" />
                                    <span>멤버</span>
                                  </div>
                                  <span className="font-bold text-slate-900">
                                    {item.currentMembers}/{item.maxMembers}
                                  </span>
                                </div>

                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                                  <p className="text-xs text-slate-500 mb-1">
                                    내 월 구독료
                                  </p>
                                  <p className="text-xl font-bold text-slate-900">
                                    {perPersonFee.toLocaleString()}
                                    <span className="text-sm text-slate-500 font-medium ml-1">
                                      원
                                    </span>
                                  </p>
                                </div>

                                <div className="mt-4 flex items-center justify-end text-purple-600 group-hover:text-purple-700 font-semibold text-sm">
                                  <span>상세 보기</span>
                                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
