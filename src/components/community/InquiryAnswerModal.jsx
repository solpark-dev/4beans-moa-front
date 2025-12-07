import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const InquiryAnswerModal = ({ isOpen, onClose, inquiry, onAnswerSubmit }) => {
    const [answerContent, setAnswerContent] = useState('');

    useEffect(() => {
        if (inquiry?.answerContent) {
            setAnswerContent(inquiry.answerContent);
        } else {
            setAnswerContent('');
        }
    }, [inquiry]);

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

    const handleSubmit = async () => {
        if (!answerContent.trim()) {
            alert('답변 내용을 입력하세요.');
            return;
        }

        await onAnswerSubmit(inquiry.communityId, answerContent);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {inquiry.answerContent ? '답변 수정' : '답변 작성'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600">
                            {getCategoryName(inquiry.communityCodeId)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                            {formatDate(inquiry.createdAt)}
                        </span>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-2">{inquiry.title}</h3>
                        <p className="text-sm text-gray-500">작성자: {inquiry.userId}</p>
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
                                src={`/uploads/${inquiry.fileUuid}`} 
                                alt={inquiry.fileOriginal}
                                className="max-w-full rounded-lg border"
                            />
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            답변 작성
                        </label>
                        <Textarea
                            value={answerContent}
                            onChange={(e) => setAnswerContent(e.target.value)}
                            placeholder="답변 내용을 입력하세요"
                            rows={8}
                            className="w-full"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        취소
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        저장
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InquiryAnswerModal;