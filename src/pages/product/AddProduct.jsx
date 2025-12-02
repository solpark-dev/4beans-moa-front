import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../api/httpClient';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        categoryId: '',
        image: '',
        description: '',
        productStatus: 'ACTIVE'
    });

    useEffect(() => {
        // 카테고리 로드 (임시)
        setCategories([
            { categoryId: 1, categoryName: 'Video' },
            { categoryId: 2, categoryName: 'Music' },
            { categoryId: 3, categoryName: 'Productivity' }
        ]);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await httpClient.post('/product', {
                ...formData,
                price: Number(formData.price),
                categoryId: Number(formData.categoryId)
            });
            if (response.success) {
                alert('상품이 등록되었습니다.');
                navigate('/product');
            } else {
                alert(response.error?.message || '상품 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error("Failed to add product", error);
            alert('상품 등록에 실패했습니다.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">새로운 구독 상품 등록</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상품명</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                        placeholder="예: Netflix Premium"
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
                            <option value="">선택하세요</option>
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
                            placeholder="0"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이미지 URL</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                        placeholder="https://example.com/image.png"
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
                        placeholder="상품에 대한 설명을 입력해주세요."
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors text-lg"
                    >
                        상품 등록하기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
