import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';

const GetProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get(`/product/${id}`);
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
    }, [id, navigate]);

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (!product) return null;

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 bg-gray-100 aspect-video md:aspect-auto relative">
                        {product.image ? (
                            <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {product.categoryName || '구독'}
                                </span>
                                {product.productStatus === 'INACTIVE' && (
                                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                                        판매중지
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.productName}</h1>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {product.description || '상품 설명이 없습니다.'}
                            </p>
                            <div className="text-3xl font-bold text-brand-600 mb-8">
                                {product.price?.toLocaleString()}원
                                <span className="text-base text-gray-400 font-normal ml-1">/월</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-auto">
                            {user?.role === 'ADMIN' ? (
                                <>
                                    <button
                                        onClick={() => navigate(`/product/${id}/edit`)}
                                        className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        수정하기
                                    </button>
                                    <button
                                        onClick={() => navigate(`/product/${id}/delete`)}
                                        className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors"
                                    >
                                        삭제하기
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate(`/subscriptions/add/${id}`)}
                                    className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                                >
                                    구독 시작하기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetProduct;
