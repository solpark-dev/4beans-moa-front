import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import httpClient from '../../api/httpClient';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        categoryId: '',
        image: '',
        description: '',
        productStatus: 'ACTIVE'
    });

    useEffect(() => {
        const initData = async () => {
            try {
                setLoading(true);
                // 카테고리 로드 (임시)
                setCategories([
                    { categoryId: 1, categoryName: 'Video' },
                    { categoryId: 2, categoryName: 'Music' },
                    { categoryId: 3, categoryName: 'Productivity' }
                ]);

                // 상품 정보 로드
                const response = await httpClient.get(`/product/${id}`);
                if (response.success) {
                    const product = response.data;
                    setFormData({
                        productName: product.productName,
                        price: product.price,
                        categoryId: product.categoryId,
                        image: product.image || '',
                        description: product.description || '',
                        productStatus: product.productStatus
                    });
                } else {
                    throw new Error(response.error?.message || "Failed to fetch product");
                }
            } catch (error) {
                console.error("Failed to load data", error);
                alert("데이터를 불러오는데 실패했습니다.");
                navigate('/product');
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await httpClient.put(`/product/${id}`, {
                ...formData,
                price: Number(formData.price),
                categoryId: Number(formData.categoryId)
            });
            if (response.success) {
                alert('상품 정보가 수정되었습니다.');
                navigate(`/product/${id}`);
            } else {
                alert(response.error?.message || '상품 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error("Failed to update product", error);
            alert('상품 수정에 실패했습니다.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">상품 정보 수정</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상품명</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">가격 (월)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                    <select
                        name="productStatus"
                        value={formData.productStatus}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                        <option value="ACTIVE">판매중 (ACTIVE)</option>
                        <option value="INACTIVE">판매중지 (INACTIVE)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이미지 URL</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                    />
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(`/product/${id}`)}
                        className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors"
                    >
                        수정 완료
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;
