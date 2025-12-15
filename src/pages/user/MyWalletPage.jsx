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
import {
  useTheme,
  ThemeSwitcher,
  ThemeBackground,
  ThemeMarquee,
  themeConfig
} from "../../config/themeConfig";

export default function MyWalletPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();

  // Theme
  const { theme, setTheme, currentTheme } = useTheme("appTheme");

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
    <div className={`min-h-screen ${currentTheme.bg} pb-20 transition-colors duration-300`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Pop Theme Marquee */}
      <ThemeMarquee theme={theme} />

      {/* Hero Header */}
      <div className={`relative overflow-hidden border-b ${
        theme === "dark"
          ? "bg-[#0B1120] border-gray-800"
          : theme === "pop"
            ? "bg-slate-50 border-4 border-black"
            : theme === "portrait"
              ? "bg-transparent border-white/40"
              : theme === "christmas"
                ? "bg-white border-gray-100"
                : "bg-white border-gray-100"
      }`}>
        <ThemeBackground theme={theme} />
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-6 transition-colors group ${
              theme === "dark"
                ? "text-gray-400 hover:text-[#635bff]"
                : theme === "pop"
                  ? "text-black hover:text-pink-500"
                  : theme === "portrait"
                    ? "text-[#888] hover:text-pink-400"
                    : theme === "christmas"
                      ? "text-gray-500 hover:text-[#c41e3a]"
                      : "text-gray-400 hover:text-[#635bff]"
            }`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">뒤로가기</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
              theme === "pop"
                ? "bg-pink-400 text-black border-2 border-black"
                : theme === "dark"
                  ? "bg-[#635bff]/20 text-[#635bff] border border-[#635bff]/30"
                  : theme === "portrait"
                    ? "bg-white/50 backdrop-blur-sm text-pink-400 border border-white/60"
                    : theme === "christmas"
                      ? "bg-[#c41e3a]/10 text-[#c41e3a] border border-[#c41e3a]/20"
                      : "bg-[#635bff]/10 text-[#635bff]"
            }`}>
              <Sparkles className="w-4 h-4" />
              금융 관리
            </span>
            <h1 className={`text-4xl font-bold mb-2 tracking-tight flex items-center gap-3 ${currentTheme.text}`}>
              <Wallet className={`w-8 h-8`} style={{ color: currentTheme.accent }} />
              내 지갑
            </h1>
            <p className={currentTheme.subtext}>나의 금융 정보를 관리하세요</p>
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
            <h3 className={`font-bold flex items-center gap-2 ${currentTheme.text}`}>
              <Building2 className="w-5 h-5" style={{ color: currentTheme.accent }} />
              정산 계좌
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goHistory("settlement");
              }}
              className="text-xs font-semibold uppercase tracking-wider transition-colors"
              style={{ color: currentTheme.accent }}
            >
              내역 →
            </button>
          </div>

          <div
            onClick={() => navigate("/user/account-register")}
            className={`group rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg ${
              theme === "pop"
                ? "bg-white border-2 border-black hover:bg-pink-50"
                : theme === "dark"
                  ? "bg-[#1E293B] border border-gray-700 hover:border-[#635bff]/50 hover:shadow-[#635bff]/10"
                  : theme === "portrait"
                    ? "bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white/80 hover:shadow-pink-200/30"
                    : theme === "christmas"
                      ? "bg-white border border-gray-100 hover:border-[#c41e3a]/30 hover:shadow-[#c41e3a]/10"
                      : "bg-white border border-gray-100 hover:border-[#635bff]/30 hover:shadow-[#635bff]/10"
            }`}
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
                  <div className={`font-bold text-lg ${currentTheme.text}`}>
                    {account.bankName}
                  </div>
                  <div className={`text-sm font-mono tracking-wide ${currentTheme.subtext}`}>
                    {account.accountNumber?.replace(/(\d{4})(\d{2})(.*)/, "$1-$2-******")}
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  theme === "dark"
                    ? "bg-gray-700 group-hover:bg-[#635bff]/20"
                    : theme === "pop"
                      ? "bg-gray-100 group-hover:bg-pink-200"
                      : theme === "portrait"
                        ? "bg-white/60 group-hover:bg-pink-100/60"
                        : theme === "christmas"
                          ? "bg-gray-100 group-hover:bg-[#c41e3a]/10"
                          : "bg-gray-100 group-hover:bg-[#635bff]/10"
                }`}>
                  <ChevronRight className={`w-5 h-5 transition-colors ${
                    theme === "dark"
                      ? "text-gray-400 group-hover:text-[#635bff]"
                      : theme === "pop"
                        ? "text-gray-400 group-hover:text-pink-500"
                        : theme === "portrait"
                          ? "text-gray-400 group-hover:text-pink-400"
                          : theme === "christmas"
                            ? "text-gray-400 group-hover:text-[#c41e3a]"
                            : "text-gray-400 group-hover:text-[#635bff]"
                  }`} />
                </div>
              </div>
            ) : (
              <div className={`flex flex-col items-center py-6 transition-colors ${currentTheme.subtext}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                  theme === "dark"
                    ? "bg-gray-700 group-hover:bg-[#635bff]/20"
                    : theme === "pop"
                      ? "bg-gray-100 group-hover:bg-pink-200"
                      : theme === "portrait"
                        ? "bg-white/60 group-hover:bg-pink-100/60"
                        : theme === "christmas"
                          ? "bg-gray-100 group-hover:bg-[#c41e3a]/10"
                          : "bg-gray-100 group-hover:bg-[#635bff]/10"
                }`}>
                  <Plus className={`w-6 h-6 transition-colors ${
                    theme === "dark"
                      ? "text-gray-400 group-hover:text-[#635bff]"
                      : theme === "pop"
                        ? "text-gray-400 group-hover:text-pink-500"
                        : theme === "portrait"
                          ? "text-gray-400 group-hover:text-pink-400"
                          : theme === "christmas"
                            ? "text-gray-400 group-hover:text-[#c41e3a]"
                            : "text-gray-400 group-hover:text-[#635bff]"
                  }`} />
                </div>
                <span className="text-sm font-semibold">등록된 계좌 없음</span>
                <span className={`text-xs mt-1 ${currentTheme.subtext}`}>클릭하여 등록하기</span>
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
            <h3 className={`font-bold flex items-center gap-2 ${currentTheme.text}`}>
              <CreditCard className="w-5 h-5" style={{ color: currentTheme.accent }} />
              결제 수단
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goHistory("payment");
              }}
              className="text-xs font-semibold uppercase tracking-wider transition-colors"
              style={{ color: currentTheme.accent }}
            >
              내역 →
            </button>
          </div>

          <div
            onClick={handleRegisterCard}
            className={`group rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg ${
              theme === "pop"
                ? "bg-white border-2 border-black hover:bg-pink-50"
                : theme === "dark"
                  ? "bg-[#1E293B] border border-gray-700 hover:border-[#635bff]/50 hover:shadow-[#635bff]/10"
                  : theme === "portrait"
                    ? "bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white/80 hover:shadow-pink-200/30"
                    : theme === "christmas"
                      ? "bg-white border border-gray-100 hover:border-[#c41e3a]/30 hover:shadow-[#c41e3a]/10"
                      : "bg-white border border-gray-100 hover:border-[#635bff]/30 hover:shadow-[#635bff]/10"
            }`}
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
                  <div className={`font-bold text-lg ${currentTheme.text}`}>
                    {card.cardCompany}
                  </div>
                  <div className={`text-sm font-mono tracking-wide ${currentTheme.subtext}`}>
                    **** **** **** {card.cardNumber?.slice(-4) || "****"}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    theme === "dark"
                      ? "bg-gray-700 group-hover:bg-[#635bff]/20"
                      : theme === "pop"
                        ? "bg-gray-100 group-hover:bg-pink-200"
                        : theme === "portrait"
                          ? "bg-white/60 group-hover:bg-pink-100/60"
                          : theme === "christmas"
                            ? "bg-gray-100 group-hover:bg-[#c41e3a]/10"
                            : "bg-gray-100 group-hover:bg-[#635bff]/10"
                  }`}>
                    <Zap className={`w-4 h-4 fill-current transition-colors ${
                      theme === "dark"
                        ? "text-gray-400 group-hover:text-[#635bff]"
                        : theme === "pop"
                          ? "text-gray-400 group-hover:text-pink-500"
                          : theme === "portrait"
                            ? "text-gray-400 group-hover:text-pink-400"
                            : theme === "christmas"
                              ? "text-gray-400 group-hover:text-[#c41e3a]"
                              : "text-gray-400 group-hover:text-[#635bff]"
                    }`} />
                  </div>
                  <span className={`text-[10px] font-semibold transition-colors ${
                    theme === "dark"
                      ? "text-gray-400 group-hover:text-[#635bff]"
                      : theme === "pop"
                        ? "text-gray-400 group-hover:text-pink-500"
                        : theme === "portrait"
                          ? "text-gray-400 group-hover:text-pink-400"
                          : theme === "christmas"
                            ? "text-gray-400 group-hover:text-[#c41e3a]"
                            : "text-gray-400 group-hover:text-[#635bff]"
                  }`}>
                    변경
                  </span>
                </div>
              </div>
            ) : (
              <div className={`flex flex-col items-center py-6 transition-colors ${currentTheme.subtext}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                  theme === "dark"
                    ? "bg-gray-700 group-hover:bg-[#635bff]/20"
                    : theme === "pop"
                      ? "bg-gray-100 group-hover:bg-pink-200"
                      : theme === "portrait"
                        ? "bg-white/60 group-hover:bg-pink-100/60"
                        : theme === "christmas"
                          ? "bg-gray-100 group-hover:bg-[#c41e3a]/10"
                          : "bg-gray-100 group-hover:bg-[#635bff]/10"
                }`}>
                  <Plus className={`w-6 h-6 transition-colors ${
                    theme === "dark"
                      ? "text-gray-400 group-hover:text-[#635bff]"
                      : theme === "pop"
                        ? "text-gray-400 group-hover:text-pink-500"
                        : theme === "portrait"
                          ? "text-gray-400 group-hover:text-pink-400"
                          : theme === "christmas"
                            ? "text-gray-400 group-hover:text-[#c41e3a]"
                            : "text-gray-400 group-hover:text-[#635bff]"
                  }`} />
                </div>
                <span className="text-sm font-semibold">등록된 카드 없음</span>
                <span className={`text-xs mt-1 ${currentTheme.subtext}`}>클릭하여 등록하기</span>
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
          <div className={`rounded-2xl p-4 ${
            theme === "dark"
              ? "bg-[#635bff]/10 border border-[#635bff]/20"
              : theme === "pop"
                ? "bg-pink-100 border-2 border-black"
                : theme === "portrait"
                  ? "bg-white/30 backdrop-blur-sm border border-white/50"
                  : theme === "christmas"
                    ? "bg-[#c41e3a]/5 border border-[#c41e3a]/10"
                    : "bg-gradient-to-br from-[#635bff]/5 to-[#635bff]/10 border border-[#635bff]/10"
          }`}>
            <ShieldCheck className="w-5 h-5 mb-2" style={{ color: currentTheme.accent }} />
            <p className={`text-xs mb-1 ${currentTheme.subtext}`}>안전 보증금</p>
            <p className={`text-sm font-bold ${currentTheme.text}`}>100% 보호</p>
          </div>
          <div className={`rounded-2xl p-4 ${
            theme === "dark"
              ? "bg-[#635bff]/10 border border-[#635bff]/20"
              : theme === "pop"
                ? "bg-yellow-100 border-2 border-black"
                : theme === "portrait"
                  ? "bg-white/30 backdrop-blur-sm border border-white/50"
                  : theme === "christmas"
                    ? "bg-[#0a6638]/5 border border-[#0a6638]/10"
                    : "bg-gradient-to-br from-[#635bff]/5 to-[#635bff]/10 border border-[#635bff]/10"
          }`}>
            <Zap className="w-5 h-5 mb-2" style={{ color: currentTheme.accent }} />
            <p className={`text-xs mb-1 ${currentTheme.subtext}`}>자동 결제</p>
            <p className={`text-sm font-bold ${currentTheme.text}`}>편리하게</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
