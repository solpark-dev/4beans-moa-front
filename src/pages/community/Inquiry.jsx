import React, { useState, useEffect } from 'react';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import InquiryDetailModal from '../../components/community/InquiryDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

const Inquiry = () => {
    const { user } = useAuthStore();
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        communityCodeId: 1,
        title: '',
        content: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const pageSize = 5;

    const userId = user?.userId;

    useEffect(() => {
        const loadMyInquiries = async () => {
            if (!userId) return;
            
            try {
                const response = await fetch(`/api/community/inquiry/my?userId=${userId}&page=1&size=${pageSize}`);
                
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
        
        loadMyInquiries();
    }, [userId]);

    const loadMyInquiriesByPage = async (page) => {
        if (!userId) return;
        
        try {
            const response = await fetch(`/api/community/inquiry/my?userId=${userId}&page=${page}&size=${pageSize}`);
            
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            alert('JPG, PNG 파일만 업로드 가능합니다.');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            alert('파일 크기는 10MB 이하만 가능합니다.');
            e.target.value = '';
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('제목을 입력하세요.');
            return;
        }

        if (!formData.content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('userId', userId);
            submitData.append('communityCodeId', formData.communityCodeId);
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            
            if (imageFile) {
                submitData.append('file', imageFile);
            }

            const response = await fetch('/api/community/inquiry', {
                method: 'POST',
                body: submitData
            });

            if (response.ok) {
                alert('문의가 등록되었습니다.');
                setFormData({
                    communityCodeId: 1,
                    title: '',
                    content: ''
                });
                setImageFile(null);
                setImagePreview(null);
                loadMyInquiriesByPage(1);
            } else {
                const errorText = await response.text();
                console.error('등록 실패:', errorText);
                alert('등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('등록 실패:', error);
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    const handleInquiryClick = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsDetailModalOpen(true);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        loadMyInquiriesByPage(page);
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1:1 문의</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 pb-3 border-b-2 border-blue-600">
                            문의하기
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="category">카테고리</Label>
                                <select
                                    name="communityCodeId"
                                    value={formData.communityCodeId}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1">회원</option>
                                    <option value="2">결제</option>
                                    <option value="3">기타</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="title">제목</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="문의 제목을 입력하세요"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="content">내용</Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="문의 내용을 입력하세요"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={6}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="image">이미지 첨부</Label>
                                <p className="text-xs text-gray-500 mb-1">JPG, PNG 파일만 가능 (최대 10MB)</p>
                                <Input
                                    id="image"
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleImageChange}
                                    className="mt-1"
                                />
                                {imagePreview && (
                                    <div className="mt-2 relative">
                                        <img 
                                            src={imagePreview} 
                                            alt="미리보기" 
                                            className="max-w-full h-auto rounded-lg border max-h-48 object-contain"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2"
                                        >
                                            삭제
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Button 
                                onClick={handleSubmit}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                문의 등록
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 pb-3 border-b-2 border-blue-600">
                            나의 문의 내역
                        </h3>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {inquiries.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    등록된 문의가 없습니다.
                                </div>
                            ) : (
                                inquiries.map((inquiry) => (
                                    <div
                                        key={inquiry.communityId}
                                        onClick={() => handleInquiryClick(inquiry)}
                                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-gray-900 flex-1">
                                                {inquiry.title}
                                            </h4>
                                            {getStatusBadge(inquiry.answerStatus)}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>{formatDate(inquiry.createdAt)}</span>
                                            <span>·</span>
                                            <span>{getCategoryName(inquiry.communityCodeId)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {totalPages > 0 && (
                            <Pagination className="mt-4">
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
                    </CardContent>
                </Card>
            </div>

            <InquiryDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                inquiry={selectedInquiry}
            />
        </CommunityLayout>
    );
};

export default Inquiry;