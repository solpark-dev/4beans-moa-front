import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const FaqItem = ({ faq, index, isAdmin, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: faq.title,
        content: faq.content
    });

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
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
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`faq-${faq.communityId}`} className="border rounded-lg bg-white">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                    <div className="flex items-center gap-4 text-left">
                        <span className="font-bold text-blue-600 text-lg">
                            Q{index}
                        </span>
                        <span className="font-medium text-gray-900">
                            {faq.title}
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    질문 제목
                                </label>
                                <Input
                                    value={editFormData.title}
                                    onChange={(e) => handleEditChange('title', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    답변 내용
                                </label>
                                <Textarea
                                    value={editFormData.content}
                                    onChange={(e) => handleEditChange('content', e.target.value)}
                                    rows={6}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    취소
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    저장
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {faq.content}
                                </p>
                            </div>
                            {isAdmin && (
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleEditClick}
                                        variant="outline"
                                        size="sm"
                                    >
                                        수정
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default FaqItem;