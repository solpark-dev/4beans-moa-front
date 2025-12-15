import React from 'react';

const InquiryStatusBadge = ({ status }) => {
    if (status === '답변완료') {
        return (
            <span className="px-3 py-1 text-xs font-black rounded-lg bg-lime-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                답변완료
            </span>
        );
    }
    return (
        <span className="px-3 py-1 text-xs font-black rounded-lg bg-gray-200 text-gray-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            답변대기
        </span>
    );
};

export default InquiryStatusBadge;
