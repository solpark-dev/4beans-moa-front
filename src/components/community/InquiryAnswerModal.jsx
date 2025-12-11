import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate, getCategoryName } from '../../utils/communityUtils';

const InquiryAnswerModalContent = ({ inquiry, onClose, onAnswerSubmit }) => {
    const [answerContent, setAnswerContent] = useState(inquiry?.answerContent || '');

    const handleSubmit = async () => {
        if (!answerContent.trim()) {
            alert('답변 내용을 입력하세요.');
            return;
        }

        await onAnswerSubmit(inquiry.communityId, answerContent);
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-[#1e3a5f]">
                    {inquiry.answerContent ? '답변 수정' : '답변 작성'}
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-[#1e3a5f]/10 text-[#1e3a5f]">
                        {getCategoryName(inquiry.communityCodeId)}
                    </span>
                    <span className="text-sm text-gray-500">
                        {formatDate(inquiry.createdAt)}
                    </span>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-[#1e3a5f] mb-1">{inquiry.title}</h3>
                    <p className="text-sm text-gray-500">작성자: {inquiry.userId}</p>
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

                <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                        답변 작성
                    </label>
                    <textarea
                        value={answerContent}
                        onChange={(e) => setAnswerContent(e.target.value)}
                        placeholder="답변 내용을 입력하세요"
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] focus:outline-none text-[#1e3a5f] placeholder-gray-400 resize-none"
                    />
                </div>
            </div>

            <DialogFooter>
                <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                    취소
                </Button>
                <Button 
                    onClick={handleSubmit}
                    className="bg-[#1e3a5f] hover:bg-[#152a45] text-white"
                >
                    {inquiry.answerContent ? '수정' : '등록'}
                </Button>
            </DialogFooter>
        </>
    );
};

const InquiryAnswerModal = ({ isOpen, onClose, inquiry, onAnswerSubmit }) => {
    if (!inquiry) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <InquiryAnswerModalContent 
                    key={inquiry.communityId}
                    inquiry={inquiry}
                    onClose={onClose}
                    onAnswerSubmit={onAnswerSubmit}
                />
            </DialogContent>
        </Dialog>
    );
};

export default InquiryAnswerModal;