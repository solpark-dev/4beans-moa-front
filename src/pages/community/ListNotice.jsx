import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import NoticeItem from '../../components/community/NoticeItem';
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

const ListNotice = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [notices, setNotices] = useState([]);
    const [filteredNotices, setFilteredNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const pageSize = 10;

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        loadNoticeList();
    }, []);

    const loadNoticeList = async () => {
        try {
            const response = await fetch(`/api/community/notice?page=1&size=100`);
            
            if (!response.ok) {
                setNotices([]);
                return;
            }
            
            const data = await response.json();
            const sortedNotices = (data.content || []).sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNotices(sortedNotices);
            setFilteredNotices(sortedNotices);
            updatePagination(sortedNotices);
        } catch (error) {
            setNotices([]);
        }
    };

    const updatePagination = (data) => {
        setTotalPages(Math.ceil(data.length / pageSize));
        setCurrentPage(1);
    };

    const handleSearch = () => {
        if (!searchKeyword.trim()) {
            setFilteredNotices(notices);
            updatePagination(notices);
            return;
        }

        const filtered = notices.filter(notice =>
            notice.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredNotices(filtered);
        updatePagination(filtered);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredNotices.slice(startIndex, endIndex);
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
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '');
    };

    const getNoticeId = (notice) => {
        return notice.communityId || notice.id;
    };

    const handleNoticeClick = (notice) => {
        const id = getNoticeId(notice);
        if (id) {
            navigate(`/community/notice/${id}`);
        }
    };

    return (
        <CommunityLayout>
            <div className="pt-8">
                <div className="flex items-center justify-end mb-6 pb-4 border-b border-gray-200">
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

            <div className="border-t border-gray-300">
                <div className="grid grid-cols-12 py-3 border-b border-gray-200 text-sm font-medium text-gray-500">
                    <div className="col-span-1 text-center">번호</div>
                    <div className="col-span-7 text-center">제목</div>
                    <div className="col-span-2 text-center">등록일</div>
                    <div className="col-span-2 text-center">조회수</div>
                </div>

                {getCurrentPageData().length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                        등록된 공지사항이 없습니다.
                    </div>
                ) : (
                    getCurrentPageData().map((notice, index) => (
                        <NoticeItem
                            key={getNoticeId(notice)}
                            notice={notice}
                            index={filteredNotices.length - ((currentPage - 1) * pageSize + index)}
                            formatDate={formatDate}
                            onClick={() => handleNoticeClick(notice)}
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
                        onClick={() => navigate('/community/notice/add')}
                        className="absolute right-0 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
                    >
                        등록
                    </Button>
                )}
            </div>
        </CommunityLayout>
    );
};

export default ListNotice;