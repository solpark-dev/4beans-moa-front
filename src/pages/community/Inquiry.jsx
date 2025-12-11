import React, { useState, useEffect } from 'react';
import CommunityLayout from '../../components/community/CommunityLayout';
import InquiryForm from '../../components/community/InquiryForm';
import InquiryItem from '../../components/community/InquiryItem';
import InquiryDetailModal from '../../components/community/InquiryDetailModal';
import { useAuthStore } from '@/store/authStore';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

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
        if (userId) {
            loadMyInquiries(1);
        }
    }, [userId]);

    const loadMyInquiries = async (page) => {
        if (!userId) return;
        
        try {
            const response = await fetch(`/api/community/inquiry/my?userId=${userId}&page=${page}&size=${pageSize}`);
            
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
                loadMyInquiries(1);
            } else {
                alert('등록에 실패했습니다.');
            }
        } catch (error) {
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    const handleInquiryClick = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsDetailModalOpen(true);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        loadMyInquiries(page);
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                        <h3 className="text-lg font-bold text-[#1e3a5f] mb-6 pb-3 border-b-2 border-[#1e3a5f]">
                            문의하기
                        </h3>
                        <InquiryForm
                            formData={formData}
                            setFormData={setFormData}
                            imagePreview={imagePreview}
                            setImageFile={setImageFile}
                            setImagePreview={setImagePreview}
                            onSubmit={handleSubmit}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-[#1e3a5f] mb-6 pb-3 border-b-2 border-[#1e3a5f]">
                            나의 문의 내역
                        </h3>

                        <div className="min-h-[400px]">
                            {inquiries.length === 0 ? (
                                <div className="text-center py-16 text-gray-400">
                                    등록된 문의가 없습니다.
                                </div>
                            ) : (
                                inquiries.map((inquiry) => (
                                    <InquiryItem
                                        key={inquiry.communityId}
                                        inquiry={inquiry}
                                        onClick={handleInquiryClick}
                                    />
                                ))
                            )}
                        </div>

                        {totalPages > 0 && (
                            <Pagination className="mt-6">
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
                </div>
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