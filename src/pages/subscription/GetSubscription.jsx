import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Calendar, CreditCard, Settings, XCircle } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { useThemeStore } from '@/store/themeStore';
import { ThemeSwitcher, ChristmasBackground } from '@/config/themeConfig';

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

const GetSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme, setTheme } = useThemeStore();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    // Theme-based colors
    const getThemeColors = () => {
        switch (theme) {
            case 'christmas':
                return {
                    bg: 'bg-transparent',
                    headerBg: 'bg-white/80 backdrop-blur-sm',
                    text: 'text-gray-900',
                    subtext: 'text-gray-600',
                    cardBg: 'bg-white/90 backdrop-blur-sm',
                    cardBorder: 'border-gray-100',
                    iconColor1: 'text-[#c41e3a]',
                    iconColor2: 'text-[#1a5f2a]',
                    priceColor: 'text-[#c41e3a]',
                    buttonPrimary: 'bg-[#c41e3a] hover:bg-[#a51830]',
                    buttonSecondary: 'border-gray-200 hover:border-[#c41e3a] hover:text-[#c41e3a]',
                    statusActive: 'bg-emerald-50 text-emerald-600',
                    loadingSpinner: 'border-[#c41e3a]',
                };
            case 'dark':
                return {
                    bg: 'bg-[#0B1120]',
                    headerBg: 'bg-[#1E293B]',
                    text: 'text-white',
                    subtext: 'text-gray-400',
                    cardBg: 'bg-[#1E293B]',
                    cardBorder: 'border-gray-700',
                    iconColor1: 'text-[#635bff]',
                    iconColor2: 'text-[#00d4ff]',
                    priceColor: 'text-[#635bff]',
                    buttonPrimary: 'bg-[#635bff] hover:bg-[#5851e8]',
                    buttonSecondary: 'border-gray-700 hover:border-[#635bff] hover:text-[#635bff]',
                    statusActive: 'bg-emerald-500/20 text-emerald-400',
                    loadingSpinner: 'border-[#635bff]',
                };
            case 'portrait':
                return {
                    bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
                    headerBg: 'bg-white/80 backdrop-blur-sm',
                    text: 'text-gray-900',
                    subtext: 'text-gray-500',
                    cardBg: 'bg-white/80 backdrop-blur-sm',
                    cardBorder: 'border-pink-100',
                    iconColor1: 'text-pink-500',
                    iconColor2: 'text-purple-500',
                    priceColor: 'text-pink-600',
                    buttonPrimary: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90',
                    buttonSecondary: 'border-pink-200 hover:border-pink-400 hover:text-pink-600',
                    statusActive: 'bg-emerald-50 text-emerald-600',
                    loadingSpinner: 'border-pink-500',
                };
            case 'classic':
                return {
                    bg: 'bg-[#fafafa]',
                    headerBg: 'bg-white',
                    text: 'text-gray-900',
                    subtext: 'text-gray-500',
                    cardBg: 'bg-white',
                    cardBorder: 'border-gray-100',
                    iconColor1: 'text-[#635bff]',
                    iconColor2: 'text-[#00d4ff]',
                    priceColor: 'text-[#635bff]',
                    buttonPrimary: 'bg-[#635bff] hover:bg-[#5851e8]',
                    buttonSecondary: 'border-gray-200 hover:border-[#635bff] hover:text-[#635bff]',
                    statusActive: 'bg-emerald-50 text-emerald-600',
                    loadingSpinner: 'border-[#635bff]',
                };
            case 'pop':
            default:
                return {
                    bg: 'bg-[#fafafa]',
                    headerBg: 'bg-white',
                    text: 'text-gray-900',
                    subtext: 'text-gray-500',
                    cardBg: 'bg-white',
                    cardBorder: 'border-gray-100',
                    iconColor1: 'text-[#635bff]',
                    iconColor2: 'text-[#00d4ff]',
                    priceColor: 'text-[#635bff]',
                    buttonPrimary: 'bg-[#635bff] hover:bg-[#5851e8]',
                    buttonSecondary: 'border-gray-200 hover:border-[#635bff] hover:text-[#635bff]',
                    statusActive: 'bg-emerald-50 text-emerald-600',
                    loadingSpinner: 'border-[#635bff]',
                };
        }
    };

    const themeColors = getThemeColors();

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get(`/subscription/${id}`);
                // Fix: Handle direct DTO response (backend default)
                if (response && response.subscriptionId) {
                    setSubscription(response);
                } else if (response.success) {
                    setSubscription(response.data);
                } else {
                    throw new Error(response.error?.message || "Failed to fetch subscription");
                }
            } catch (error) {
                console.error("Failed to fetch subscription", error);
                alert("구독 정보를 불러오는데 실패했습니다.");
                navigate('/subscription');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscription();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${themeColors.bg}`}>
                <div className={`animate-spin rounded-full h-12 w-12 border-2 ${themeColors.loadingSpinner} border-t-transparent`}></div>
            </div>
        );
    }

    if (!subscription) return null;

    return (
        <div className={`min-h-screen ${themeColors.bg} pb-20`}>
            {/* Theme Switcher */}
            <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

            {/* Christmas Background */}
            {theme === 'christmas' && <ChristmasBackground />}

            {/* Hero Header - Variant T Style */}
            <div className={`relative overflow-hidden ${themeColors.headerBg} ${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-100'}`}>
                <AnimatedGradient theme={theme} />
                <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center gap-2 ${themeColors.subtext} hover:${themeColors.iconColor1} mb-6 transition-colors group`}
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">뒤로가기</span>
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <img
                            src={subscription.productImage || '/placeholder.png'}
                            alt={subscription.productName}
                            className={`w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-lg ${theme === 'dark' ? 'shadow-[#635bff]/10 border border-gray-700' : 'shadow-[#635bff]/10 border border-gray-100'}`}
                        />
                        <h1 className={`text-3xl font-bold ${themeColors.text} mb-3`}>{subscription.productName}</h1>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                            subscription.subscriptionStatus === 'ACTIVE'
                                ? themeColors.statusActive
                                : 'bg-red-50 text-red-600'
                        }`}>
                            <Sparkles className="w-4 h-4" />
                            {subscription.subscriptionStatus === 'ACTIVE' ? '이용중' : '해지됨'}
                        </span>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${themeColors.cardBg} rounded-2xl border ${themeColors.cardBorder} overflow-hidden`}
                >
                    <div className="p-8">
                        <div className="space-y-6">
                            <div className={`flex justify-between items-center py-4 border-b ${themeColors.cardBorder}`}>
                                <div className={`flex items-center gap-3 ${themeColors.subtext}`}>
                                    <Calendar className={`w-5 h-5 ${themeColors.iconColor1}`} />
                                    시작일
                                </div>
                                <span className={`font-semibold ${themeColors.text}`}>{subscription.startDate}</span>
                            </div>
                            <div className={`flex justify-between items-center py-4 border-b ${themeColors.cardBorder}`}>
                                <div className={`flex items-center gap-3 ${themeColors.subtext}`}>
                                    <Calendar className={`w-5 h-5 ${themeColors.iconColor2}`} />
                                    다음 결제일 (종료일)
                                </div>
                                <span className={`font-semibold ${themeColors.text}`}>{subscription.endDate}</span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <div className={`flex items-center gap-3 ${themeColors.subtext}`}>
                                    <CreditCard className={`w-5 h-5 ${themeColors.iconColor1}`} />
                                    결제 금액
                                </div>
                                <span className={`font-bold text-2xl ${themeColors.priceColor}`}>{subscription.price?.toLocaleString()}원</span>
                            </div>
                        </div>

                        {subscription.subscriptionStatus === 'ACTIVE' && (
                            <div className="mt-10 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/subscription/${id}/edit`)}
                                    className={`flex-1 flex items-center justify-center gap-2 ${themeColors.cardBg} border-2 ${themeColors.buttonSecondary} ${themeColors.text} py-3.5 rounded-full font-bold transition-colors`}
                                >
                                    <Settings className="w-5 h-5" />
                                    옵션 변경
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/subscription/${id}/cancel`)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3.5 rounded-full font-bold hover:bg-red-100 transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                    구독 해지
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GetSubscription;
