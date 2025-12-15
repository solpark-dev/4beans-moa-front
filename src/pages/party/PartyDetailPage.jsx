import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import { requestPayment } from "../../utils/paymentHandler";
import LeavePartyWarningModal from "../../components/party/LeavePartyWarningModal";
import UpdateOttModal from "../../components/party/UpdateOttModal";
import RippleButton from "../../components/party/RippleButton";
import { useConfetti } from "../../components/party/SuccessConfetti";
import { fetchPartyMembers, leaveParty } from "../../hooks/party/partyService";
import {
  useTheme,
  ThemeSwitcher,
  ThemeBackground,
  ThemeMarquee,
  Sticker,
  themeConfig
} from "../../config/themeConfig";
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
  ArrowRight
} from "lucide-react";

export default function PartyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Theme
  const { theme, setTheme, currentTheme } = useTheme("appTheme");

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
  const { triggerConfetti, ConfettiComponent } = useConfetti();

  useEffect(() => {
    loadPartyDetail(id);
    loadMembers();
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

  const handleJoin = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const perPersonFee = party.monthlyFee;
      const totalAmount = perPersonFee * 2;

      localStorage.setItem("pendingPayment", JSON.stringify({ type: "JOIN_PARTY", partyId: id }));
      await requestPayment(`${party.productName} 파티 가입`, totalAmount, user.nickname);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("pendingPayment");
      alert(error.message || "가입에 실패했습니다.");
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-[#635bff] rounded-full animate-spin"></div>
      </div>
    );
  }

  const isMember = members.some((m) => m.userId === user?.userId);
  const isLeader = party.partyLeaderId === user?.userId;
  const isFull = party.currentMembers >= party.maxMembers;
  const perPersonFee = party.monthlyFee;
  const availableSlots = party.maxMembers - party.currentMembers;

  const getStatusBadge = (status) => {
    const badges = {
      RECRUITING: {
        bg: "bg-[#635bff]",
        text: "모집중"
      },
      ACTIVE: {
        bg: "bg-emerald-500",
        text: "파티중"
      },
      PENDING_PAYMENT: {
        bg: "bg-amber-500",
        text: "결제대기"
      },
      CLOSED: {
        bg: "bg-gray-400",
        text: "파티종료"
      },
    };
    return badges[status] || badges.RECRUITING;
  };

  const badge = getStatusBadge(party.partyStatus);

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

  return (
    <div className={`min-h-screen ${currentTheme.bg} pb-20 transition-colors duration-300`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Pop Theme Marquee */}
      <ThemeMarquee theme={theme} />

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${currentTheme.heroBg}`}>
        <ThemeBackground theme={theme} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/party")}
            className={`flex items-center gap-2 mb-8 transition-colors group ${theme === "dark" ? "text-gray-400 hover:text-[#635bff]" : "text-gray-500 hover:text-[#635bff]"
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
                  className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100"
                >
                  {party.productImage ? (
                    <img
                      src={party.productImage}
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
                      <span className="bg-white text-[#635bff] px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-[#635bff]/20">
                        <Check className="w-3 h-3 inline mr-1" />
                        참여중
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 tracking-tight">
                    {party.productName}
                  </h1>

                  {/* Leader Info */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center ring-2 ring-white shadow-sm">
                      <span className="text-xs font-bold text-white">
                        {party.leaderNickname?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">파티장</p>
                      <p className="text-sm font-semibold text-gray-900">{party.leaderNickname}</p>
                    </div>
                  </div>
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
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Users className="w-4 h-4 text-[#635bff]" />
                    <span>파티 인원</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {party.currentMembers} / {party.maxMembers}
                  </p>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(party.currentMembers / party.maxMembers) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#635bff] to-[#00d4ff] rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Period */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Calendar className="w-4 h-4 text-[#635bff]" />
                    <span>이용 기간</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {formatDate(party.startDate)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
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
              className="w-full lg:w-80 bg-white rounded-2xl p-6 border border-gray-100 shadow-xl sticky top-24"
            >
              <div className="flex items-center gap-2 text-[#635bff] mb-4">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm font-semibold">최대 75% 할인</span>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">월 분담금</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">
                    {perPersonFee.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500">원</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">보증금</span>
                  <span className="font-semibold text-gray-900">
                    {perPersonFee.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">첫 결제 총액</span>
                  <span className="font-bold text-[#635bff]">
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
                  className="w-full py-3.5 bg-[#635bff] hover:bg-[#5851e8] text-white rounded-full font-semibold shadow-lg shadow-[#635bff]/25 transition-all flex items-center justify-center gap-2"
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
                className="bg-gradient-to-br from-[#635bff]/5 to-[#00d4ff]/5 rounded-2xl p-6 border border-[#635bff]/10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#635bff]" />
                    계정 정보
                  </h2>
                  {isLeader && (
                    <button
                      onClick={() => setIsOttModalOpen(true)}
                      className="text-xs bg-white hover:bg-gray-50 text-[#635bff] px-4 py-2 rounded-full border border-[#635bff]/20 transition font-semibold"
                    >
                      수정
                    </button>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">아이디</span>
                    <div className="font-mono font-semibold text-gray-900">
                      {showOttInfo ? (
                        party.ottId || <span className="text-gray-400 italic">미등록</span>
                      ) : (
                        <span className="blur-sm select-none">user@example.com</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">비밀번호</span>
                    <div className="font-mono font-semibold text-gray-900">
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
                  className="w-full py-3 bg-white hover:bg-gray-50 text-[#635bff] border border-[#635bff]/20 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
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
              </motion.div>
            )}

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#635bff]" />
                안전한 파티 이용을 위한 안내
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#635bff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#635bff]" />
                  </div>
                  <span>보증금은 파티 종료 시 전액 환불됩니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#635bff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#635bff]" />
                  </div>
                  <span>매월 자동 결제로 편리하게 이용하세요</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#635bff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#635bff]" />
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
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit sticky top-24"
            >
              <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4 text-[#635bff]" />
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
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {m.nickname?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{m.nickname}</p>
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
                    className="p-3 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-2 text-center">
                파티 가입 확인
              </h3>
              <p className="text-gray-500 text-center mb-6">
                결제 정보를 확인해주세요
              </p>

              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
                  <span className="text-sm text-gray-600">보증금 + 첫달 구독료</span>
                  <span className="font-bold text-[#635bff]">
                    {(perPersonFee * 2).toLocaleString()}원
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
                  <span className="text-sm text-gray-600">월 정기결제</span>
                  <span className="font-bold text-gray-900">
                    {perPersonFee.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsJoinModalOpen(false)}
                  className="flex-1 py-3.5 font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-all"
                >
                  취소
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsJoinModalOpen(false);
                    triggerConfetti();
                    handleJoin();
                  }}
                  className="flex-1 py-3.5 bg-[#635bff] hover:bg-[#5851e8] text-white rounded-full font-semibold shadow-lg shadow-[#635bff]/25 transition-all"
                >
                  가입하기
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Effect */}
      <ConfettiComponent />
    </div>
  );
}
