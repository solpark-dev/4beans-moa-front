import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { ThemeSwitcher } from '@/config/themeConfig';
import { getProductIconUrl } from '@/utils/imageUtils';
import { themeClasses } from '@/utils/themeUtils';

const GetSubscriptionList = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        if (!user?.userId) {
            console.warn("User ID missing in authStore, skipping fetch");
            setLoading(false);
            return;
        }

        const fetchSubscriptions = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get('/subscription', {
                    params: { userId: user.userId }
                });

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
        <div className={`min-h-screen ${themeClasses.bg.base} flex justify-center items-center`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--theme-primary)]"></div>
        </div>
    );

    return (
        <div className={`min-h-screen ${themeClasses.bg.base}`}>
            {/* Theme Switcher */}
            <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className={`text-2xl font-bold mb-8 ${themeClasses.text.primary}`}>
                    {theme === 'christmas' ? '🎄 나의 구독 내역' : '나의 구독 내역'}
                </h1>

                {subscriptions.length === 0 ? (
                    <div className={`text-center py-20 ${themeClasses.bg.card} bg-opacity-50 border border-dashed border-[var(--theme-border-light)] rounded-2xl`}>
                        <p className={`mb-4 ${themeClasses.text.muted}`}>구독 중인 상품이 없습니다.</p>
                        <button
                            onClick={() => navigate('/product')}
                            className={`px-6 py-2 ${themeClasses.button.primary}`}
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
                                className={`p-5 flex items-center justify-between cursor-pointer relative z-10 ${themeClasses.card.elevated}`}
                            >
                                <div className="flex items-center gap-5">
                                    <img
                                        src={getProductIconUrl(sub.productImage) || '/placeholder.png'}
                                        alt={sub.productName}
                                        className="w-16 h-16 rounded-lg object-contain p-1 bg-[var(--theme-border-light)]"
                                    />
                                    <div>
                                        <h3 className={`font-bold text-lg ${themeClasses.text.primary}`}>{sub.productName}</h3>
                                        <p className={`text-sm ${themeClasses.text.muted}`}>
                                            시작일: <span className={`font-medium ${themeClasses.text.primary}`}>{sub.startDate}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block mb-2 ${sub.subscriptionStatus === 'ACTIVE'
                                        ? themeClasses.badge.secondary
                                        : 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold'
                                        }`}>
                                        {sub.subscriptionStatus === 'ACTIVE' ? '이용중' : '해지됨'}
                                    </span>
                                    <p className={`font-bold ${themeClasses.text.primary}`}>{sub.price?.toLocaleString()}원</p>
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
