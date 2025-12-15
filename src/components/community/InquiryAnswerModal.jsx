import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { NeoCard, NeoButton } from '@/components/common/neo';
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
                <DialogTitle className="text-2xl font-black text-black">
                    {inquiry.answerContent ? '답변 수정' : '답변 작성'}
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 text-xs font-black rounded-lg bg-cyan-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {getCategoryName(inquiry.communityCodeId)}
                    </span>
                    <span className="text-sm font-bold text-gray-500">
                        {formatDate(inquiry.createdAt)}
                    </span>
                </div>

                {/* Title & Author */}
                <div>
                    <h3 className="font-black text-xl text-black mb-1">{inquiry.title}</h3>
                    <p className="text-sm font-bold text-gray-500">작성자: {inquiry.userId}</p>
                </div>

                {/* Inquiry Content */}
                <NeoCard
                    color="bg-slate-50"
                    hoverable={false}
                    className="rounded-xl p-5"
                >
                    <p className="text-sm font-black text-gray-500 mb-2">문의 내용</p>
                    <p className="text-black font-medium whitespace-pre-wrap leading-relaxed">
                        {inquiry.content}
                    </p>
                </NeoCard>

                {/* Attached Image */}
                {inquiry.fileOriginal && (
                    <div>
                        <p className="text-sm font-black text-gray-500 mb-3">첨부 이미지</p>
                        <img
                            src={`/api/community/inquiry/image/${inquiry.fileUuid}`}
                            alt={inquiry.fileOriginal}
                            className="max-w-full max-h-64 rounded-xl border-4 border-black object-contain shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        />
                        <p className="text-xs font-bold text-gray-500 mt-2">{inquiry.fileOriginal}</p>
                    </div>
                )}

                {/* Answer Input */}
                <div className="border-t-4 border-black pt-6">
                    <label className="block text-sm font-black text-black mb-3">
                        답변 작성
                    </label>
                    <textarea
                        value={answerContent}
                        onChange={(e) => setAnswerContent(e.target.value)}
                        placeholder="답변 내용을 입력하세요"
                        rows={8}
                        className="w-full px-4 py-3 border-4 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 resize-none"
                    />
                </div>
            </div>

            <DialogFooter className="gap-3">
                <NeoButton
                    color="bg-white"
                    size="sm"
                    onClick={onClose}
                >
                    취소
                </NeoButton>
                <NeoButton
                    color="bg-pink-500 text-white"
                    size="sm"
                    onClick={handleSubmit}
                >
                    {inquiry.answerContent ? '수정' : '등록'}
                </NeoButton>
            </DialogFooter>
        </>
    );
};

const InquiryAnswerModal = ({ isOpen, onClose, inquiry, onAnswerSubmit }) => {
    if (!inquiry) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
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
