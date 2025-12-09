import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import httpClient from '../../api/httpClient';

const AddSubscription = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // URL 파라미터에서 시작일/종료일 추출
    const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || '';

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
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
                navigate('/product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId, navigate]);

    const handleSubscribeClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmSubscribe = async () => {
        try {
            const requestBody = {
                productId: Number(productId),
                subscriptionStartDate: startDate,
                subscriptionEndDate: endDate || null
            };

            const response = await httpClient.post('/subscription', requestBody);
            if (response.success) {
                alert('구독이 성공적으로 신청되었습니다!');
                navigate('/subscriptions');
            } else {
                alert(response.error?.message || '구독 신청에 실패했습니다.');
            }
        } catch (error) {
            console.error("Failed to subscribe", error);
            alert('구독 신청에 실패했습니다.');
        }
        setShowConfirmModal(false);
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (!product) return null;

    return (
        <div className="container mx-auto px-4 py-12 max-w-xl">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                <h1 className="text-2xl font-bold mb-2 text-center">구독 신청</h1>
                <p className="text-gray-500 mb-8 text-center">선택하신 상품의 구독 정보를 확인해주세요.</p>

                {/* 상품 정보 */}
                <div className="bg-gray-50 p-6 rounded-xl mb-6 text-center">
                    <img
                        src={product.image || '/placeholder.png'}
                        alt={product.productName}
                        className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{product.productName}</h3>
                    <p className="text-indigo-600 font-bold text-2xl">
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
                        onClick={handleSubscribeClick}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        구독 시작하기
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-white border border-gray-300 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                    >
                        취소
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6 animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-extrabold text-stone-900 mb-2">구독 내용을 확인해주세요</h2>
                        <p className="text-stone-500 text-sm mb-6">아래 내용으로 내 구독 일정에 등록하시겠습니까?</p>

                        <div className="bg-stone-50 rounded-2xl p-4 mb-6 text-left space-y-3 border border-stone-100">
                            <div className="flex justify-between">
                                <span className="text-stone-500 text-sm">서비스</span>
                                <span className="font-bold text-stone-900">{product.productName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500 text-sm">월 구독료</span>
                                <span className="font-bold text-stone-900">₩{product.price?.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-stone-200 my-2"></div>
                            <div className="flex justify-between">
                                <span className="text-stone-500 text-sm">시작일 (결제일)</span>
                                <span className="font-bold text-orange-600">{startDate}</span>
                            </div>
                            {endDate && (
                                <div className="flex justify-between">
                                    <span className="text-stone-500 text-sm">종료일</span>
                                    <span className="font-bold text-orange-600">{endDate}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold hover:bg-stone-200 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmSubscribe}
                                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddSubscription;
