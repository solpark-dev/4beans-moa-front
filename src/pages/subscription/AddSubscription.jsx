import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import httpClient from '../../api/httpClient';

const AddSubscription = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const handleSubscribe = async () => {
        if (!window.confirm(`${product.productName} 구독을 시작하시겠습니까?`)) return;

        try {
            const response = await httpClient.post('/subscription', { productId: Number(productId) });
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
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (!product) return null;

    return (
        <div className="container mx-auto px-4 py-12 max-w-xl">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-2">구독 신청</h1>
                <p className="text-gray-500 mb-8">선택하신 상품의 구독 정보를 확인해주세요.</p>

                <div className="bg-gray-50 p-6 rounded-xl mb-8">
                    <img
                        src={product.image || '/placeholder.png'}
                        alt={product.productName}
                        className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{product.productName}</h3>
                    <p className="text-brand-600 font-bold text-2xl">
                        {product.price?.toLocaleString()}원
                        <span className="text-sm text-gray-500 font-normal ml-1">/월</span>
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleSubscribe}
                        className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                    >
                        결제하고 구독 시작하기
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-white text-gray-500 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSubscription;
