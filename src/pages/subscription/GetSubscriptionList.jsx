import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../api/httpClient';

const GetSubscriptionList = () => {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get('/subscription');
                if (response.success) {
                    setSubscriptions(response.data || []);
                } else {
                    setSubscriptions([]);
                }
            } catch (error) {
                console.error("Failed to fetch subscriptions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">나의 구독 내역</h1>

            {subscriptions.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">구독 중인 상품이 없습니다.</p>
                    <button
                        onClick={() => navigate('/product')}
                        className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 transition-colors"
                    >
                        구독 상품 보러가기
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {subscriptions.map(sub => (
                        <div
                            key={sub.subscriptionId}
                            onClick={() => navigate(`/subscriptions/${sub.subscriptionId}`)}
                            className="bg-white border border-gray-200 p-5 rounded-xl flex items-center justify-between cursor-pointer hover:shadow-md transition-all hover:-translate-x-1"
                        >
                            <div className="flex items-center gap-5">
                                <img
                                    src={sub.product?.image || '/placeholder.png'}
                                    alt={sub.product?.productName}
                                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                />
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{sub.product?.productName}</h3>
                                    <p className="text-sm text-gray-500">
                                        다음 결제일: <span className="font-medium text-gray-700">{sub.nextBillingDate}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {sub.status === 'ACTIVE' ? '이용중' : '해지됨'}
                                </span>
                                <p className="font-bold text-gray-900">{sub.product?.price?.toLocaleString()}원</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GetSubscriptionList;
