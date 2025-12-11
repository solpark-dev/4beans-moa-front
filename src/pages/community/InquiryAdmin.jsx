import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import InquiryAnswerModal from '../../components/community/InquiryAnswerModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const pageSize = 10;

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        const loadAllInquiries = async () => {
            try {
                const response = await fetch(`/api/community/inquiry?page=1&size=${pageSize}`);
                
                if (!response.ok) {
                    console.error('API 응답 에러:', response.status);
                    setInquiries([]);
                    return;
                }
                
                const data = await response.json();
                setInquiries(data.content || []);
                setCurrentPage(data.page || 1);
                setTotalPages(data.totalPages || 0);
            } catch (error) {
                console.error('문의 목록 로드 실패:', error);
                setInquiries([]);
            }
        };
        
        if (isAdmin) {
            loadAllInquiries();
        }
    }, [isAdmin]);

    const loadAllInquiriesByPage = async (page) => {
        try {
            const response = await fetch(`/api/community/inquiry?page=${page}&size=${pageSize}`);
            
            if (!response.ok) {
                console.error('API 응답 에러:', response.status);
                setInquiries([]);
                return;
            }
            
            const data = await response.json();
            setInquiries(data.content || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('문의 목록 로드 실패:', error);
            setInquiries([]);
        }
    };

    if (!isAdmin) {
        return (
            <CommunityLayout>
                <div className="text-center py-20">
                    <p className="text-gray-500 mb-4">관리자만 접근 가능합니다.</p>
                    <Button onClick={() => navigate('/community/inquiry')}>
                        문의하기로 이동
                    </Button>
                </div>
            </CommunityLayout>
        );
    }

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
                loadAllInquiriesByPage(currentPage);
            } else {
                alert('답변 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('답변 처리 실패:', error);
            alert('답변 처리 중 오류가 발생했습니다.');
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        loadAllInquiriesByPage(page);
        window.scrollTo(0, 0);
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

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const getCategoryName = (codeId) => {
        const categories = {
            1: '회원',
            2: '결제',
            3: '기타'
        };
        return categories[codeId] || '기타';
    };

    const getStatusBadge = (status) => {
        if (status === '답변완료') {
            return <Badge className="bg-green-100 text-green-700">답변완료</Badge>;
        }
        return <Badge className="bg-yellow-100 text-yellow-700">답변대기</Badge>;
    };

    return (
        <CommunityLayout>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">문의 관리</h2>

            <Card>
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                    <div className="col-span-1 text-center">번호</div>
                    <div className="col-span-1 text-center">카테고리</div>
                    <div className="col-span-4">제목</div>
                    <div className="col-span-2 text-center">작성자</div>
                    <div className="col-span-2 text-center">작성일</div>
                    <div className="col-span-1 text-center">상태</div>
                    <div className="col-span-1 text-center">관리</div>
                </div>

                {inquiries.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        등록된 문의가 없습니다.
                    </div>
                ) : (
                    inquiries.map((inquiry, index) => (
                        <div
                            key={inquiry.communityId}
                            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center"
                        >
                            <div className="col-span-1 text-center text-gray-500">
                                {(currentPage - 1) * pageSize + index + 1}
                            </div>
                            <div className="col-span-1 text-center">
                                <Badge variant="outline">{getCategoryName(inquiry.communityCodeId)}</Badge>
                            </div>
                            <div className="col-span-4 text-gray-900 truncate flex items-center gap-2">
                                {inquiry.title}
                                {inquiry.fileOriginal && (
                                    <ImageIcon className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                            <div className="col-span-2 text-center text-gray-600 text-sm truncate">
                                {inquiry.userId}
                            </div>
                            <div className="col-span-2 text-center text-gray-500 text-sm">
                                {formatDate(inquiry.createdAt)}
                            </div>
                            <div className="col-span-1 text-center">
                                {getStatusBadge(inquiry.answerStatus)}
                            </div>
                            <div className="col-span-1 text-center">
                                <Button
                                    size="sm"
                                    variant={inquiry.answerStatus === '답변완료' ? 'outline' : 'default'}
                                    onClick={() => handleAnswerClick(inquiry)}
                                    className={inquiry.answerStatus !== '답변완료' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                >
                                    {inquiry.answerStatus === '답변완료' ? '수정' : '답변'}
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </Card>

            {totalPages > 0 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>

                        {renderPageNumbers().map((pageNum) => (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    onClick={() => handlePageChange(pageNum)}
                                    isActive={currentPage === pageNum}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

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