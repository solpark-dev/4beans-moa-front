import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const AddFaq = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [formData, setFormData] = useState({
        communityCodeId: 4,
        title: '',
        content: ''
    });

    const isAdmin = user?.role === 'ADMIN';
    const userId = user?.userId || 'admin@moa.com';

    if (!isAdmin) {
        return (
            <CommunityLayout>
                <div className="text-center py-20">
                    <p className="text-gray-500 mb-4">관리자만 접근 가능합니다.</p>
                    <Button 
                        onClick={() => navigate('/community/faq')}
                        className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
                    >
                        목록으로 돌아가기
                    </Button>
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

        try {
            const response = await fetch('/api/community/faq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
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
            <div className="max-w-2xl mx-auto pt-8">
                <h2 className="text-2xl font-bold text-[#1e3a5f] text-center mb-10">
                    FAQ 등록
                </h2>
                
                <div className="space-y-8">
                    <div className="space-y-3">
                        <Label 
                            htmlFor="title"
                            className="text-sm font-medium text-[#1e3a5f]"
                        >
                            질문 제목
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="질문 제목을 입력하세요"
                            value={formData.title}
                            onChange={handleChange}
                            className="border-0 border-b border-gray-300 rounded-none px-0 focus:border-[#1e3a5f] focus:ring-0"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label 
                            htmlFor="content"
                            className="text-sm font-medium text-[#1e3a5f]"
                        >
                            답변 내용
                        </Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="답변 내용을 입력하세요"
                            value={formData.content}
                            onChange={handleChange}
                            rows={10}
                            className="border border-gray-300 rounded-lg focus:border-[#1e3a5f] focus:ring-0 resize-none"
                        />
                    </div>

                    <div className="flex justify-center gap-4 pt-6">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="w-32 border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                            취소
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="w-32 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
                        >
                            등록
                        </Button>
                    </div>
                </div>
            </div>
        </CommunityLayout>
    );
};

export default AddFaq;