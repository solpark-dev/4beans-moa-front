import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import InquiryAnswerModal from '../../components/community/InquiryAnswerModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        // 임시: 권한 체크 비활성화
        // checkAdmin();
        loadAllInquiries(1);
    }, []);

    const checkAdmin = () => {
        // 임시: 권한 체크 비활성화
        // const userRole = sessionStorage.getItem('role');
        
        // if (userRole !== 'ADMIN') {
        //     alert('관리자만 접근 가능합니다.');
        //     navigate('/community/inquiry');
        //     return;
        // }
    };

    const loadAllInquiries = async (page) => {
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

    const handleInquiryClick = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsAnswerModalOpen(true);
    };

    const handleAnswerSubmit = async (inquiryId, answerContent) => {
        try {
            // 테스트 코드 기준: POST /api/community/inquiry/answer 또는 PUT /api/community/inquiry/answer
            const method = 'POST'; // 또는 'PUT' - 백엔드 확인 필요
            
            const response = await fetch(`/api/community/inquiry/answer`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    communityId: inquiryId,
                    answerContent: answerContent
                }),
            });

            if (response.ok) {
                alert('답변이 저장되었습니다.');
                loadAllInquiries(currentPage);
            } else {
                const errorText = await response.text();
                console.error('답변 저장 실패:', errorText);
                alert('답변 저장에 실패했습니다: ' + response.status);
            }
        } catch (error) {
            console.error('답변 저장 실패:', error);
            alert('답변 저장 중 오류가 발생했습니다: ' + error.message);
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        loadAllInquiries(page);
        window.scrollTo(0, 0);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

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
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                        번호
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        제목
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        작성자
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        카테고리
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        작성일
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        상태
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inquiries.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            등록된 문의가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    inquiries.map((inquiry, index) => (
                                        <tr
                                            key={inquiry.communityId}
                                            onClick={() => handleInquiryClick(inquiry)}
                                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">
                                                {(currentPage - 1) * pageSize + index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {inquiry.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">
                                                {inquiry.userId}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-600">
                                                    {getCategoryName(inquiry.communityCodeId)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">
                                                {formatDate(inquiry.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(inquiry.answerStatus)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {totalPages > 0 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} [&>span]:hidden`}
                            />
                        </PaginationItem>
                        
                        {renderPageNumbers().map((pageNum) => (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    onClick={() => handlePageChange(pageNum)}
                                    isActive={currentPage === pageNum}
                                    className="cursor-pointer"
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                            <PaginationNext 
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} [&>span]:hidden`}
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