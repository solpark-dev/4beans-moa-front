import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

const GetNotice = () => {
    const navigate = useNavigate();
    const params = useParams();
    const noticeId = params.id || params.communityId;
    const { user } = useAuthStore();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        if (!noticeId || noticeId === 'undefined') {
            navigate('/community/notice');
            return;
        }
        loadNotice();
    }, [noticeId]);

    const loadNotice = async () => {
        try {
            const response = await fetch(`/api/community/notice/${noticeId}`);
            
            if (!response.ok) {
                alert('공지사항을 찾을 수 없습니다.');
                navigate('/community/notice');
                return;
            }
            
            const data = await response.json();
            setNotice(data);
        } catch (error) {
            alert('공지사항을 불러오는데 실패했습니다.');
            navigate('/community/notice');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '');
    };

    const handleDelete = async () => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/community/notice/${noticeId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('삭제되었습니다.');
                navigate('/community/notice');
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return (
            <CommunityLayout>
                <div className="py-20 text-center text-gray-400">
                    로딩 중...
                </div>
            </CommunityLayout>
        );
    }

    if (!notice) {
        return (
            <CommunityLayout>
                <div className="py-20 text-center text-gray-400">
                    공지사항을 찾을 수 없습니다.
                </div>
            </CommunityLayout>
        );
    }

    return (
        <CommunityLayout>
            <div className="max-w-3xl mx-auto pt-8">
                <div className="border-b border-gray-300 pb-6 mb-6">
                    <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
                        {notice.title}
                    </h2>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>등록일: {formatDate(notice.createdAt)}</span>
                        <span>조회수: {notice.viewCount || 0}</span>
                    </div>
                </div>

                <div className="min-h-[300px] py-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                </div>

                <div className="flex items-center justify-center mt-10 pt-6 border-t border-gray-200 relative">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/community/notice')}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                        목록
                    </Button>

                    {isAdmin && (
                        <div className="absolute right-0 flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/community/notice/update/${noticeId}`)}
                                className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
                            >
                                수정
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleDelete}
                                className="border-[#e91e63] text-[#e91e63] hover:bg-[#e91e63] hover:text-white"
                            >
                                삭제
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </CommunityLayout>
    );
};

export default GetNotice;