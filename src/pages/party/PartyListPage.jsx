import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import ServiceTypeFilter from "../../components/party/ServiceTypeFilter";
import {
  Sparkles,
  Search,
  Calendar,
  Users,
  X,
  ChevronDown,
  ArrowRight,
  Shield,
  Zap,
  Filter,
} from "lucide-react";


// Animated Background Gradient (from Variant T)
const AnimatedGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(99, 91, 255, 0.06) 0%, transparent 70%)",
        top: "-200px",
        right: "-100px",
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.7, 0.5],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%)",
        bottom: "-100px",
        left: "-50px",
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Grid Pattern Background
const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
    <svg width="100%" height="100%">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

export default function PartyListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const observerTarget = useRef(null);
  const isFirstRender = useRef(true);
  const observerEnabled = useRef(false);

  // Zustand Store
  const {
    parties: list,
    myParties,
    loading: { parties: loadingParties, myParties: loadingMyParties },
    hasMore,
    loadParties,
    loadMyParties
  } = usePartyStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const myPartyIds = Array.isArray(myParties) ? myParties.map(p => p.partyId) : [];
  const isInitialLoading = loadingParties && list.length === 0;

  // 페이지 마운트 시 스크롤 위치 초기화 및 Observer 지연 활성화
  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      observerEnabled.current = true;
    }, 500);

    return () => {
      clearTimeout(timer);
      observerEnabled.current = false;
    };
  }, []);

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 필터 변경 시 리스트 초기화 및 재검색
  useEffect(() => {
    if (!isFirstRender.current) {
      window.scrollTo(0, 0);
    }
    isFirstRender.current = false;

    const params = {
      keyword: debouncedQuery,
      partyStatus: selectedStatus || null,
      productId: selectedProductId || null,
      startDate: startDate || null,
      sort: sortBy
    };
    loadParties(params, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, selectedStatus, selectedProductId, startDate, sortBy]);

  // 내 파티 로드
  useEffect(() => {
    if (user) {
      loadMyParties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 무한 스크롤 Observer
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (observerEnabled.current && target.isIntersecting && hasMore && !loadingParties) {
      const params = {
        keyword: debouncedQuery,
        partyStatus: selectedStatus || null,
        productId: selectedProductId || null,
        startDate: startDate || null,
        sort: sortBy
      };
      loadParties(params, false);
    }
  }, [hasMore, loadingParties, debouncedQuery, selectedStatus, selectedProductId, startDate, sortBy, loadParties]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  const getStatusBadge = (party) => {
    const { partyStatus, maxMembers, currentMembers } = party;
    const remainingSlots = (maxMembers || 0) - (currentMembers || 0);

    if (partyStatus === 'RECRUITING' && remainingSlots === 1) {
      return {
        bg: "bg-gradient-to-r from-orange-500 to-red-500",
        text: "마감임박",
        pulse: true,
      };
    }

    const badges = {
      RECRUITING: {
        bg: "bg-[#635bff]",
        text: "모집중",
      },
      ACTIVE: {
        bg: "bg-emerald-500",
        text: "파티중",
      },
      PENDING_PAYMENT: {
        bg: "bg-amber-500",
        text: "결제대기",
      },
      CLOSED: {
        bg: "bg-gray-400",
        text: "파티종료",
      },
    };
    return badges[partyStatus] || badges.RECRUITING;
  };

  const formatDate = (dateData) => {
    if (!dateData) return "-";

    if (Array.isArray(dateData)) {
      const [year, month, day] = dateData;
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    }

    const date = new Date(dateData);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section - Variant T Style */}
      <section className="relative overflow-hidden bg-white">
        <AnimatedGradient />
        <GridPattern />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#635bff]/10 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#635bff]" />
              <span className="text-sm font-semibold text-[#635bff]">
                OTT 구독 비용, 최대 75% 절약
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]"
            >
              함께 나누면
              <br />
              <span className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] bg-clip-text text-transparent">
                더 저렴하게
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-xl mx-auto"
            >
              Netflix, Disney+, Wavve 등 프리미엄 OTT 서비스를
              <br className="hidden sm:block" />
              안전하고 저렴하게 이용하세요
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/party/create")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#635bff] hover:bg-[#5851e8] text-white font-semibold rounded-full shadow-lg shadow-[#635bff]/25 transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                파티 만들기
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>안전한 결제</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>즉시 이용</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Bar */}
        <div className="sticky top-20 z-30 my-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100">
            {/* Search Input */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-10 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all duration-200"
                placeholder="파티 이름, 방장 닉네임 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-col gap-4">
              {/* Status Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-400 mr-1" />
                {[
                  { value: "", label: "전체" },
                  { value: "RECRUITING", label: "모집중" },
                  { value: "ACTIVE", label: "파티중" },
                  { value: "CLOSED", label: "파티종료" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedStatus(filter.value)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${selectedStatus === filter.value
                      ? "bg-[#635bff] text-white shadow-md shadow-[#635bff]/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Additional Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <ServiceTypeFilter
                  selectedProductId={selectedProductId}
                  onSelect={setSelectedProductId}
                />

                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 text-sm font-medium rounded-full pl-4 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all cursor-pointer"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative ml-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-10 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] cursor-pointer transition-all"
                  >
                    <option value="latest">최신순</option>
                    <option value="start_date_asc">시작 빠른순</option>
                    <option value="popularity">인기순</option>
                    <option value="price_low">가격 낮은순</option>
                    <option value="price_high">가격 높은순</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parties Grid */}
        {isInitialLoading ? (
          // Shimmer Loading - Variant T Style
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-50" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-100 rounded-lg w-1/3" />
                  <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                  <div className="h-6 bg-gray-100 rounded-lg w-2/5 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          // Empty State - Variant T Style
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-[#635bff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-[#635bff]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              조건에 맞는 파티가 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              다른 검색어나 필터를 시도해보세요
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("");
                setSelectedProductId(null);
                setStartDate("");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#635bff] text-white font-semibold rounded-full hover:bg-[#5851e8] transition-colors"
            >
              필터 초기화
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {list.map((party) => {
              const badge = getStatusBadge(party);
              const isMyParty = myPartyIds.includes(party.partyId);
              const isLeader = user?.userId === party.partyLeaderId;
              const remainingSlots = (party.maxMembers || 4) - (party.currentMembers || 0);

              return (
                <motion.div
                  key={party.partyId}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => {
                    if (!user) {
                      if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
                        navigate("/login");
                      }
                      return;
                    }
                    navigate(`/party/${party.partyId}`);
                  }}
                  className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:border-gray-200 transition-all duration-300"
                >
                  {/* Service Banner */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    {party.productImage ? (
                      <img
                        src={party.productImage}
                        alt={party.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-[#635bff] flex items-center justify-center text-white text-3xl font-black shadow-lg">
                        {party.productName?.[0]}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`${badge.bg} ${badge.pulse ? 'animate-pulse' : ''} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg`}>
                        {badge.text}
                      </span>
                    </div>

                    {/* My Party Badge */}
                    {(isLeader || isMyParty) && (
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${isLeader
                          ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white"
                          : "bg-white text-[#635bff]"
                          }`}>
                          {isLeader ? "파티장" : "참여중"}
                        </span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#635bff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Service Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-[#635bff] bg-[#635bff]/10 px-2.5 py-1 rounded-full">
                        {party.productName}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-[#635bff] transition-colors">
                      {party.title || `${party.productName} 파티`}
                    </h3>

                    {/* Info Row */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(party.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{party.currentMembers || 0}/{party.maxMembers || 4}</span>
                        {remainingSlots <= 2 && remainingSlots > 0 && (
                          <span className="text-xs text-orange-500 font-semibold">
                            ({remainingSlots}자리)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">월 구독료</span>
                      <div className="text-right">
                        <span className="text-xl font-black text-gray-900">
                          {party.monthlyFee?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">원</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Infinite Scroll Loader */}
        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
          {loadingParties && !isInitialLoading && (
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-[#635bff] rounded-full animate-spin" />
              <span className="text-sm font-medium">더 불러오는 중...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
