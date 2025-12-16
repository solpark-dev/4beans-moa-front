import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NeoCard } from "@/components/common/neo";
import InquiryStatusBadge from "./InquiryStatusBadge";
import { formatDate, getCategoryName } from "../../utils/communityUtils";

const InquiryDetailModal = ({ isOpen, onClose, inquiry }) => {
  if (!inquiry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-black">
            문의 상세
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 text-xs font-black rounded-lg bg-cyan-400 text-black border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
              {getCategoryName(inquiry.communityCodeId)}
            </span>
            <InquiryStatusBadge status={inquiry.answerStatus} />
            <span className="text-sm font-bold text-gray-500">
              {formatDate(inquiry.createdAt)}
            </span>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-black text-xl text-black">{inquiry.title}</h3>
          </div>

          {/* Content */}
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
              <p className="text-sm font-black text-gray-500 mb-3">
                첨부 이미지
              </p>
              <img
                src={`/uploads/community/inquiry/${inquiry.fileUuid}`}
                alt={inquiry.fileOriginal}
                className="max-w-full max-h-64 rounded-xl border border-gray-200 object-contain shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
              />
              <p className="text-xs font-bold text-gray-500 mt-2">
                {inquiry.fileOriginal}
              </p>
            </div>
          )}

          {/* Answer */}
          {inquiry.answerContent && (
            <div className="border-t-4 border-black pt-6">
              <NeoCard
                color="bg-lime-100"
                hoverable={false}
                className="rounded-xl p-5"
              >
                <p className="text-sm font-black text-lime-700 mb-2">답변</p>
                <p className="text-black font-medium whitespace-pre-wrap leading-relaxed">
                  {inquiry.answerContent}
                </p>
                {inquiry.answeredAt && (
                  <p className="text-xs font-bold text-gray-500 mt-4">
                    답변일: {formatDate(inquiry.answeredAt)}
                  </p>
                )}
              </NeoCard>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryDetailModal;
