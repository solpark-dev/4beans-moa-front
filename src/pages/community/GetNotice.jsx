import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import { NeoCard, NeoButton } from '@/components/common/neo';

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

    if (loading) {
        return (
            <CommunityLayout>
                <div className="py-20 text-center">
                    <span className="font-black text-gray-400">로딩 중...</span>
                </div>
            </CommunityLayout>
        );
    }

    if (!notice) {
        return (
            <CommunityLayout>
                <div className="py-20 text-center">
                    <span className="font-black text-gray-400">공지사항을 찾을 수 없습니다.</span>
                </div>
            </CommunityLayout>
        );
    }

    return (
        <CommunityLayout>
            <div className="max-w-3xl mx-auto pt-8">
                <div className="border-b-4 border-black pb-6 mb-6">
                    <h2 className="text-xl font-black text-black mb-4">
                        {notice.title}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-lime-400 border-2 border-black rounded-lg text-sm font-black">
                            등록일: {formatDate(notice.createdAt)}
                        </span>
                        <span className="px-3 py-1 bg-cyan-400 border-2 border-black rounded-lg text-sm font-black">
                            조회수: {notice.viewCount || 0}
                        </span>
                    </div>
                </div>

                <div className="min-h-[300px] py-6 text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                </div>

                <div className="flex items-center justify-end mt-10 pt-6 border-t-4 border-black gap-3">
                    {isAdmin && (
                        <button
                            onClick={() => navigate(`/community/notice/update/${noticeId}`)}
                            className="px-6 py-2 text-sm font-black text-black bg-cyan-400
                                border-4 border-black rounded-xl
                                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                hover:translate-x-[2px] hover:translate-y-[2px]
                                transition-all"
                        >
                            수정
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/community/notice')}
                        className="px-6 py-2 text-sm font-black text-black bg-white
                            border-4 border-black rounded-xl
                            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            transition-all"
                    >
                        목록
                    </button>
                </div>
            </div>
        </CommunityLayout>
    );
};

export default GetNotice;
