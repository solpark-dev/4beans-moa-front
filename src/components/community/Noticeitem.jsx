import React from 'react';
import { Badge } from '@/components/ui/badge';

const NoticeItem = ({ notice, index, onClick }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div
            onClick={() => onClick(notice.communityId, index)}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors items-center"
        >
            <div className="col-span-1 text-center">
                <span className="font-bold text-blue-600 text-lg">{index}</span>
            </div>
            <div className="col-span-2 text-center">
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                    {notice.categoryName}
                </Badge>
            </div>
            <div className="col-span-6 font-medium text-gray-900 truncate">
                {notice.title}
            </div>
            <div className="col-span-2 text-center text-gray-500 text-sm">
                {formatDate(notice.createdAt)}
            </div>
            <div className="col-span-1 text-center text-gray-500 text-sm">
                {notice.viewCount || 0}
            </div>
        </div>
    );
};

export default NoticeItem;