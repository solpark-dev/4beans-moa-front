import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const GetNotice = () => {
    const navigate = useNavigate();
    const { communityId } = useParams();
    const [notice, setNotice] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        checkUserRole();
        loadNoticeDetail();
    }, [communityId]);

    const checkUserRole = () => {
        const userRole = sessionStorage.getItem('role');
        setIsAdmin(userRole === 'ADMIN');
    };

    const loadNoticeDetail = async () => {
        try {
            const response = await fetch(`/api/community/notice/${communityId}`);
            const data = await response.json();
            setNotice(data);
        } catch (error) {
            console.error('공지사항 상세 로드 실패:', error);
            alert('공지사항을 불러올 수 없습니다.');
            navigate('/community/notice');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const goToList = () => {
        navigate('/community/notice');
    };

    const goToUpdate = () => {
        navigate(`/community/notice/update/${communityId}`);
    };

    if (!notice) {
        return (
            <CommunityLayout>
                <div className="text-center py-20 text-gray-500">로딩 중...</div>
            </CommunityLayout>
        );
    }

    return (
        <CommunityLayout>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">공지 #{notice.communityId}</h2>

            <Card>
                <CardHeader className="border-b border-gray-200">
                    <div className="mb-3">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                            {notice.categoryName}
                        </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{notice.title}</h3>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <span>작성일: {formatDate(notice.createdAt)}</span>
                        <span>조회수: {notice.viewCount || 0}</span>
                    </div>
                </CardHeader>

                <CardContent className="min-h-[300px] p-8">
                    <div 
                        className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: notice.content.replace(/\n/g, '<br/>') }}
                    />
                </CardContent>

                <CardFooter className="bg-gray-50 border-t border-gray-200 flex justify-between">
                    <Button variant="outline" onClick={goToList}>
                        목록
                    </Button>
                    {isAdmin && (
                        <Button onClick={goToUpdate} className="bg-blue-600 hover:bg-blue-700">
                            수정
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </CommunityLayout>
    );
};

export default GetNotice;