import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import FaqItem from '../../components/community/FaqItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

const ListFaq = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [faqs, setFaqs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        const loadFaqList = async () => {
            try {
                const response = await fetch(`/api/community/faq?page=1&size=${pageSize}`);
                
                if (!response.ok) {
                    console.error('API 응답 에러:', response.status);
                    setFaqs([]);
                    return;
                }
                
                const data = await response.json();
                setFaqs(data.content || []);
                setCurrentPage(data.page || 1);
                setTotalPages(data.totalPages || 0);
            } catch (error) {
                console.error('FAQ 목록 로드 실패:', error);
                setFaqs([]);
            }
        };
        
        loadFaqList();
    }, []);

    const loadFaqListByPage = async (page) => {
        try {
            const response = await fetch(`/api/community/faq?page=${page}&size=${pageSize}`);
            
            if (!response.ok) {
                console.error('API 응답 에러:', response.status);
                setFaqs([]);
                return;
            }
            
            const data = await response.json();
            setFaqs(data.content || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('FAQ 목록 로드 실패:', error);
            setFaqs([]);
        }
    };

    const handleUpdateFaq = async (faqId, formData) => {
        try {
            const userId = user?.userId || 'admin@moa.com';
            
            const response = await fetch(`/api/community/faq/${faqId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    title: formData.title,
                    content: formData.content
                }),
            });

            if (response.ok) {
                alert('수정되었습니다.');
                loadFaqListByPage(currentPage);
                return true;
            } else {
                alert('수정에 실패했습니다.');
                return false;
            }
        } catch (error) {
            console.error('수정 실패:', error);
            alert('수정 중 오류가 발생했습니다.');
            return false;
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        loadFaqListByPage(page);
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

    return (
        <CommunityLayout>
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">자주 묻는 질문</h2>
                {isAdmin && (
                    <Button 
                        onClick={() => navigate('/community/faq/add')}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        FAQ 등록
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {faqs.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-gray-500">
                            등록된 FAQ가 없습니다.
                        </CardContent>
                    </Card>
                ) : (
                    faqs.map((faq, index) => (
                        <FaqItem
                            key={faq.communityId}
                            faq={faq}
                            index={(currentPage - 1) * pageSize + index + 1}
                            isAdmin={isAdmin}
                            onUpdate={handleUpdateFaq}
                        />
                    ))
                )}
            </div>

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
        </CommunityLayout>
    );
};

export default ListFaq;