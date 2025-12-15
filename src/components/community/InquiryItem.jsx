import React from 'react';
import InquiryStatusBadge from './InquiryStatusBadge';
import { formatDate, getCategoryName } from '../../utils/communityUtils';

const InquiryItem = ({ inquiry, onClick }) => {
    return (
        <div
            onClick={() => onClick(inquiry)}
            className="py-4 border-b-4 border-black last:border-b-0 cursor-pointer hover:bg-slate-50 transition-colors"
        >
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-black flex-1 truncate pr-3">
                    {inquiry.title}
                </h4>
                <InquiryStatusBadge status={inquiry.answerStatus} />
            </div>
            <div className="flex items-center gap-3 text-sm">
                <span className="font-bold text-gray-500">{formatDate(inquiry.createdAt)}</span>
                <span className="px-2 py-0.5 bg-cyan-400 rounded-md border-2 border-black text-xs font-black">
                    {getCategoryName(inquiry.communityCodeId)}
                </span>
            </div>
        </div>
    );
};

export default InquiryItem;
