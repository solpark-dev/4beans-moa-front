import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

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
                    <Button onClick={() => navigate('/community/faq')}>
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
            console.error('등록 실패:', error);
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    const handleCancel = () => {
        navigate('/community/faq');
    };

    return (
        <CommunityLayout>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ 등록</h2>
                
                <Card>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">질문 제목</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="질문 제목을 입력하세요"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">답변 내용</Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="답변 내용을 입력하세요"
                                value={formData.content}
                                onChange={handleChange}
                                rows={10}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-3 px-8 py-6 bg-gray-50">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                        >
                            취소
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            FAQ 등록
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </CommunityLayout>
    );
};

export default AddFaq;