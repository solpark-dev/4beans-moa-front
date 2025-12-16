import React from 'react';
import InquiryStatusBadge from './InquiryStatusBadge';
import { formatDate, getCategoryName } from '../../utils/communityUtils';
import { useThemeStore } from '@/store/themeStore';

// 테마별 스타일
const inquiryItemThemeStyles = {
    default: {
        categoryBadge: 'bg-cyan-400',
        hoverBg: 'hover:bg-lime-100',
    },
    christmas: {
        categoryBadge: 'bg-amber-100 text-amber-700',
        hoverBg: 'hover:bg-red-50',
    },
};

const InquiryItem = ({ inquiry, onClick }) => {
    const { theme } = useThemeStore();
    const themeStyle = inquiryItemThemeStyles[theme] || inquiryItemThemeStyles.default;

    return (
        <div
            onClick={() => onClick(inquiry)}
            className={`py-4 border-b border-gray-200 last:border-b-0 cursor-pointer ${themeStyle.hoverBg} transition-colors min-w-0`}
        >
            <div className="flex items-start justify-between mb-2 min-w-0">
                <h4 className="font-bold text-black flex-1 min-w-0 truncate pr-3">
                    {inquiry.title}
                </h4>
                <InquiryStatusBadge status={inquiry.answerStatus} />
            </div>
            <div className="flex items-center gap-3 text-sm">
                <span className="font-bold text-gray-500">{formatDate(inquiry.createdAt)}</span>
                <span className={`px-2 py-0.5 ${themeStyle.categoryBadge} rounded-md border border-gray-200 text-xs font-black`}>
                    {getCategoryName(inquiry.communityCodeId)}
                </span>
            </div>
        </div>
    );
};

export default InquiryItem;
