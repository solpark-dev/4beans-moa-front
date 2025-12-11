import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import FaqItem from '../../components/community/FaqItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [activeCategory, setActiveCategory] = useState('전체');
    const [searchKeyword, setSearchKeyword] = useState('');
    const pageSize = 10;

    const isAdmin = user?.role === 'ADMIN';

    const categories = ['전체', '회원', '결제', '구독', '파티', '정산', '기타'];

    useEffect(() => {
        loadFaqList();
    }, []);

    const loadFaqList = async () => {
        try {
            const response = await fetch(`/api/community/faq?page=1&size=100`);
            
            if (!response.ok) {
                setFaqs([]);
                return;
            }
            
            const data = await response.json();
            setFaqs(data.content || []);
            setFilteredFaqs(data.content || []);
            updatePagination(data.content || []);
        } catch (error) {
            setFaqs([]);
        }
    };

    const updatePagination = (data) => {
        setTotalPages(Math.ceil(data.length / pageSize));
        setCurrentPage(1);
    };

    const getCategoryFromTitle = (title) => {
        if (title.includes('[회원]')) return '회원';
        if (title.includes('[결제]')) return '결제';
        if (title.includes('[구독]')) return '구독';
        if (title.includes('[파티]')) return '파티';
        if (title.includes('[정산]')) return '정산';
        if (title.includes('[보증금]')) return '보증금';
        if (title.includes('[기타]')) return '기타';
        return '기타';
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        filterFaqs(category, searchKeyword);
    };

    const handleSearch = () => {
        filterFaqs(activeCategory, searchKeyword);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const filterFaqs = (category, keyword) => {
        let result = [...faqs];

        if (category !== '전체') {
            result = result.filter(faq => getCategoryFromTitle(faq.title) === category);
        }

        if (keyword.trim()) {
            result = result.filter(faq => 
                faq.title.toLowerCase().includes(keyword.toLowerCase()) ||
                faq.content.toLowerCase().includes(keyword.toLowerCase())
            );
        }

        setFilteredFaqs(result);
        updatePagination(result);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredFaqs.slice(startIndex, endIndex);
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
                loadFaqList();
                return true;
            } else {
                alert('수정에 실패했습니다.');
                return false;
            }
        } catch (error) {
            alert('수정 중 오류가 발생했습니다.');
            return false;
        }
    };

    return (
        <CommunityLayout>
            <div className="pt-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        {categories.map((category, index) => (
                            <React.Fragment key={category}>
                                <button
                                    onClick={() => handleCategoryChange(category)}
                                    className={`
                                        text-sm font-medium transition-all duration-200
                                        ${activeCategory === category
                                            ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f] pb-1'
                                            : 'text-gray-400 hover:text-[#1e3a5f]'
                                        }
                                    `}
                                >
                                    {category}
                                </button>
                                {index < categories.length - 1 && (
                                    <span className="text-gray-300">|</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="relative">
                        <Input
                            type="text"
                            placeholder=""
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-56 pr-10 border-0 border-b border-gray-300 rounded-none focus:border-[#1e3a5f] focus:ring-0 bg-transparent"
                        />
                        <button 
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e3a5f]"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-gray-200 border-t border-gray-200">
                {getCurrentPageData().length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                        등록된 FAQ가 없습니다.
                    </div>
                ) : (
                    getCurrentPageData().map((faq, index) => (
                        <FaqItem
                            key={faq.communityId}
                            faq={faq}
                            index={(currentPage - 1) * pageSize + index + 1}
                            isAdmin={isAdmin}
                            onUpdate={handleUpdateFaq}
                            getCategoryFromTitle={getCategoryFromTitle}
                        />
                    ))
                )}
            </div>

            <div className="flex items-center justify-center mt-8 relative">
                {totalPages > 1 && (
                    <Pagination>
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

                {isAdmin && (
                    <Button 
                        onClick={() => navigate('/community/faq/add')}
                        className="absolute right-0 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
                    >
                        FAQ 등록
                    </Button>
                )}
            </div>
        </CommunityLayout>
    );
};

export default ListFaq;