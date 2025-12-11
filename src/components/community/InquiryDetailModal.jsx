import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InquiryStatusBadge from './InquiryStatusBadge';
import { formatDate, getCategoryName } from '../../utils/communityUtils';

const InquiryDetailModal = ({ isOpen, onClose, inquiry }) => {
    if (!inquiry) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#1e3a5f]">문의 상세</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-[#1e3a5f]/10 text-[#1e3a5f]">
                            {getCategoryName(inquiry.communityCodeId)}
                        </span>
                        <InquiryStatusBadge status={inquiry.answerStatus} />
                        <span className="text-sm text-gray-500">
                            {formatDate(inquiry.createdAt)}
                        </span>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg text-[#1e3a5f]">{inquiry.title}</h3>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">문의 내용</p>
                        <p className="text-[#1e3a5f] whitespace-pre-wrap">
                            {inquiry.content}
                        </p>
                    </div>

                    {inquiry.fileOriginal && (
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">첨부 이미지</p>
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
                            <div className="bg-[#e91e63]/5 rounded-lg p-4">
                                <p className="text-sm font-medium text-[#e91e63] mb-2">답변</p>
                                <p className="text-[#1e3a5f] whitespace-pre-wrap">
                                    {inquiry.answerContent}
                                </p>
                                {inquiry.answeredAt && (
                                    <p className="text-xs text-gray-500 mt-3">
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