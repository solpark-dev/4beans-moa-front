import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown } from 'lucide-react';

const FaqItem = ({ faq, index, isAdmin, onUpdate, getCategoryFromTitle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: faq.title,
        content: faq.content
    });

    const category = getCategoryFromTitle ? getCategoryFromTitle(faq.title) : '기타';
    
    const getDisplayTitle = (title) => {
        return title.replace(/\[.*?\]\s*/, '');
    };

    const handleToggle = () => {
        if (!isEditing) {
            setIsOpen(!isOpen);
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        setIsOpen(true);
        setEditFormData({
            title: faq.title,
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

        const success = await onUpdate(faq.communityId, editFormData);
        if (success) {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditFormData({
            title: faq.title,
            content: faq.content
        });
    };

    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <div 
                onClick={handleToggle}
                className="flex items-center py-5 cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <span className="w-20 text-sm text-[#e91e63] font-medium flex-shrink-0">
                    {category}
                </span>
                <span className="flex-1 text-[#1e3a5f] font-medium">
                    {getDisplayTitle(faq.title)}
                </span>
                <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {isOpen && (
                <div className="pb-6 pl-20">
                    {isEditing ? (
                        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                                    질문 제목
                                </label>
                                <Input
                                    value={editFormData.title}
                                    onChange={(e) => handleEditChange('title', e.target.value)}
                                    className="w-full border-gray-300 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                                    답변 내용
                                </label>
                                <Textarea
                                    value={editFormData.content}
                                    onChange={(e) => handleEditChange('content', e.target.value)}
                                    rows={6}
                                    className="w-full border-gray-300 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="border-gray-300 text-gray-600"
                                >
                                    취소
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
                                >
                                    저장
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {faq.content}
                            </p>
                            {isAdmin && (
                                <div className="flex justify-end mt-4">
                                    <Button
                                        onClick={handleEditClick}
                                        variant="outline"
                                        size="sm"
                                        className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
                                    >
                                        수정
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FaqItem;