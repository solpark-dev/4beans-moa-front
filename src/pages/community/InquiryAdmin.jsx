import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import InquiryStatusBadge from '../../components/community/InquiryStatusBadge';
import InquiryDetailModal from '../../components/community/InquiryDetailModal';
import InquiryAnswerModal from '../../components/community/InquiryAnswerModal';
import { useAuthStore } from '@/store/authStore';
import { formatDate, getCategoryName } from '../../utils/communityUtils';
import { NeoCard, NeoButton, NeoPagination } from '@/components/common/neo';
import { ImageIcon } from 'lucide-react';

const InquiryAdmin = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const pageSize = 10;

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        if (isAdmin) {
            loadAllInquiries(1);
        }
    }, [isAdmin]);

    const loadAllInquiries = async (page) => {
        try {
            const response = await fetch(`/api/community/inquiry?page=${page}&size=${pageSize}`);

            if (!response.ok) {
                setInquiries([]);
                return;
            }

            const data = await response.json();
            setInquiries(data.content || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            setInquiries([]);
        }
    };

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
                            onClick={() => navigate('/community/inquiry')}
                            color="bg-pink-500"
                            size="sm"
                        >
                            문의하기로 이동
                        </NeoButton>
                    </NeoCard>
                </div>
            </CommunityLayout>
        );
    }

    const handleTitleClick = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsDetailModalOpen(true);
    };

    const handleAnswerClick = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsAnswerModalOpen(true);
    };

    const handleAnswerSubmit = async (communityId, answerContent) => {
        const isUpdate = selectedInquiry?.answerContent;
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const response = await fetch('/api/community/inquiry/answer', {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    communityId: communityId,
                    answerContent: answerContent
                }),
            });

            if (response.ok) {
                alert(isUpdate ? '답변이 수정되었습니다.' : '답변이 등록되었습니다.');
                setIsAnswerModalOpen(false);
                loadAllInquiries(currentPage);
            } else {
                alert('답변 처리에 실패했습니다.');
            }
        } catch (error) {
            alert('답변 처리 중 오류가 발생했습니다.');
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        loadAllInquiries(page);
    };

    return (
        <CommunityLayout>
            <div className="max-w-5xl mx-auto">
                <NeoCard
                    color="bg-cyan-400"
                    hoverable={false}
                    className="inline-block px-4 py-2 rounded-xl mb-6"
                >
                    <h2 className="text-lg font-black text-black">
                        문의 관리
                    </h2>
                </NeoCard>

                <NeoCard
                    color="bg-white"
                    hoverable={false}
                    className="rounded-2xl overflow-hidden"
                >
                    {/* 테이블 헤더 */}
                    <div className="bg-slate-100 border-b-4 border-black">
                        <div className="grid gap-4 py-3 px-4 text-sm font-black text-black" style={{ gridTemplateColumns: 'repeat(19, minmax(0, 1fr))' }}>
                            <div className="col-span-1 text-center">번호</div>
                            <div className="col-span-1 text-center" style={{ whiteSpace: 'nowrap' }}>카테고리</div>
                            <div className="col-span-8 pl-4">제목</div>
                            <div className="col-span-4 text-center">작성자</div>
                            <div className="col-span-2 text-center">작성일</div>
                            <div className="col-span-1 text-center">상태</div>
                            <div className="col-span-2 text-center">관리</div>
                        </div>
                    </div>

                    {inquiries.length === 0 ? (
                        <div className="py-20 text-center font-bold text-gray-400">
                            등록된 문의가 없습니다.
                        </div>
                    ) : (
                        inquiries.map((inquiry, index) => (
                            <div
                                key={inquiry.communityId}
                                onClick={() => handleTitleClick(inquiry)}
                                className="grid gap-4 py-4 px-4 border-b-2 border-black last:border-b-0 hover:bg-slate-50 items-center text-sm cursor-pointer transition-colors"
                                style={{ gridTemplateColumns: 'repeat(19, minmax(0, 1fr))' }}
                            >
                                <div className="col-span-1 text-center font-bold text-gray-600">
                                    {(currentPage - 1) * pageSize + index + 1}
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <span className="px-2 py-1 text-xs font-black rounded-lg bg-cyan-400 border-2 border-black" style={{ whiteSpace: 'nowrap' }}>
                                        {getCategoryName(inquiry.communityCodeId)}
                                    </span>
                                </div>
                                <div className="col-span-8 pl-4 flex items-center gap-2 font-bold text-black">
                                    <span className="truncate">{inquiry.title}</span>
                                    {inquiry.fileOriginal && (
                                        <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    )}
                                </div>
                                <div className="col-span-4 text-center font-medium text-gray-600">
                                    {inquiry.userId}
                                </div>
                                <div className="col-span-2 text-center font-medium text-gray-600" style={{ whiteSpace: 'nowrap' }}>
                                    {formatDate(inquiry.createdAt)}
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <InquiryStatusBadge status={inquiry.answerStatus} />
                                </div>
                                <div className="col-span-2 text-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAnswerClick(inquiry);
                                        }}
                                        className={`px-3 py-1.5 text-xs font-black rounded-lg border-2 border-black
                                            shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                            hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                                            hover:translate-x-[1px] hover:translate-y-[1px]
                                            transition-all
                                            ${inquiry.answerStatus === '답변완료'
                                                ? 'bg-white text-black'
                                                : 'bg-pink-500 text-white'
                                            }`}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {inquiry.answerStatus === '답변완료' ? '수정' : '답변'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {/* 페이지네이션 */}
                    {totalPages > 0 && (
                        <div className="py-6 border-t-4 border-black">
                            <NeoPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </NeoCard>
            </div>

            <InquiryDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                inquiry={selectedInquiry}
            />

            <InquiryAnswerModal
                isOpen={isAnswerModalOpen}
                onClose={() => setIsAnswerModalOpen(false)}
                inquiry={selectedInquiry}
                onAnswerSubmit={handleAnswerSubmit}
            />
        </CommunityLayout>
    );
};

export default InquiryAdmin;
