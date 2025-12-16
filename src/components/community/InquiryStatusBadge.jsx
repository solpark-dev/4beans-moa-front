import React from 'react';
import { useThemeStore } from '@/store/themeStore';

// 테마별 문의 상태 뱃지 스타일
const inquiryBadgeThemeStyles = {
    default: {
        completed: 'bg-lime-400 text-black',
        pending: 'bg-gray-200 text-gray-600',
    },
    christmas: {
        completed: 'bg-green-800 text-green-100',      // 포레스트 그린
        pending: 'bg-amber-100 text-amber-700',        // 크림 베이지
    },
};

const InquiryStatusBadge = ({ status }) => {
    const { theme } = useThemeStore();
    const themeStyle = inquiryBadgeThemeStyles[theme] || inquiryBadgeThemeStyles.default;

    if (status === '답변완료') {
        return (
            <span className={`px-3 py-1 text-xs font-black rounded-lg ${themeStyle.completed} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
                답변완료
            </span>
        );
    }
    return (
        <span className={`px-3 py-1 text-xs font-black rounded-lg ${themeStyle.pending} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
            답변대기
        </span>
    );
};

export default InquiryStatusBadge;
