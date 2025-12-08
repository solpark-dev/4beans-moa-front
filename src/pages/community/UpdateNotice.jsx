import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const UpdateNotice = () => {
    const navigate = useNavigate();
    const { communityId } = useParams();
    const { user } = useAuthStore();
    const [formData, setFormData] = useState({
        communityCodeId: 10,
        title: '',
        content: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = user?.role === 'ADMIN';
    const userId = user?.userId || 'admin@moa.com';

    useEffect(() => {
        const loadNoticeDetail = async () => {
            try {
                const response = await fetch(`/api/community/notice/${communityId}`);
                const data = await response.json();
                
                setFormData({
                    communityCodeId: data.communityCodeId,
                    title: data.title,
                    content: data.content
                });
                setIsLoading(false);
            } catch (error) {
                console.error('공지사항 로드 실패:', error);
                alert('공지사항을 불러올 수 없습니다.');
                navigate('/community/notice');
            }
        };
        
        loadNoticeDetail();
    }, [communityId, navigate]);

    if (!isAdmin) {
        return (
            <CommunityLayout>
                <div className="text-center py-20">
                    <p className="text-gray-500 mb-4">관리자만 접근 가능합니다.</p>
                    <Button onClick={() => navigate('/community/notice')}>
                        목록으로 돌아가기
                    </Button>
                </div>
            </CommunityLayout>
        );
    }

    if (isLoading) {
        return (
            <CommunityLayout>
                <div className="text-center py-20 text-gray-500">로딩 중...</div>
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

    const handleCategoryChange = (value) => {
        setFormData(prev => ({
            ...prev,
            communityCodeId: parseInt(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('제목을 입력하세요.');
            return;
        }

        if (!formData.content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }

        try {
            const response = await fetch(`/api/community/notice/${communityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: userId
                }),
            });

            if (response.ok) {
                alert('공지사항이 수정되었습니다.');
                navigate(`/community/notice/${communityId}`);
            } else {
                alert('수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('수정 실패:', error);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    const handleCancel = () => {
        navigate(`/community/notice/${communityId}`);
    };

    return (
        <CommunityLayout>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">공지사항 수정</h2>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">카테고리</Label>
                            <select
                                value={formData.communityCodeId}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="5">회원</option>
                                <option value="6">결제</option>
                                <option value="7">구독</option>
                                <option value="8">파티</option>
                                <option value="9">정산</option>
                                <option value="10">시스템</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">제목</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="제목을 입력하세요"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">내용</Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="내용을 입력하세요"
                                rows={10}
                                value={formData.content}
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            취소
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            수정
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </CommunityLayout>
    );
};

export default UpdateNotice;