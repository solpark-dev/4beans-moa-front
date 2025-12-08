import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const InquiryDetailModal = ({ isOpen, onClose, inquiry }) => {
    if (!inquiry) return null;

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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>문의 상세</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600">
                            {getCategoryName(inquiry.communityCodeId)}
                        </Badge>
                        {getStatusBadge(inquiry.answerStatus)}
                        <span className="text-sm text-gray-500">
                            {formatDate(inquiry.createdAt)}
                        </span>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-2">{inquiry.title}</h3>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">문의 내용</p>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {inquiry.content}
                        </p>
                    </div>

                    {inquiry.fileOriginal && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">첨부 이미지</p>
                            <img 
                                src={`/api/community/inquiry/image/${inquiry.fileUuid}`} 
                                alt={inquiry.fileOriginal}
                                className="max-w-full max-h-64 rounded-lg border object-contain"
                            />
                            <p className="text-xs text-gray-500 mt-1">{inquiry.fileOriginal}</p>
                        </div>
                    )}

                    {inquiry.answerContent && (
                        <div className="border-t pt-4">
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-green-700 mb-2">답변</p>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {inquiry.answerContent}
                                </p>
                                {inquiry.answeredAt && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        답변일: {formatDate(inquiry.answeredAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InquiryDetailModal;