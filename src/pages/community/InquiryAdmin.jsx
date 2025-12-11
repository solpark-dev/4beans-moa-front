import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import InquiryStatusBadge from '../../components/community/InquiryStatusBadge';
import InquiryDetailModal from '../../components/community/InquiryDetailModal';
import InquiryAnswerModal from '../../components/community/InquiryAnswerModal';
import { useAuthStore } from '@/store/authStore';
import { formatDate, getCategoryName } from '../../utils/communityUtils';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

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
                    <p className="text-gray-500 mb-4">관리자만 접근 가능합니다.</p>
                    <Button 
                        onClick={() => navigate('/community/inquiry')}
                        className="bg-[#1e3a5f] hover:bg-[#152a45]"
                    >
                        문의하기로 이동
                    </Button>
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

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <CommunityLayout>
            <div className="max-w-5xl mx-auto">
                <div className="border-b border-gray-200">
                    <div className="grid gap-4 py-3 text-sm font-medium text-gray-500" style={{ gridTemplateColumns: 'repeat(19, minmax(0, 1fr))' }}>
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
                    <div className="py-20 text-center text-gray-400">
                        등록된 문의가 없습니다.
                    </div>
                ) : (
                    inquiries.map((inquiry, index) => (
                        <div
                            key={inquiry.communityId}
                            onClick={() => handleTitleClick(inquiry)}
                            className="grid gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 items-center text-sm cursor-pointer"
                            style={{ gridTemplateColumns: 'repeat(19, minmax(0, 1fr))' }}
                        >
                            <div className="col-span-1 text-center text-gray-500">
                                {(currentPage - 1) * pageSize + index + 1}
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600" style={{ whiteSpace: 'nowrap' }}>
                                    {getCategoryName(inquiry.communityCodeId)}
                                </span>
                            </div>
                            <div className="col-span-8 pl-4 flex items-center gap-2 text-[#1e3a5f]">
                                <span className="truncate">{inquiry.title}</span>
                                {inquiry.fileOriginal && (
                                    <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                            </div>
                            <div className="col-span-4 text-center text-gray-500">
                                {inquiry.userId}
                            </div>
                            <div className="col-span-2 text-center text-gray-500" style={{ whiteSpace: 'nowrap' }}>
                                {formatDate(inquiry.createdAt)}
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    inquiry.answerStatus === '답변완료' 
                                        ? 'bg-[#e91e63]/10 text-[#e91e63]' 
                                        : 'bg-gray-100 text-gray-600'
                                }`} style={{ whiteSpace: 'nowrap' }}>
                                    {inquiry.answerStatus === '답변완료' ? '답변완료' : '답변대기'}
                                </span>
                            </div>
                            <div className="col-span-2 text-center">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAnswerClick(inquiry);
                                    }}
                                    className={inquiry.answerStatus === '답변완료' 
                                        ? 'border-gray-300 text-gray-600 hover:bg-gray-50' 
                                        : 'border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'
                                    }
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {inquiry.answerStatus === '답변완료' ? '수정' : '답변'}
                                </Button>
                            </div>
                        </div>
                    ))
                )}

                {totalPages > 0 && (
                    <Pagination className="mt-8">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="text-[#1e3a5f]"
                                />
                            </PaginationItem>

                            {renderPageNumbers().map((pageNum) => (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(pageNum)}
                                        isActive={currentPage === pageNum}
                                        className={currentPage === pageNum ? 'bg-[#1e3a5f] text-white' : 'text-[#1e3a5f]'}
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="text-[#1e3a5f]"
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
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