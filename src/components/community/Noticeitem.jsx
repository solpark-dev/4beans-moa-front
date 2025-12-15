import React from 'react';
import { NeoCard } from '@/components/common/neo';

const NoticeItem = ({ notice, index, formatDate, onClick }) => {
    return (
        <div className="mb-3">
            <NeoCard
                color="bg-white"
                hoverable={false}
                className="rounded-xl p-4 cursor-pointer hover:bg-lime-100 transition-all"
                onClick={onClick}
            >
                <div className="grid grid-cols-12 items-center">
                    {/* 번호 */}
                    <div className="col-span-1 text-center">
                        <span className="font-black text-gray-400">{index}</span>
                    </div>

                    {/* 제목 */}
                    <div className="col-span-7 px-2">
                        <span className="font-bold text-black truncate block">
                            {notice.title}
                        </span>
                    </div>

                    {/* 등록일 */}
                    <div className="col-span-2 text-center text-sm font-bold text-gray-500">
                        {formatDate(notice.createdAt)}
                    </div>

                    {/* 조회수 */}
                    <div className="col-span-2 flex justify-center">
                        <span className="px-3 py-1 bg-lime-400 rounded-lg border-2 border-black text-sm font-black">
                            {notice.viewCount || 0}
                        </span>
                    </div>
                </div>
            </NeoCard>
        </div>
    );
};

export default NoticeItem;
