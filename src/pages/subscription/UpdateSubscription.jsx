import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';

const UpdateSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [subscription, setSubscription] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="container mx-auto px-4 py-12 max-w-xl">
            <h1 className="text-2xl font-bold mb-8 text-center text-gray-900">구독 상품 변경</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="font-bold text-gray-700 mb-4">현재 이용 중인 상품</h2>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                    <img
                        src={subscription.productImage || '/placeholder.png'}
                        alt={subscription.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                        <p className="font-bold text-gray-900">{subscription.productName}</p>
                        <p className="text-sm text-brand-600">{subscription.price?.toLocaleString()}원/월</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="font-bold text-gray-700 mb-4">변경할 상품 선택</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {products.map(product => (
                        <div
                            key={product.productId}
                            onClick={() => setSelectedProductId(product.productId)}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedProductId === product.productId
                                    ? 'border-brand-500 bg-brand-50 shadow-sm ring-1 ring-brand-500'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={product.image || '/placeholder.png'}
                                    alt={product.productName}
                                    className="w-12 h-12 rounded-lg object-cover bg-white"
                                />
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{product.productName}</p>
                                    <p className="text-xs text-brand-600">{product.price?.toLocaleString()}원</p>
                                </div>
                            </div>
                            {selectedProductId === product.productId && (
                                <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => navigate(`/subscription/${id}`)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                    취소
                </button>
                <button
                    onClick={handleUpdate}
                    disabled={!selectedProductId || selectedProductId === subscription.productId}
                    className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors ${!selectedProductId || selectedProductId === subscription.productId
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    변경 완료
                </button>
            </div>
        </div>
    );
};

export default UpdateSubscription;
