import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import { NeoCard, NeoButton } from '@/components/common/neo';

const AddFaq = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [category, setCategory] = useState('회원');
    const [formData, setFormData] = useState({
        communityCodeId: 4,
        title: '',
        content: ''
    });

    const isAdmin = user?.role === 'ADMIN';
    const userId = user?.userId || 'admin@moa.com';

    const categories = ['회원', '결제', '구독', '파티', '정산', '기타'];

    if (!isAdmin) {
        return (
            <CommunityLayout>
                <div className="text-center py-20">
                    <NeoCard
                        color="bg-white"
                        hoverable={false}
                        className="inline-block px-8 py-6 rounded-2xl"
                    >
                        <p className="text-gray-600 font-bold mb-6">관리자만 접근 가능합니다.</p>
                        <NeoButton
                            onClick={() => navigate('/community/faq')}
                            color="bg-pink-500"
                            size="sm"
                        >
                            목록으로 돌아가기
                        </NeoButton>
                    </NeoCard>
                </div>
            </CommunityLayout>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('질문 제목을 입력하세요.');
            return;
        }

        if (!formData.content.trim()) {
            alert('답변 내용을 입력하세요.');
            return;
        }

        const titleWithCategory = `[${category}] ${formData.title}`;

        try {
            const response = await fetch('/api/community/faq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    title: titleWithCategory,
                    userId: userId
                }),
            });

            if (response.ok) {
                alert('FAQ가 등록되었습니다.');
                navigate('/community/faq');
            } else {
                alert('등록에 실패했습니다.');
            }
        } catch (error) {
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    const handleCancel = () => {
        navigate('/community/faq');
    };

    return (
        <CommunityLayout>
            <div className="pt-8 max-w-3xl mx-auto">
                <NeoCard
                    color="bg-cyan-400"
                    hoverable={false}
                    className="inline-block px-4 py-2 rounded-xl mb-8"
                >
                    <h2 className="text-xl font-black text-black">
                        FAQ 등록
                    </h2>
                </NeoCard>

                <div className="space-y-6">
                    {/* 카테고리 */}
                    <div>
                        <label className="block text-sm font-black text-black mb-2">
                            카테고리
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 border-4 border-black rounded-xl font-bold bg-white
                                focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* 질문 제목 */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-black text-black mb-2"
                        >
                            질문 제목
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="질문 제목을 입력하세요"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-4 border-black rounded-xl font-bold
                                focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder-gray-400"
                        />
                    </div>

                    {/* 답변 내용 */}
                    <div>
                        <label
                            htmlFor="content"
                            className="block text-sm font-black text-black mb-2"
                        >
                            답변 내용
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="답변 내용을 입력하세요"
                            value={formData.content}
                            onChange={handleChange}
                            rows={10}
                            className="w-full px-4 py-3 border-4 border-black rounded-xl font-bold resize-none
                                focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder-gray-400"
                        />
                    </div>

                    <div className="flex justify-center gap-4 pt-6">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 text-sm font-black text-black bg-white
                                border-4 border-black rounded-xl
                                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                hover:translate-x-[2px] hover:translate-y-[2px]
                                transition-all"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 text-sm font-black text-white bg-pink-500
                                border-4 border-black rounded-xl
                                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                hover:translate-x-[2px] hover:translate-y-[2px]
                                transition-all"
                        >
                            등록
                        </button>
                    </div>
                </div>
            </div>
        </CommunityLayout>
    );
};

export default AddFaq;
