import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Receipt, ShieldCheck, TrendingUp } from "lucide-react";
import PaymentHistoryList from "../../components/history/PaymentHistoryList";
import DepositHistoryList from "../../components/history/DepositHistoryList";
import SettlementHistoryList from "../../components/history/SettlementHistoryList";
import {
  useTheme,
  ThemeSwitcher,
  ThemeBackground,
  ThemeMarquee,
} from "../../config/themeConfig";

export default function FinancialHistoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("payment");

  // Theme
  const { theme, setTheme, currentTheme } = useTheme("appTheme");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["payment", "deposit", "settlement"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: "payment", label: "결제 내역", icon: Receipt },
    { id: "deposit", label: "보증금 내역", icon: ShieldCheck },
    { id: "settlement", label: "정산 내역", icon: TrendingUp },
  ];

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
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
            <h1 className={`text-4xl font-bold mb-2 tracking-tight ${currentTheme.text}`}>
              금융 내역
            </h1>
            <p className={currentTheme.subtext}>나의 모든 거래 내역을 확인하세요</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl shadow-sm overflow-hidden ${
            theme === "pop"
              ? "bg-white border-4 border-black"
              : theme === "dark"
                ? "bg-[#1E293B] border border-gray-700"
                : theme === "portrait"
                  ? "bg-white/40 backdrop-blur-xl border border-white/60"
                  : theme === "christmas"
                    ? "bg-white border border-gray-100"
                    : "bg-white border border-slate-200"
          }`}
        >
          <div className={`flex ${
            theme === "dark"
              ? "border-b border-gray-700"
              : theme === "pop"
                ? "border-b-4 border-black"
                : theme === "portrait"
                  ? "border-b border-white/60"
                  : theme === "christmas"
                    ? "border-b border-gray-100"
                    : "border-b border-slate-200"
          }`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`flex-1 py-4 px-4 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    theme === "pop"
                      ? isActive
                        ? "text-pink-600 border-b-4 border-black bg-pink-50"
                        : "text-black hover:bg-pink-50"
                      : theme === "dark"
                        ? isActive
                          ? "text-[#635bff] border-b-2 border-[#635bff] bg-[#635bff]/10"
                          : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                        : theme === "portrait"
                          ? isActive
                            ? "text-pink-400 border-b-2 border-pink-400 bg-pink-50/30"
                            : "text-[#888] hover:text-pink-400 hover:bg-white/30"
                          : theme === "christmas"
                            ? isActive
                              ? "text-[#c41e3a] border-b-2 border-[#c41e3a] bg-[#c41e3a]/5"
                              : "text-gray-500 hover:text-[#c41e3a] hover:bg-gray-50"
                            : isActive
                              ? "text-[#635bff] border-b-2 border-[#635bff] bg-[#635bff]/5"
                              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Content with animation */}
          <div className="p-6 min-h-[400px]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "payment" && <PaymentHistoryList theme={theme} currentTheme={currentTheme} />}
              {activeTab === "deposit" && <DepositHistoryList theme={theme} currentTheme={currentTheme} />}
              {activeTab === "settlement" && <SettlementHistoryList theme={theme} currentTheme={currentTheme} />}
            </motion.div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
          <div className={`rounded-xl p-4 ${
            theme === "pop"
              ? "bg-cyan-100 border-4 border-black"
              : theme === "dark"
                ? "bg-[#1E293B] border border-gray-700"
                : theme === "portrait"
                  ? "bg-white/30 backdrop-blur-sm border border-white/50"
                  : theme === "christmas"
                    ? "bg-[#c41e3a]/5 border border-[#c41e3a]/10"
                    : "bg-gradient-to-br from-[#635bff]/5 to-[#635bff]/10 border border-[#635bff]/10"
          }`}>
            <Receipt className="w-5 h-5 mb-2" style={{ color: currentTheme.accent }} />
            <p className={`text-xs mb-1 ${currentTheme.subtext}`}>자동 결제</p>
            <p className={`text-sm font-bold ${currentTheme.text}`}>매월 정기 결제</p>
          </div>
          <div className={`rounded-xl p-4 ${
            theme === "pop"
              ? "bg-pink-100 border-4 border-black"
              : theme === "dark"
                ? "bg-[#1E293B] border border-gray-700"
                : theme === "portrait"
                  ? "bg-white/30 backdrop-blur-sm border border-white/50"
                  : theme === "christmas"
                    ? "bg-[#0a6638]/5 border border-[#0a6638]/10"
                    : "bg-gradient-to-br from-[#635bff]/5 to-[#635bff]/10 border border-[#635bff]/10"
          }`}>
            <ShieldCheck className="w-5 h-5 mb-2" style={{ color: currentTheme.accent }} />
            <p className={`text-xs mb-1 ${currentTheme.subtext}`}>보증금 보호</p>
            <p className={`text-sm font-bold ${currentTheme.text}`}>안전하게 보관</p>
          </div>
          <div className={`rounded-xl p-4 ${
            theme === "pop"
              ? "bg-lime-100 border-4 border-black"
              : theme === "dark"
                ? "bg-[#1E293B] border border-gray-700"
                : theme === "portrait"
                  ? "bg-white/30 backdrop-blur-sm border border-white/50"
                  : theme === "christmas"
                    ? "bg-[#c41e3a]/5 border border-[#c41e3a]/10"
                    : "bg-gradient-to-br from-[#635bff]/5 to-[#635bff]/10 border border-[#635bff]/10"
          }`}>
            <TrendingUp className="w-5 h-5 mb-2" style={{ color: currentTheme.accent }} />
            <p className={`text-xs mb-1 ${currentTheme.subtext}`}>정산 시스템</p>
            <p className={`text-sm font-bold ${currentTheme.text}`}>투명한 관리</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
