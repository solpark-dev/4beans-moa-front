import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { ChristmasBackground } from '@/config/themeConfig';
import { getProductIconUrl } from '@/utils/imageUtils';

const UpdateSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    const [subscription, setSubscription] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper function for theme-specific accent color
    const getAccentColor = () => {
        switch (theme) {
            case 'pop':
                return '#ec4899'; // pink-500
            case 'christmas':
                return '#c41e3a';
            case 'dark':
            case 'classic':
            default:
                return '#635bff';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Fetch current subscription
                const subResponse = await httpClient.get(`/subscription/${id}`);
                let currentSub = null;
                if (subResponse && subResponse.subscriptionId) {
                    currentSub = subResponse;
                } else if (subResponse.success) {
                    currentSub = subResponse.data;
                }

                if (currentSub) {
                    setSubscription(currentSub);
                    setSelectedProductId(currentSub.productId);
                }

                // 2. Fetch all products
                const prodResponse = await httpClient.get('/product');
                if (prodResponse.success) {
                    setProducts(prodResponse.data);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
                alert("데이터를 불러오는데 실패했습니다.");
                navigate(`/subscription/${id}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleUpdate = async () => {
        if (!selectedProductId) return;

        // Validation: Cannot change to same product
        if (selectedProductId === subscription.productId) {
            alert("이미 이용 중인 상품입니다.");
            return;
        }

        if (window.confirm("선택한 상품으로 구독을 변경하시겠습니까?")) {
            try {
                const updateData = {
                    ...subscription,
                    productId: selectedProductId,
                    subscriptionStatus: 'ACTIVE' // Ensure status is active
                };

                await httpClient.put('/subscription', updateData);
                alert("구독 상품이 변경되었습니다.");
                navigate(`/subscription/${id}`);
            } catch (error) {
                console.error("Failed to update subscription", error);
                alert("구독 변경에 실패했습니다.");
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (!subscription) return null;

    const accentColor = getAccentColor();

    return (
        <div className="container mx-auto px-4 py-12 max-w-xl relative">
            {theme === 'christmas' && <ChristmasBackground />}

            <h1 className={`text-2xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>구독 상품 변경</h1>

            <div className={`rounded-2xl shadow-sm border p-6 mb-6 relative z-10 ${theme === 'dark'
                    ? 'bg-[#1E293B] border-slate-700'
                    : theme === 'christmas'
                        ? 'bg-white/95 backdrop-blur-sm border-red-200'
                        : 'bg-white border-gray-200'
                }`}>
                <h2 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'
                    }`}>현재 이용 중인 상품</h2>
                <div className={`flex items-center gap-4 p-4 rounded-xl ${theme === 'dark'
                        ? 'bg-[#0B1120]'
                        : theme === 'christmas'
                            ? 'bg-red-50/50'
                            : 'bg-gray-50'
                    }`}>
                    <img
                        src={getProductIconUrl(subscription.productImage) || '/placeholder.png'}
                        alt={subscription.productName}
                        className="w-16 h-16 rounded-lg object-contain p-1 bg-white"
                    />
                    <div>
                        <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{subscription.productName}</p>
                        <p className="text-sm" style={{ color: accentColor }}>
                            {subscription.price?.toLocaleString()}원/월
                        </p>
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl shadow-sm border p-6 mb-8 relative z-10 ${theme === 'dark'
                    ? 'bg-[#1E293B] border-slate-700'
                    : theme === 'christmas'
                        ? 'bg-white/95 backdrop-blur-sm border-red-200'
                        : 'bg-white border-gray-200'
                }`}>
                <h2 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'
                    }`}>변경할 상품 선택</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {products.map(product => {
                        const isSelected = selectedProductId === product.productId;
                        return (
                            <div
                                key={product.productId}
                                onClick={() => setSelectedProductId(product.productId)}
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                        ? theme === 'dark'
                                            ? 'border-[#635bff] bg-[#635bff]/10 shadow-sm ring-1 ring-[#635bff]'
                                            : 'shadow-sm ring-1'
                                        : theme === 'dark'
                                            ? 'border-slate-700 hover:border-slate-600 hover:bg-[#0B1120]'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                style={isSelected ? {
                                    borderColor: accentColor,
                                    backgroundColor: theme === 'dark' ? `${accentColor}20` : `${accentColor}10`,
                                    ringColor: accentColor
                                } : {}}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={getProductIconUrl(product.image) || '/placeholder.png'}
                                        alt={product.productName}
                                        className="w-12 h-12 rounded-lg object-contain p-1 bg-white"
                                    />
                                    <div>
                                        <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>{product.productName}</p>
                                        <p className="text-xs" style={{ color: accentColor }}>
                                            {product.price?.toLocaleString()}원
                                        </p>
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: accentColor }}>
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-3 relative z-10">
                <button
                    onClick={() => navigate(`/subscription/${id}`)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-colors ${theme === 'dark'
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    취소
                </button>
                <button
                    onClick={handleUpdate}
                    disabled={!selectedProductId || selectedProductId === subscription.productId}
                    className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors ${!selectedProductId || selectedProductId === subscription.productId
                            ? theme === 'dark'
                                ? 'bg-slate-600 cursor-not-allowed'
                                : 'bg-gray-300 cursor-not-allowed'
                            : 'shadow-md hover:shadow-lg'
                        }`}
                    style={!selectedProductId || selectedProductId === subscription.productId ? {} : {
                        backgroundColor: accentColor
                    }}
                    onMouseEnter={(e) => {
                        if (!(!selectedProductId || selectedProductId === subscription.productId)) {
                            e.currentTarget.style.opacity = '0.9';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!(!selectedProductId || selectedProductId === subscription.productId)) {
                            e.currentTarget.style.opacity = '1';
                        }
                    }}
                >
                    변경 완료
                </button>
            </div>
        </div>
    );
};

export default UpdateSubscription;
