import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NeoCard, NeoButton } from '@/components/common/neo';

const FaqItem = ({ faq, index, isAdmin, onUpdate, getCategoryFromTitle, isOpen, onToggle }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editCategory, setEditCategory] = useState('');
    const [editFormData, setEditFormData] = useState({
        title: '',
        content: faq.content
    });

    const categories = ['회원', '결제', '구독', '파티', '정산', '기타'];
    const category = getCategoryFromTitle ? getCategoryFromTitle(faq.title) : '기타';

    const getDisplayTitle = (title) => {
        return title.replace(/\[.*?\]\s*/, '');
    };

    const handleToggle = () => {
        if (!isEditing) {
            onToggle(faq.communityId);
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        if (!isOpen) {
            onToggle(faq.communityId);
        }
        setEditCategory(category);
        setEditFormData({
            title: getDisplayTitle(faq.title),
            content: faq.content
        });
    };

    const handleEditChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!editFormData.title.trim()) {
            alert('질문 제목을 입력하세요.');
            return;
        }

        if (!editFormData.content.trim()) {
            alert('답변 내용을 입력하세요.');
            return;
        }

        const titleWithCategory = `[${editCategory}] ${editFormData.title}`;
        const success = await onUpdate(faq.communityId, {
            title: titleWithCategory,
            content: editFormData.content
        });
        if (success) {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditCategory(category);
        setEditFormData({
            title: getDisplayTitle(faq.title),
            content: faq.content
        });
    };

    return (
        <div className="mb-4">
            <NeoCard
                color="bg-white"
                hoverable={false}
                className="rounded-2xl overflow-hidden"
            >
                {/* Question Header */}
                <div
                    onClick={handleToggle}
                    className="flex items-center p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                    <span className="px-3 py-1 text-sm font-black bg-pink-500 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mr-4">
                        {category}
                    </span>
                    <span className="flex-1 font-bold text-black">
                        {getDisplayTitle(faq.title)}
                    </span>
                    <ChevronDown
                        className={`w-6 h-6 text-black transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>

                {/* Answer Content */}
                {isOpen && (
                    <div className="border-t-4 border-black p-5 bg-slate-50">
                        {isEditing ? (
                            <div className="space-y-4">
                                {/* 카테고리 + 제목 한 줄 */}
                                <div className="flex gap-3">
                                    <select
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        className="px-3 py-2 border-4 border-black rounded-xl font-black bg-white
                                            focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <input
                                        value={editFormData.title}
                                        onChange={(e) => handleEditChange('title', e.target.value)}
                                        placeholder="질문 제목"
                                        className="flex-1 px-4 py-2 border-4 border-black rounded-xl font-bold
                                            focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    />
                                </div>
                                {/* 답변 내용 */}
                                <textarea
                                    value={editFormData.content}
                                    onChange={(e) => handleEditChange('content', e.target.value)}
                                    rows={6}
                                    placeholder="답변 내용"
                                    className="w-full px-4 py-3 border-4 border-black rounded-xl font-bold resize-none
                                        focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                />
                                <div className="flex gap-3 justify-end">
                                    <NeoButton
                                        color="bg-white"
                                        size="sm"
                                        onClick={handleCancel}
                                    >
                                        취소
                                    </NeoButton>
                                    <NeoButton
                                        color="bg-cyan-400"
                                        size="sm"
                                        onClick={handleSave}
                                    >
                                        저장
                                    </NeoButton>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                                    {faq.content}
                                </p>
                                {isAdmin && (
                                    <div className="flex justify-end mt-4">
                                        <NeoButton
                                            color="bg-lime-400"
                                            size="sm"
                                            onClick={handleEditClick}
                                        >
                                            수정
                                        </NeoButton>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </NeoCard>
        </div>
    );
};

export default FaqItem;
