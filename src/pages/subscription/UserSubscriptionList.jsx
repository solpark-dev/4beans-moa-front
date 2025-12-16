import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, CreditCard, AlertCircle, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher, ChristmasBackground } from "@/config/themeConfig";

// Animated gradient background component - theme-aware
function AnimatedGradient({ theme }) {
  const gradients = {
    christmas: {
      color1: "rgba(196, 30, 58, 0.15)",
      color2: "rgba(26, 95, 42, 0.15)",
    },
    dark: {
      color1: "rgba(99, 91, 255, 0.15)",
      color2: "rgba(0, 212, 255, 0.15)",
    },
    portrait: {
      color1: "rgba(255, 181, 197, 0.15)",
      color2: "rgba(197, 181, 255, 0.15)",
    },
    classic: {
      color1: "rgba(99, 91, 255, 0.15)",
      color2: "rgba(0, 212, 255, 0.15)",
    },
    pop: {
      color1: "rgba(236, 72, 153, 0.15)",
      color2: "rgba(34, 211, 238, 0.15)",
    },
  };

  const colors = gradients[theme] || gradients.classic;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${colors.color1} 0%, transparent 70%)`,
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
          background: `radial-gradient(circle, ${colors.color2} 0%, transparent 70%)`,
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

const MOCK_USER = { id: "user-001", nickname: "테스트사용자" };

const MOCK_USER_SUBSCRIPTIONS = [
  {
    id: "sub-1",
    userId: "user-001",
    nextBillingDate: "2023-12-01",
    status: "ACTIVE",
    product: {
      name: "Netflix",
      price: 17000,
      iconUrl: "https://picsum.photos/50",
    },
  },
];

export default function UserSubscriptionList() {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const user = MOCK_USER;

  const subscriptions = MOCK_USER_SUBSCRIPTIONS.filter(
    (s) => s.userId === user?.id
  );

  // Theme-based colors
  const getThemeColors = () => {
    switch (theme) {
      case 'christmas':
        return {
          bg: 'bg-transparent',
          headerBg: 'bg-white/80 backdrop-blur-sm',
          badgeBg: 'bg-[#c41e3a]/10',
          badgeText: 'text-[#c41e3a]',
          text: 'text-gray-900',
          subtext: 'text-gray-600',
          cardBg: 'bg-white/90 backdrop-blur-sm',
          cardBorder: 'border-gray-100',
          cardHover: 'hover:shadow-lg hover:shadow-[#c41e3a]/20',
          buttonBg: 'bg-[#c41e3a]',
          buttonHover: 'hover:bg-[#a51830]',
          buttonShadow: 'shadow-[#c41e3a]/25',
          iconColor1: 'text-[#c41e3a]',
          iconColor2: 'text-[#1a5f2a]',
          priceColor: 'text-[#c41e3a]',
          statusActive: 'bg-emerald-50 text-emerald-600',
        };
      case 'dark':
        return {
          bg: 'bg-[#0B1120]',
          headerBg: 'bg-[#1E293B]',
          badgeBg: 'bg-[#635bff]/10',
          badgeText: 'text-[#635bff]',
          text: 'text-white',
          subtext: 'text-gray-400',
          cardBg: 'bg-[#1E293B]',
          cardBorder: 'border-gray-700',
          cardHover: 'hover:shadow-lg hover:shadow-[#635bff]/20',
          buttonBg: 'bg-[#635bff]',
          buttonHover: 'hover:bg-[#5851e8]',
          buttonShadow: 'shadow-[#635bff]/25',
          iconColor1: 'text-[#635bff]',
          iconColor2: 'text-[#00d4ff]',
          priceColor: 'text-[#635bff]',
          statusActive: 'bg-emerald-500/20 text-emerald-400',
        };
      case 'portrait':
        return {
          bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
          headerBg: 'bg-white/80 backdrop-blur-sm',
          badgeBg: 'bg-pink-100',
          badgeText: 'text-pink-600',
          text: 'text-gray-900',
          subtext: 'text-gray-500',
          cardBg: 'bg-white/80 backdrop-blur-sm',
          cardBorder: 'border-pink-100',
          cardHover: 'hover:shadow-lg hover:shadow-pink-200/30',
          buttonBg: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF]',
          buttonHover: 'hover:opacity-90',
          buttonShadow: 'shadow-pink-200/40',
          iconColor1: 'text-pink-500',
          iconColor2: 'text-purple-500',
          priceColor: 'text-pink-600',
          statusActive: 'bg-emerald-50 text-emerald-600',
        };
      case 'classic':
        return {
          bg: 'bg-[#fafafa]',
          headerBg: 'bg-white',
          badgeBg: 'bg-[#635bff]/10',
          badgeText: 'text-[#635bff]',
          text: 'text-gray-900',
          subtext: 'text-gray-500',
          cardBg: 'bg-white',
          cardBorder: 'border-gray-100',
          cardHover: 'hover:shadow-lg hover:shadow-[#635bff]/10',
          buttonBg: 'bg-[#635bff]',
          buttonHover: 'hover:bg-[#5851e8]',
          buttonShadow: 'shadow-[#635bff]/25',
          iconColor1: 'text-[#635bff]',
          iconColor2: 'text-[#00d4ff]',
          priceColor: 'text-[#635bff]',
          statusActive: 'bg-emerald-50 text-emerald-600',
        };
      case 'pop':
      default:
        return {
          bg: 'bg-[#fafafa]',
          headerBg: 'bg-white',
          badgeBg: 'bg-[#635bff]/10',
          badgeText: 'text-[#635bff]',
          text: 'text-gray-900',
          subtext: 'text-gray-500',
          cardBg: 'bg-white',
          cardBorder: 'border-gray-100',
          cardHover: 'hover:shadow-lg hover:shadow-[#635bff]/10',
          buttonBg: 'bg-[#635bff]',
          buttonHover: 'hover:bg-[#5851e8]',
          buttonShadow: 'shadow-[#635bff]/25',
          iconColor1: 'text-[#635bff]',
          iconColor2: 'text-[#00d4ff]',
          priceColor: 'text-[#635bff]',
          statusActive: 'bg-emerald-50 text-emerald-600',
        };
    }
  };

  const themeColors = getThemeColors();

  return (
    <div className={`min-h-screen ${themeColors.bg} pb-20`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      {/* Hero Header - Variant T Style */}
      <div className={`relative overflow-hidden ${themeColors.headerBg} ${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-100'}`}>
        <AnimatedGradient theme={theme} />
        <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 ${themeColors.badgeBg} ${themeColors.badgeText} rounded-full text-sm font-medium mb-4`}>
              <Sparkles className="w-4 h-4" />
              구독 관리
            </span>
            <h1 className={`text-4xl font-bold ${themeColors.text} mb-3 tracking-tight`}>내 구독 목록</h1>
            <p className={themeColors.subtext}>현재 이용 중인 구독 서비스입니다.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {subscriptions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${themeColors.cardBg} border ${themeColors.cardBorder} rounded-2xl p-10 text-center`}
          >
            <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <AlertCircle className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <h3 className={`font-bold ${themeColors.text} mb-2`}>
              구독 중인 서비스가 없습니다.
            </h3>
            <p className={`${themeColors.subtext} mb-6`}>새로운 구독을 시작해보세요.</p>

            <Link
              to="/subscriptions"
              className={`inline-flex items-center gap-2 px-6 py-3 ${themeColors.buttonBg} ${themeColors.buttonHover} text-white rounded-full font-semibold shadow-lg ${themeColors.buttonShadow} transition-all`}
            >
              구독 상품 보러가기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        <div className="space-y-4">
          {subscriptions.map((sub, index) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className={`${themeColors.cardBg} border ${themeColors.cardBorder} rounded-2xl p-6 ${themeColors.cardHover} cursor-pointer transition-all`}
              onClick={() => navigate(`/my/subscriptions/${sub.id}`)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={sub.product.iconUrl}
                    className={`w-14 h-14 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                    alt={sub.product.name}
                  />

                  <div>
                    <h3 className={`font-bold ${themeColors.text} text-lg`}>
                      {sub.product.name}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        sub.status === "ACTIVE"
                          ? themeColors.statusActive
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {sub.status === "ACTIVE" ? "이용중" : "해지됨"}
                    </span>
                  </div>
                </div>

                <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>

              <div className={`mt-4 pt-4 border-t ${themeColors.cardBorder} flex justify-between text-sm ${themeColors.subtext}`}>
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${themeColors.iconColor1}`} />
                  다음 결제일:{" "}
                  <span className={`font-semibold ${themeColors.text}`}>
                    {sub.nextBillingDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className={`w-4 h-4 ${themeColors.iconColor2}`} />월{" "}
                  <span className={`font-bold ${themeColors.priceColor}`}>
                    ₩{sub.product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
