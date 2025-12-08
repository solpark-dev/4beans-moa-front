import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import NoticeItem from '../../components/community/NoticeItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchType, setSearchType] = useState('title');
    const [searchKeyword, setSearchKeyword] = useState('');

    const isAdmin = user?.role === 'ADMIN';
    const pageSize = 10;

    useEffect(() => {
        const loadNoticeList = async () => {
            try {
                const response = await fetch(`/api/community/notice?page=1&size=${pageSize}`);
                
                if (!response.ok) {
                    console.error('API 응답 에러:', response.status);
                    setNotices([]);
                    return;
                }
                
                const data = await response.json();
                setNotices(data.content || []);
                setCurrentPage(data.page || 1);
                setTotalPages(data.totalPages || 0);
            } catch (error) {
                console.error('공지사항 목록 로드 실패:', error);
                setNotices([]);
            }
        };
        
        loadNoticeList();
    }, []);

    const loadNoticeListByPage = async (page) => {
        try {
            const response = await fetch(`/api/community/notice?page=${page}&size=${pageSize}`);
            
            if (!response.ok) {
                console.error('API 응답 에러:', response.status);
                setNotices([]);
                return;
            }
            
            const data = await response.json();
            setNotices(data.content || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('공지사항 목록 로드 실패:', error);
            setNotices([]);
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            alert('검색어를 입력하세요');
            return;
        }

        try {
            const response = await fetch(`/api/community/notice/search?keyword=${searchKeyword}&page=1&size=${pageSize}`);
            const data = await response.json();
            setNotices(data.content);
            setCurrentPage(data.page);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('검색 실패:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        loadNoticeListByPage(page);
    };

    const goToDetail = (communityId, displayIndex) => {
        navigate(`/community/notice/${communityId}?index=${displayIndex}`);
    };

    const goToAdd = () => {
        navigate('/community/notice/add');
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

    return (
        <CommunityLayout>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">공지사항</h2>

            <Card className="mb-6">
                <CardContent className="p-5">
                    <div className="flex gap-3">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="w-[140px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="title">제목</option>
                            <option value="category">카테고리</option>
                        </select>
                        <Input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                            검색
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between items-center mb-6">
                <div></div>
                {isAdmin && (
                    <Button onClick={goToAdd} className="bg-blue-600 hover:bg-blue-700">
                        공지 등록
                    </Button>
                )}
            </div>

            <Card>
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                    <div className="col-span-1 text-center">번호</div>
                    <div className="col-span-2 text-center">카테고리</div>
                    <div className="col-span-6">제목</div>
                    <div className="col-span-2 text-center">작성일</div>
                    <div className="col-span-1 text-center">조회수</div>
                </div>

                {notices.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        등록된 공지사항이 없습니다.
                    </div>
                ) : (
                    notices.map((notice, index) => (
                        <NoticeItem
                            key={notice.communityId}
                            notice={notice}
                            index={(currentPage - 1) * pageSize + index + 1}
                            onClick={goToDetail}
                        />
                    ))
                )}
            </Card>

            {totalPages > 0 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
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
                                className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </CommunityLayout>
    );
};

export default ListNotice;