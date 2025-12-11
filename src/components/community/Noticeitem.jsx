import React from 'react';

const NoticeItem = ({ notice, index, formatDate, onClick }) => {
    const noticeId = notice.communityId || notice.id;
    const isImportant = notice.title.includes('[공지') || notice.title.includes('공지]');

    return (
        <div 
            onClick={onClick}
            className="grid grid-cols-12 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
        >
            <div className="col-span-1 text-center">
                {isImportant ? (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-[#e91e63] text-white rounded">
                        공지
                    </span>
                ) : (
                    <span className="text-sm text-gray-500">{index}</span>
                )}
            </div>
            <div className="col-span-7 px-4">
                <span className="text-[#1e3a5f] hover:text-[#e91e63] transition-colors">
                    {notice.title}
                </span>
            </div>
            <div className="col-span-2 text-center text-sm text-gray-500">
                {formatDate(notice.createdAt)}
            </div>
            <div className="col-span-2 text-center text-sm text-gray-500">
                {notice.viewCount || 0}
            </div>
        </div>
    );
};

export default NoticeItem;