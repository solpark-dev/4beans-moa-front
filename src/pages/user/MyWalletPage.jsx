import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  CreditCard,
  Building2,
  Wallet,
  Plus,
  ShieldCheck,
  Zap,
  TrendingDown,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { useWalletStore } from "../../store/wallet/walletStore";
import { useAuthStore } from "../../store/authStore";
import { requestBillingAuth } from "../../utils/paymentHandler";
import { handleApiError } from "../../utils/errorHandler";
import { toast } from "../../utils/toast";
import {
  getBankLogo,
  getCardLogo,
  getBankTheme,
  getCardTheme,
} from "../../utils/logoHelper";

// Animated gradient background component for Variant T
function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(99,91,255,0.15) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default function MyWalletPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();

  // Zustand Store - Selector 패턴 사용
  const deposits = useWalletStore((state) => state.deposits);
  const account = useWalletStore((state) => state.account);
  const card = useWalletStore((state) => state.card);
  const loadingWallet = useWalletStore((state) => state.loading.wallet);
  const loadWalletData = useWalletStore((state) => state.loadWalletData);
  const getTotalDeposit = useWalletStore((state) => state.getTotalDeposit);

  useEffect(() => {
    if (!authLoading && !user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user, loadWalletData]);

  // 헬퍼 함수 사용
  const totalDeposit = getTotalDeposit();
  const loading = loadingWallet;

  const goHistory = (tab) => {
    navigate(`/user/financial-history?tab=${tab}`);
  };

  const handleRegisterCard = async () => {
    try {
      if (!user) {
        toast.warning("로그인이 필요합니다");
        navigate("/login");
        return;
      }
      await requestBillingAuth(user.userId);
    } catch (error) {
      const errorMessage = error?.message || "";
      if (errorMessage.includes("취소") || errorMessage.includes("cancel")) return;
      console.error("Card registration failed:", error);
      toast.error(handleApiError(error).message);
    }
  };

  if (authLoading || (loading && !account && !card)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#635bff] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Hero Header - Variant T Style */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <AnimatedGradient />
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-[#635bff] mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">뒤로가기</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#635bff]/10 text-[#635bff] rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              금융 관리
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight flex items-center gap-3">
              <Wallet className="w-8 h-8 text-[#635bff]" />
              내 지갑
            </h1>
            <p className="text-gray-500">나의 금융 정보를 관리하세요</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Total Deposit Card - Variant T Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => goHistory("deposit")}
          className="group relative bg-gradient-to-br from-[#635bff] via-[#5851e8] to-[#00d4ff] rounded-2xl p-6 text-white shadow-xl shadow-[#635bff]/20 cursor-pointer overflow-hidden hover:scale-[1.02] transition-all duration-300"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" />
              총 보증금
            </div>
            <div className="text-4xl font-bold mb-4 tracking-tight">
              {totalDeposit.toLocaleString()}
              <span className="text-xl font-semibold opacity-90 ml-1">원</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <TrendingDown className="w-4 h-4" />
                <span>안전하게 보관중</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                내역 보기
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute -right-8 -bottom-12 w-40 h-40 bg-[#00d4ff] rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
          <div className="absolute -left-8 -top-12 w-32 h-32 bg-white rounded-full opacity-10 blur-3xl"></div>
        </motion.div>

        {/* Settlement Account - Variant T Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#635bff]" />
              정산 계좌
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goHistory("settlement");
              }}
              className="text-xs text-[#635bff] hover:text-[#5851e8] font-semibold uppercase tracking-wider transition-colors"
            >
              내역 →
            </button>
          </div>

          <div
            onClick={() => navigate("/user/account-register")}
            className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#635bff]/30 cursor-pointer transition-all hover:shadow-lg hover:shadow-[#635bff]/10"
          >
            {account ? (
              <div className="flex items-center gap-4">
                {(() => {
                  const logoPath = getBankLogo(account.bankName);
                  const theme = getBankTheme(account.bankName);
                  return (
                    <div
                      className={`w-14 h-14 rounded-xl ${theme.bg} flex items-center justify-center overflow-hidden shadow-sm border border-gray-100`}
                    >
                      {logoPath ? (
                        <img
                          src={logoPath}
                          alt={account.bankName}
                          className="w-full h-full object-contain p-1.5"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <Building2
                        className={`w-6 h-6 ${theme.text} ${logoPath ? "hidden" : ""}`}
                      />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-lg">
                    {account.bankName}
                  </div>
                  <div className="text-sm text-gray-500 font-mono tracking-wide">
                    {account.accountNumber?.replace(/(\d{4})(\d{2})(.*)/, "$1-$2-******")}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#635bff]/10 transition-all">
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#635bff]" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-gray-400 group-hover:text-gray-600 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-[#635bff]/10">
                  <Plus className="w-6 h-6 group-hover:text-[#635bff]" />
                </div>
                <span className="text-sm font-semibold">등록된 계좌 없음</span>
                <span className="text-xs text-gray-400 mt-1">클릭하여 등록하기</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment Method - Variant T Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#00d4ff]" />
              결제 수단
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goHistory("payment");
              }}
              className="text-xs text-[#00d4ff] hover:text-[#00bce0] font-semibold uppercase tracking-wider transition-colors"
            >
              내역 →
            </button>
          </div>

          <div
            onClick={handleRegisterCard}
            className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#00d4ff]/30 cursor-pointer transition-all hover:shadow-lg hover:shadow-[#00d4ff]/10"
          >
            {card ? (
              <div className="flex items-center gap-4">
                {(() => {
                  const logoPath = getCardLogo(card.cardCompany);
                  const theme = getCardTheme(card.cardCompany);
                  return (
                    <div
                      className={`w-14 h-14 rounded-xl ${theme.bg} flex items-center justify-center overflow-hidden shadow-sm border border-gray-100`}
                    >
                      {logoPath ? (
                        <img
                          src={logoPath}
                          alt={card.cardCompany}
                          className="w-full h-full object-contain p-1.5"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <CreditCard
                        className={`w-6 h-6 ${theme.text} ${logoPath ? "hidden" : ""}`}
                      />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-lg">
                    {card.cardCompany}
                  </div>
                  <div className="text-sm text-gray-500 font-mono tracking-wide">
                    **** **** **** {card.cardNumber?.slice(-4) || "****"}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#00d4ff]/10 transition-all">
                    <Zap className="w-4 h-4 text-gray-400 group-hover:text-[#00d4ff] fill-current" />
                  </div>
                  <span className="text-[10px] text-gray-400 group-hover:text-[#00d4ff] font-semibold">
                    변경
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-gray-400 group-hover:text-gray-600 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-[#00d4ff]/10">
                  <Plus className="w-6 h-6 group-hover:text-[#00d4ff]" />
                </div>
                <span className="text-sm font-semibold">등록된 카드 없음</span>
                <span className="text-xs text-gray-400 mt-1">클릭하여 등록하기</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Info Cards - Variant T Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3 pt-4"
        >
          <div className="bg-gradient-to-br from-[#635bff]/5 to-[#635bff]/10 rounded-2xl p-4 border border-[#635bff]/10">
            <ShieldCheck className="w-5 h-5 text-[#635bff] mb-2" />
            <p className="text-xs text-gray-500 mb-1">안전 보증금</p>
            <p className="text-sm font-bold text-gray-900">100% 보호</p>
          </div>
          <div className="bg-gradient-to-br from-[#00d4ff]/5 to-[#00d4ff]/10 rounded-2xl p-4 border border-[#00d4ff]/10">
            <Zap className="w-5 h-5 text-[#00d4ff] mb-2" />
            <p className="text-xs text-gray-500 mb-1">자동 결제</p>
            <p className="text-sm font-bold text-gray-900">편리하게</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
