import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import { requestBillingAuth } from "../../utils/paymentHandler";
import { getMyCard, issueBillingKey } from "../../api/userApi";
import { joinParty } from "../../api/partyApi";
import LeavePartyWarningModal from "../../components/party/LeavePartyWarningModal";
import UpdateOttModal from "../../components/party/UpdateOttModal";
import RippleButton from "../../components/party/RippleButton";
import { fetchPartyMembers, leaveParty } from "../../hooks/party/partyService";
import {
  useTheme,
  Sticker,
  themeConfig
} from "../../config/themeConfig";
import { getStatusBadge, formatDate } from "../../utils/partyUtils";
import { getProductIconUrl } from "../../utils/imageUtils";
import {
  Eye,
  EyeOff,
  Users,
  Calendar,
  Crown,
  ArrowLeft,
  Lock,
  Check,
  Sparkles,
  TrendingDown,
  Shield,
  ArrowRight,
  CreditCard
} from "lucide-react";

export default function PartyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, fetchSession } = useAuthStore();

  // Theme
  const { theme, setTheme, currentTheme } = useTheme("appTheme");

  // 테마별 악센트 색상
  const accentColor = currentTheme.accent;

  // Zustand Store
  const {
    currentParty: party,
    loading,
    loadPartyDetail,
  } = usePartyStore();

  const [members, setMembers] = useState([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isOttModalOpen, setIsOttModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [showOttInfo, setShowOttInfo] = useState(false);

  // 카드 상태 관리
  const [savedCard, setSavedCard] = useState(null);
  const [cardLoading, setCardLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    loadPartyDetail(id);
    loadMembers();
    // 사용자 정보 갱신 (빌링키 등록 여부 최신 상태 반영)
    if (user) {
      fetchSession();
      // 사용자 카드 정보 조회
      setCardLoading(true);
      getMyCard()
        .then(res => {
          if (res?.success && res.data) {
            setSavedCard(res.data);
          } else {
            setSavedCard(null);
          }
        })
        .catch(() => setSavedCard(null))
        .finally(() => setCardLoading(false));
    } else {
      setCardLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadMembers = async () => {
    try {
      const data = await fetchPartyMembers(id);
      setMembers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 새 카드 등록 후 가입 플로우
  const handleJoinWithNewCard = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      // 빌링키 등록 성공 후 리다이렉트될 때 파티 가입을 위한 정보 저장
      localStorage.setItem("afterBillingRedirect", `/party/${id}`);
      localStorage.setItem("billingRegistrationReason", "party_join_new_flow");
      localStorage.setItem("pendingPartyJoin", JSON.stringify({
        partyId: id,
        amount: party.monthlyFee * 2
      }));
      // 토스페이먼츠 빌링 인증 창 호출 (customerKey = userId)
      await requestBillingAuth(user.userId);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("afterBillingRedirect");
      localStorage.removeItem("billingRegistrationReason");
      localStorage.removeItem("pendingPartyJoin");
      const errorMessage = error?.message || "";
      if (!errorMessage.includes("취소") && !errorMessage.includes("cancel")) {
        alert(error.message || "카드 등록에 실패했습니다.");
      }
    }
  };

  // 저장된 카드로 바로 가입 플로우
  const handleJoinWithSavedCard = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    setJoinLoading(true);
    try {
      const totalAmount = party.monthlyFee * 2;
      await joinParty(id, {
        useExistingCard: true,
        amount: totalAmount,
        paymentMethod: "CARD"
      });
      alert("파티 가입이 완료되었습니다! 🎉");
      // 파티 상세 및 멤버 목록 새로고침
      await loadPartyDetail(id);
      await loadMembers();
      setIsJoinModalOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error?.message || error.message || "가입에 실패했습니다.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveConfirm = async () => {
    try {
      await leaveParty(id);
      alert("파티에서 탈퇴했습니다.");
      navigate("/my-parties");
    } catch (error) {
      console.error(error);
      alert("탈퇴 처리에 실패했습니다.");
    } finally {
      setIsLeaveModalOpen(false);
    }
  };

  const handleDepositRetry = async () => {
    if (!user) return;
    try {
      const amount = party.monthlyFee;
      localStorage.setItem("pendingPayment", JSON.stringify({ type: "RETRY_DEPOSIT", partyId: id }));
      await requestPayment(`${party.productName} 보증금 재결제`, amount, user.nickname);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading.detail || !party) {
    return (
      <div className={`min-h-screen flex items-center justify-center relative z-10 ${theme === "dark" ? "bg-[#0B1120]" : "bg-transparent"}`}>
        <div className={`w-10 h-10 border-2 rounded-full animate-spin ${theme === "dark" ? "border-gray-700 border-t-[#635bff]" : "border-gray-200 border-t-[#635bff]"}`}></div>
      </div>
    );
  }

  const isMember = members.some((m) => m.userId === user?.userId);
  const isLeader = party.partyLeaderId === user?.userId;
  const isFull = party.currentMembers >= party.maxMembers;
  const perPersonFee = party.monthlyFee ?? 0;
  const availableSlots = party.maxMembers - party.currentMembers;

  const badge = getStatusBadge(party, theme);

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 relative z-10 ${currentTheme.bg}`}>


      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent">

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/party")}
            className={`flex items-center gap-2 mb-8 transition-colors group ${theme === "dark"
              ? "text-gray-400 hover:text-[#635bff]"
              : theme === "pop"
                ? "text-gray-500 hover:text-pink-500"
                : theme === "christmas"
                  ? "text-gray-500 hover:text-red-800"
                  : "text-gray-500 hover:text-[#635bff]"
              }`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">파티 목록으로</span>
          </motion.button>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Party Info with OTT Image */}
            <div className="flex-1">
              <div className="flex items-start gap-5">
                {/* OTT Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border ${theme === "dark"
                    ? "bg-[#1E293B] border-gray-700 shadow-lg"
                    : theme === "christmas"
                      ? "bg-white shadow-[4px_4px_12px_rgba(0,0,0,0.08)] border-gray-200"
                      : "bg-white shadow-lg border-gray-100"
                    }`}
                >
                  {party.productImage ? (
                    <img
                      src={getProductIconUrl(party.productImage)}
                      alt={party.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#635bff]/10 to-[#00d4ff]/10">
                      <span className="text-4xl md:text-5xl font-black text-[#635bff]">
                        {party.productName?.[0]}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Party Info */}
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className={`${badge.bg} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg`}>
                      {badge.text}
                    </span>
                    {isLeader && (
                      <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        <Crown className="w-3 h-3 inline mr-1" />
                        파티장
                      </span>
                    )}
                    {isMember && !isLeader && (
                      <span className={`bg-white px-3 py-1.5 rounded-full text-xs font-bold border ${currentTheme.accentText} shadow-lg`} style={{ borderColor: `${accentColor}33` }}>
                        <Check className="w-3 h-3 inline mr-1" />
                        참여중
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {party.productName}
                  </h1>

                  {/* Leader Info - Only visible to members */}
                  {(isMember || isLeader) && (
                    <div className={`flex items-center gap-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center ring-2 shadow-sm ${theme === "dark" ? "ring-gray-700" : "ring-white"}`}>
                        <span className="text-xs font-bold text-white">
                          {party.leaderNickname?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>파티장</p>
                        <p className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{party.leaderNickname}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* Members */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -2 }}
                  className={`rounded-2xl p-5 border transition-all ${currentTheme.card}`}
                >
                  <div className={`flex items-center gap-2 text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    <Users className={`w-4 h-4 ${currentTheme.accentText}`} />
                    <span>파티 인원</span>
                  </div>
                  <p className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {party.currentMembers} / {party.maxMembers}
                  </p>
                  <div className={`h-2 w-full rounded-full overflow-hidden mt-3 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(party.currentMembers / party.maxMembers) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColor}99)` }}
                    />
                  </div>
                </motion.div>

                {/* Period */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -2 }}
                  className={`rounded-2xl p-5 border transition-all ${currentTheme.card}`}
                >
                  <div className={`flex items-center gap-2 text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    <Calendar className={`w-4 h-4 ${currentTheme.accentText}`} />
                    <span>이용 기간</span>
                  </div>
                  <p className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {formatDate(party.startDate)}
                  </p>
                  <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                    ~ {formatDate(party.endDate)}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right: Pricing Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`w-full lg:w-80 rounded-2xl p-6 border sticky top-24 ${currentTheme.card}`}
            >
              <div className={`flex items-center gap-2 mb-4 ${currentTheme.accentText}`}>
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm font-semibold">최대 75% 할인</span>
              </div>

              <div className="mb-6">
                <p className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>월 분담금</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {perPersonFee.toLocaleString()}
                  </span>
                  <span className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>원</span>
                </div>
              </div>

              <div className={`space-y-3 pt-4 border-t mb-6 ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                <div className="flex justify-between text-sm">
                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>보증금</span>
                  <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {perPersonFee.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>첫 결제 총액</span>
                  <span className={`font-bold ${currentTheme.accentText}`}>
                    {(perPersonFee * 2).toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {isLeader && party.partyStatus === "PENDING_PAYMENT" && (
                <RippleButton
                  onClick={handleDepositRetry}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold shadow-lg transition-all"
                >
                  보증금 재결제
                </RippleButton>
              )}

              {party.memberStatus === 'INACTIVE' ? (
                <div className="w-full py-3.5 bg-gray-100 text-gray-400 rounded-full font-semibold text-center">
                  재가입 불가
                </div>
              ) : !isMember && !isLeader && !isFull && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsJoinModalOpen(true)}
                  className={`w-full py-3.5 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${currentTheme.accentBg}`}
                  style={{ boxShadow: `0 10px 15px -3px ${accentColor}40` }}
                >
                  <Sparkles className="w-4 h-4" />
                  파티 가입하기
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}

              {isMember && !isLeader && (
                <RippleButton
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-full font-semibold transition-all"
                >
                  파티 탈퇴하기
                </RippleButton>
              )}

              {isFull && !isMember && (
                <div className="w-full py-3.5 bg-gray-100 text-gray-400 rounded-full font-semibold text-center">
                  모집 마감
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Party Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* OTT Account Info */}
            {(isMember || isLeader) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 border ${theme === "christmas"
                  ? "bg-gradient-to-br from-red-50 to-green-50 border-red-200"
                  : theme === "pop"
                    ? "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200"
                    : theme === "dark"
                      ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                      : "bg-gradient-to-br from-[#635bff]/5 to-[#00d4ff]/5 border-[#635bff]/10"
                  }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-lg font-bold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                    <Lock className="w-5 h-5" style={{ color: accentColor }} />
                    계정 정보
                  </h2>
                  {isLeader && (
                    <button
                      onClick={() => setIsOttModalOpen(true)}
                      className={`text-xs px-4 py-2 rounded-full border transition font-semibold ${theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                      style={{ color: theme === "dark" ? "#fff" : accentColor }}
                    >
                      수정
                    </button>
                  )}
                </div>

                {/* 빌링키 미등록 멤버(비방장)에게 카드 등록 안내 */}
                {isMember && !isLeader && !user?.hasBillingKey ? (
                  <div className="text-center py-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${currentTheme.accentBg} bg-opacity-10`}>
                      <CreditCard className="w-8 h-8" style={{ color: accentColor }} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                      🔒 카드 등록 후 확인 가능
                    </h3>
                    <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}>
                      정기결제를 위해 카드를 등록하면<br />
                      OTT 계정 정보를 확인할 수 있어요
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        localStorage.setItem("afterBillingRedirect", `/party/${id}`);
                        localStorage.setItem("billingRegistrationReason", "party_join");
                        navigate("/payment/billing/register");
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all shadow-lg"
                      style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 4px 14px ${accentColor}40`
                      }}
                    >
                      <CreditCard className="w-5 h-5" />
                      카드 등록하기
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                ) : (
                  /* 방장 또는 빌링키 등록된 멤버 - 정상 OTT 정보 표시 */
                  <>
                    <div className="space-y-3 mb-4">
                      <div className={`backdrop-blur-sm p-4 rounded-xl border flex justify-between items-center ${theme === "dark"
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-white/80 border-gray-100"
                        }`}>
                        <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}>아이디</span>
                        <div className={`font-mono font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"
                          }`}>
                          {showOttInfo ? (
                            party.ottId || <span className="text-gray-400 italic">미등록</span>
                          ) : (
                            <span className="blur-sm select-none">user@example.com</span>
                          )}
                        </div>
                      </div>

                      <div className={`backdrop-blur-sm p-4 rounded-xl border flex justify-between items-center ${theme === "dark"
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-white/80 border-gray-100"
                        }`}>
                        <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}>비밀번호</span>
                        <div className={`font-mono font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"
                          }`}>
                          {showOttInfo ? (
                            party.ottPassword || <span className="text-gray-400 italic">미등록</span>
                          ) : (
                            <span className="blur-sm select-none">••••••••••</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setShowOttInfo(!showOttInfo)}
                      className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border ${theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                      style={{ color: theme === "dark" ? "#fff" : accentColor }}
                    >
                      {showOttInfo ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          정보 숨기기
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          정보 보기
                        </>
                      )}
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl p-6 border ${currentTheme.card}`}
            >
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                <Shield className={`w-5 h-5 ${currentTheme.accentText}`} />
                안전한 파티 이용을 위한 안내
              </h3>
              <ul className={`space-y-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                <li className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${currentTheme.accentBg} bg-opacity-10`}>
                    <Check className={`w-3 h-3 ${currentTheme.accentText}`} />
                  </div>
                  <span>보증금은 파티 종료 시 전액 환불됩니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${currentTheme.accentBg} bg-opacity-10`}>
                    <Check className={`w-3 h-3 ${currentTheme.accentText}`} />
                  </div>
                  <span>매월 자동 결제로 편리하게 이용하세요</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${currentTheme.accentBg} bg-opacity-10`}>
                    <Check className={`w-3 h-3 ${currentTheme.accentText}`} />
                  </div>
                  <span>탈퇴 시 다음 결제일 전까지 이용 가능합니다</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Right Column - Members */}
          {isLeader && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl p-6 border h-fit sticky top-24 ${currentTheme.card}`}
            >
              <h3 className={`text-sm font-bold mb-4 uppercase tracking-wide flex items-center gap-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                <Users className={`w-4 h-4 ${currentTheme.accentText}`} />
                파티 멤버
              </h3>

              <div className="space-y-2">
                <AnimatePresence>
                  {members.map((m, i) => (
                    <motion.div
                      key={m.partyMemberId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-100"}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {m.nickname?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{m.nickname}</p>
                        {m.role === 'LEADER' && (
                          <p className="text-xs text-amber-600 font-semibold">파티장</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {[...Array(availableSlots)].map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className={`p-3 border border-dashed rounded-xl flex items-center justify-center text-xs ${theme === "dark" ? "border-gray-600 text-gray-500" : "border-gray-200 text-gray-400"}`}
                  >
                    대기중...
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <LeavePartyWarningModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveConfirm}
      />

      <UpdateOttModal
        isOpen={isOttModalOpen}
        onClose={(success) => {
          setIsOttModalOpen(false);
          if (success) loadPartyDetail(id);
        }}
        partyId={id}
        currentOttId={party.ottId}
      />

      {/* Join Confirmation Modal - Variant T Style */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-2xl p-6 max-w-md w-full shadow-2xl ${theme === "dark" ? "bg-[#1E293B]" : "bg-white"}`}
            >
              {/* 카드 상태에 따른 표시 */}
              {cardLoading ? (
                <div className="text-center py-8">
                  <div className={`w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4 ${theme === "dark" ? "border-gray-700 border-t-[#635bff]" : "border-gray-200 border-t-[#635bff]"}`}></div>
                  <p className={currentTheme.subtext}>카드 정보 확인 중...</p>
                </div>
              ) : (
                <>
                  {/* 저장된 카드 정보 표시 */}
                  {savedCard ? (
                    <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                      <CreditCard className={`w-8 h-8 ${currentTheme.accentText}`} />
                      <div>
                        <p className={`text-xs ${currentTheme.subtext}`}>저장된 카드</p>
                        <p className={`font-semibold ${currentTheme.text}`}>
                          {savedCard.cardCompany} {savedCard.cardNumber}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center mb-4">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 ${theme === "dark" ? "bg-[#635bff]/20" : "bg-gray-100"}`}>
                        <CreditCard className={`w-7 h-7 ${currentTheme.accentText}`} />
                      </div>
                      <p className={`text-sm ${currentTheme.subtext}`}>
                        카드를 등록하면 파티에 가입됩니다
                      </p>
                    </div>
                  )}

                  <h3 className={`text-xl font-bold mb-1 text-center ${currentTheme.text}`}>
                    파티 가입
                  </h3>
                  <p className={`text-sm text-center mb-5 ${currentTheme.subtext}`}>
                    {savedCard ? "저장된 카드로 바로 결제됩니다" : "카드 등록 후 첫 결제가 진행됩니다"}
                  </p>

                  {/* Payment Breakdown */}
                  <div className={`rounded-xl p-4 mb-4 ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                    <p className={`text-xs font-semibold mb-3 ${currentTheme.subtext}`}>💳 첫 결제 금액</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${currentTheme.text}`}>보증금</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${theme === "dark" ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
                            환불가능
                          </span>
                        </div>
                        <span className={`font-semibold ${currentTheme.text}`}>{perPersonFee.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${currentTheme.text}`}>첫달 구독료</span>
                        <span className={`font-semibold ${currentTheme.text}`}>{perPersonFee.toLocaleString()}원</span>
                      </div>
                      <div className={`border-t pt-2 mt-2 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-bold ${currentTheme.text}`}>합계</span>
                          <span className="text-lg font-bold" style={{ color: accentColor }}>
                            {(perPersonFee * 2).toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recurring Payment Info */}
                  <div className={`rounded-xl p-4 mb-5 border ${theme === "dark" ? "bg-[#635bff]/10 border-[#635bff]/20" : "bg-blue-50 border-blue-100"}`}>
                    <p className={`text-xs font-semibold mb-2 ${theme === "dark" ? "text-[#635bff]" : "text-blue-600"}`}>📅 정기결제 안내</p>
                    <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      <li>• 매월 자동결제: <span className="font-semibold">{perPersonFee.toLocaleString()}원</span></li>
                      <li>• 파티 탈퇴 시 보증금은 전액 환불됩니다</li>
                      <li>• 카드는 마이페이지에서 변경 가능합니다</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsJoinModalOpen(false)}
                      disabled={joinLoading}
                      className={`flex-1 py-3 font-semibold rounded-full transition-all ${theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"} ${joinLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      취소
                    </button>
                    {savedCard ? (
                      <motion.button
                        whileHover={{ scale: joinLoading ? 1 : 1.02 }}
                        whileTap={{ scale: joinLoading ? 1 : 0.98 }}
                        onClick={handleJoinWithSavedCard}
                        disabled={joinLoading}
                        className={`flex-1 py-3 text-white rounded-full font-semibold transition-all ${currentTheme.accentBg} ${joinLoading ? "opacity-70" : ""}`}
                        style={{ boxShadow: `0 8px 16px -4px ${accentColor}40` }}
                      >
                        {joinLoading ? "결제 중..." : "결제하기 →"}
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsJoinModalOpen(false);
                          handleJoinWithNewCard();
                        }}
                        className={`flex-1 py-3 text-white rounded-full font-semibold transition-all ${currentTheme.accentBg}`}
                        style={{ boxShadow: `0 8px 16px -4px ${accentColor}40` }}
                      >
                        카드 등록하기 →
                      </motion.button>
                    )}
                  </div>

                  {/* 다른 카드로 결제 옵션 (저장된 카드 있을 때만 표시) */}
                  {savedCard && !joinLoading && (
                    <button
                      onClick={() => {
                        setIsJoinModalOpen(false);
                        handleJoinWithNewCard();
                      }}
                      className={`w-full mt-3 py-2 text-sm font-medium underline transition-colors ${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      다른 카드로 결제하기
                    </button>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
