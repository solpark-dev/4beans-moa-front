import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { useThemeStore } from '@/store/themeStore';

// 테마별 스타일
const modalThemeStyles = {
    default: {
        modalShadow: 'shadow-2xl',
        spinnerBorder: 'border-indigo-600',
        priceText: 'text-indigo-600',
        submitButton: 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200',
    },
    christmas: {
        modalShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        spinnerBorder: 'border-[#c41e3a]',
        priceText: 'text-[#c41e3a]',
        submitButton: 'bg-[#c41e3a] hover:bg-red-700 shadow-lg shadow-red-200',
    },
    pop: {
        modalShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        spinnerBorder: 'border-pink-500',
        priceText: 'text-pink-500',
        submitButton: 'bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-200',
    },
};

const AddSubscriptionModal = ({ productId, startDate, endDate, onClose, onSuccess, user }) => {
    const { theme } = useThemeStore();
    const themeStyle = modalThemeStyles[theme] || modalThemeStyles.default;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            try {
                const response = await httpClient.get(`/product/${productId}`);
                if (response.success) {
                    setProduct(response.data);
                } else {
                    throw new Error(response.error?.message || "Failed to fetch product");
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
                alert("상품 정보를 불러오는데 실패했습니다.");
                onClose();
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId, onClose]);

    const handleSubscribe = async () => {
        if (submitting) return;

        setSubmitting(true);
        try {
            // 디버깅용 로그
            console.log('=== 구독 신청 디버깅 ===');
            console.log('전달받은 user:', user);
            console.log('productId:', productId);
            console.log('startDate:', startDate);
            console.log('endDate:', endDate);

            const requestBody = {
                userId: user?.userId,
                productId: Number(productId),
                subscriptionStatus: 'ACTIVE',
                startDate: startDate,
                endDate: endDate || null
            };

            console.log('전송할 requestBody:', requestBody);

            const response = await httpClient.post('/subscription', requestBody);
            console.log('응답:', response);
            if (response.success) {
                alert('구독이 성공적으로 신청되었습니다!');
                if (onSuccess) onSuccess();
                onClose();
            } else {
                alert(response.error?.message || '구독 신청에 실패했습니다.');
            }
        } catch (error) {
            console.error("Failed to subscribe", error);
            alert('구독 신청에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!productId) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={`bg-white w-full max-w-xl rounded-[2rem] ${themeStyle.modalShadow} overflow-hidden animate-in zoom-in-95 duration-200 relative`}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-stone-500" />
                </button>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${themeStyle.spinnerBorder}`}></div>
                    </div>
                ) : product ? (
                    <div className="p-8">
                        <h1 className="text-2xl font-bold mb-2 text-center">구독 신청</h1>
                        <p className="text-gray-500 mb-8 text-center">선택하신 상품의 구독 정보를 확인해주세요.</p>

                        {/* 상품 정보 */}
                        <div className="bg-gray-50 p-6 rounded-xl mb-6 text-center">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.productName}
                                    className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-stone-100 rounded-lg mx-auto mb-4 flex items-center justify-center text-stone-400">
                                    No Img
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{product.productName}</h3>
                            <p className={`${themeStyle.priceText} font-bold text-2xl`}>
                                ₩{product.price?.toLocaleString()}
                                <span className="text-sm text-gray-500 font-normal ml-1">/월</span>
                            </p>
                        </div>

                        {/* 구독 일정 정보 */}
                        <div className="bg-stone-50 rounded-2xl p-5 mb-6 border border-stone-100">
                            <h4 className="font-bold text-stone-800 mb-3 text-sm">구독 일정</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600 text-sm">시작일 (결제일)</span>
                                    <span className="font-bold text-orange-600">{startDate}</span>
                                </div>
                                {endDate && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-600 text-sm">종료일</span>
                                        <span className="font-bold text-orange-600">{endDate}</span>
                                    </div>
                                )}
                                {!endDate && (
                                    <p className="text-xs text-stone-400 pt-1">종료일 미지정 - 자동 갱신으로 계속 유지됩니다</p>
                                )}
                            </div>
                        </div>

                        {/* 버튼 */}
                        <div className="space-y-3">
                            <button
                                onClick={handleSubscribe}
                                disabled={submitting}
                                className={`w-full ${themeStyle.submitButton} text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {submitting ? '처리 중...' : '구독 시작하기'}
                            </button>
                            <button
                                onClick={onClose}
                                disabled={submitting}
                                className="w-full bg-white border border-gray-300 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AddSubscriptionModal;
