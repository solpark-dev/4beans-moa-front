import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { ThemeSwitcher, ChristmasBackground } from '@/config/themeConfig';

// Theme-based styles
const getThemeStyles = (theme) => {
    switch (theme) {
        case 'christmas':
            return {
                bg: 'bg-transparent',
                text: 'text-gray-900',
                subtext: 'text-gray-500',
                title: 'text-gray-900',
                cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
                cardHover: 'hover:shadow-[0_10px_25px_-5px_rgba(196,30,58,0.2)]',
                empty: 'bg-white/80 backdrop-blur-sm border border-dashed border-gray-300 rounded-2xl',
                buttonPrimary: 'bg-[#c41e3a] hover:bg-[#a51830] text-white',
                statusActive: 'bg-green-100 text-green-700',
                statusInactive: 'bg-red-100 text-red-700',
            };
        case 'dark':
            return {
                bg: 'bg-[#0B1120]',
                text: 'text-white',
                subtext: 'text-gray-400',
                title: 'text-white',
                cardBg: 'bg-[#1E293B] border border-gray-700 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
                cardHover: 'hover:shadow-[0_10px_25px_-5px_rgba(99,91,255,0.2)]',
                empty: 'bg-[#1E293B] border border-dashed border-gray-700 rounded-2xl',
                buttonPrimary: 'bg-[#635bff] hover:bg-[#5851e8] text-white',
                statusActive: 'bg-green-900/50 text-green-400',
                statusInactive: 'bg-red-900/50 text-red-400',
            };
        case 'portrait':
            return {
                bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
                text: 'text-gray-900',
                subtext: 'text-gray-500',
                title: 'text-gray-900',
                cardBg: 'bg-white/80 backdrop-blur-sm border border-pink-200 rounded-xl shadow-[4px_4px_12px_rgba(255,181,197,0.2)]',
                cardHover: 'hover:shadow-[0_10px_25px_-5px_rgba(255,181,197,0.3)]',
                empty: 'bg-white/80 backdrop-blur-sm border border-dashed border-pink-300 rounded-2xl',
                buttonPrimary: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90 text-white',
                statusActive: 'bg-green-100 text-green-700',
                statusInactive: 'bg-red-100 text-red-700',
            };
        case 'pop':
            return {
                bg: 'bg-slate-50',
                text: 'text-black',
                subtext: 'text-gray-600',
                title: 'text-black',
                cardBg: 'bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]',
                cardHover: 'hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-x-1',
                empty: 'bg-white border-2 border-dashed border-black rounded-2xl',
                buttonPrimary: 'bg-pink-500 hover:bg-pink-600 text-white border-2 border-black',
                statusActive: 'bg-lime-300 text-black border border-black',
                statusInactive: 'bg-red-300 text-black border border-black',
            };
        case 'classic':
            return {
                bg: 'bg-white',
                text: 'text-gray-900',
                subtext: 'text-gray-500',
                title: 'text-gray-900',
                cardBg: 'bg-white border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
                cardHover: 'hover:shadow-[0_10px_25px_-5px_rgba(99,91,255,0.15)]',
                empty: 'bg-gray-50 border border-dashed border-gray-300 rounded-2xl',
                buttonPrimary: 'bg-[#635bff] hover:bg-[#5851e8] text-white',
                statusActive: 'bg-green-100 text-green-700',
                statusInactive: 'bg-red-100 text-red-700',
            };
        default:
            return {
                bg: 'bg-white',
                text: 'text-gray-900',
                subtext: 'text-gray-500',
                title: 'text-gray-900',
                cardBg: 'bg-white border border-gray-200 rounded-xl',
                cardHover: 'hover:shadow-md hover:-translate-x-1',
                empty: 'bg-gray-50 border border-dashed border-gray-300 rounded-2xl',
                buttonPrimary: 'bg-brand-600 hover:bg-brand-700 text-white',
                statusActive: 'bg-green-100 text-green-700',
                statusInactive: 'bg-red-100 text-red-700',
            };
    }
};

const GetSubscriptionList = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme, setTheme } = useThemeStore();
    const themeStyles = getThemeStyles(theme);

    useEffect(() => {
        console.log("GetSubscriptionList Mounted. User:", user);

        if (!user?.userId) {
            console.warn("User ID missing in authStore, skipping fetch");
            setLoading(false);
            return;
        }

        const fetchSubscriptions = async () => {
            try {
                console.log("Fetching subscriptions for userId:", user.userId);
                setLoading(true);
                const response = await httpClient.get('/subscription', {
                    params: { userId: user.userId }
                });
                console.log("Subscription Response:", response);

                if (Array.isArray(response)) {
                    setSubscriptions(response);
                } else if (response && response.success) {
                    setSubscriptions(response.data || []);
                } else {
                    console.warn("Unexpected response format:", response);
                    setSubscriptions([]);
                }
            } catch (error) {
                console.error("Failed to fetch subscriptions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, [user]);

    if (loading) return (
        <div className={`min-h-screen ${themeStyles.bg} flex justify-center items-center`}>
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-[#635bff]' : 'border-indigo-600'}`}></div>
        </div>
    );

    return (
        <div className={`min-h-screen ${themeStyles.bg}`}>
            {/* Theme Switcher */}
            <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

            {/* Christmas Background */}
            {theme === 'christmas' && <ChristmasBackground />}

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className={`text-2xl font-bold mb-8 ${themeStyles.title}`}>
                    {theme === 'christmas' ? '🎄 나의 구독 내역' : '나의 구독 내역'}
                </h1>

                {subscriptions.length === 0 ? (
                    <div className={`text-center py-20 ${themeStyles.empty}`}>
                        <p className={`mb-4 ${themeStyles.subtext}`}>구독 중인 상품이 없습니다.</p>
                        <button
                            onClick={() => navigate('/product')}
                            className={`px-6 py-2 rounded-lg font-bold transition-colors ${themeStyles.buttonPrimary}`}
                        >
                            구독 상품 보러가기
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {subscriptions.map(sub => (
                            <div
                                key={sub.subscriptionId}
                                onClick={() => navigate(`/subscription/${sub.subscriptionId}`)}
                                className={`p-5 flex items-center justify-between cursor-pointer transition-all ${themeStyles.cardBg} ${themeStyles.cardHover}`}
                            >
                                <div className="flex items-center gap-5">
                                    <img
                                        src={sub.productImage || '/placeholder.png'}
                                        alt={sub.productName}
                                        className={`w-16 h-16 rounded-lg object-cover ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                                    />
                                    <div>
                                        <h3 className={`font-bold text-lg ${themeStyles.text}`}>{sub.productName}</h3>
                                        <p className={`text-sm ${themeStyles.subtext}`}>
                                            시작일: <span className={`font-medium ${themeStyles.text}`}>{sub.startDate}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${sub.subscriptionStatus === 'ACTIVE'
                                            ? themeStyles.statusActive
                                            : themeStyles.statusInactive
                                        }`}>
                                        {sub.subscriptionStatus === 'ACTIVE' ? '이용중' : '해지됨'}
                                    </span>
                                    <p className={`font-bold ${themeStyles.text}`}>{sub.price?.toLocaleString()}원</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GetSubscriptionList;
