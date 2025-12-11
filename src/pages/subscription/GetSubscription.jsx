import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Calendar, CreditCard, Settings, XCircle } from 'lucide-react';
import httpClient from '../../api/httpClient';

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

const GetSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

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
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#635bff] border-t-transparent"></div>
            </div>
        );
    }

    if (!subscription) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] pb-20">
            {/* Hero Header - Variant T Style */}
            <div className="relative overflow-hidden bg-white border-b border-gray-100">
                <AnimatedGradient />
                <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
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
                        className="text-center"
                    >
                        <img
                            src={subscription.productImage || '/placeholder.png'}
                            alt={subscription.productName}
                            className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-lg shadow-[#635bff]/10 border border-gray-100"
                        />
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{subscription.productName}</h1>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                            subscription.subscriptionStatus === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-600'
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
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                    <div className="p-8">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Calendar className="w-5 h-5 text-[#635bff]" />
                                    시작일
                                </div>
                                <span className="font-semibold text-gray-900">{subscription.startDate}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Calendar className="w-5 h-5 text-[#00d4ff]" />
                                    다음 결제일 (종료일)
                                </div>
                                <span className="font-semibold text-gray-900">{subscription.endDate}</span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <CreditCard className="w-5 h-5 text-[#635bff]" />
                                    결제 금액
                                </div>
                                <span className="font-bold text-2xl text-[#635bff]">{subscription.price?.toLocaleString()}원</span>
                            </div>
                        </div>

                        {subscription.subscriptionStatus === 'ACTIVE' && (
                            <div className="mt-10 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/subscription/${id}/edit`)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-full font-bold hover:border-[#635bff] hover:text-[#635bff] transition-colors"
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
