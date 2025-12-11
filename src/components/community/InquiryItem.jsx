import React from 'react';
import InquiryStatusBadge from './InquiryStatusBadge';
import { formatDate, getCategoryName } from '../../utils/communityUtils';

const InquiryItem = ({ inquiry, onClick }) => {
    return (
        <div
            onClick={() => onClick(inquiry)}
            className="py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
        >
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-[#1e3a5f] hover:text-[#e91e63] transition-colors flex-1 truncate">
                    {inquiry.title}
                </h4>
                <InquiryStatusBadge status={inquiry.answerStatus} />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{formatDate(inquiry.createdAt)}</span>
                <span>·</span>
                <span>{getCategoryName(inquiry.communityCodeId)}</span>
            </div>
        </div>
    );
};

export default InquiryItem;