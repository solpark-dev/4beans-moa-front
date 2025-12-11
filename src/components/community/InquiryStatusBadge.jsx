import React from 'react';

const InquiryStatusBadge = ({ status }) => {
    if (status === '답변완료') {
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#e91e63]/10 text-[#e91e63]">
                답변완료
            </span>
        );
    }
    return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            답변대기
        </span>
    );
};

export default InquiryStatusBadge;