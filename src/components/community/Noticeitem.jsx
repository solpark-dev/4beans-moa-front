import React from 'react';
import { NeoCard } from '@/components/common/neo';
import { useThemeStore } from '@/store/themeStore';

const NoticeItem = ({ notice, index, formatDate, onClick }) => {
    const { theme } = useThemeStore();

    // Theme-based colors
    const getThemeColors = () => {
        switch (theme) {
            case 'christmas':
                return {
                    cardBg: 'bg-white',
                    cardHover: 'hover:bg-[#c41e3a]/10',
                    textColor: 'text-black',
                    indexColor: 'text-gray-400',
                    dateColor: 'text-gray-500',
                    viewBadge: 'bg-[#c41e3a]',
                };
            case 'dark':
                return {
                    cardBg: 'bg-[#1E293B]',
                    cardHover: 'hover:bg-[#635bff]/20',
                    textColor: 'text-gray-200',
                    indexColor: 'text-gray-500',
                    dateColor: 'text-gray-400',
                    viewBadge: 'bg-[#635bff]',
                };
            case 'portrait':
                return {
                    cardBg: 'bg-white',
                    cardHover: 'hover:bg-pink-100',
                    textColor: 'text-black',
                    indexColor: 'text-gray-400',
                    dateColor: 'text-gray-500',
                    viewBadge: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF]',
                };
            case 'classic':
                return {
                    cardBg: 'bg-white',
                    cardHover: 'hover:bg-blue-50',
                    textColor: 'text-black',
                    indexColor: 'text-gray-400',
                    dateColor: 'text-gray-500',
                    viewBadge: 'bg-[#635bff]',
                };
            case 'pop':
            default:
                return {
                    cardBg: 'bg-white',
                    cardHover: 'hover:bg-lime-100',
                    textColor: 'text-black',
                    indexColor: 'text-gray-400',
                    dateColor: 'text-gray-500',
                    viewBadge: 'bg-lime-400',
                };
        }
    };

    const themeColors = getThemeColors();

    return (
        <div className="mb-3">
            <NeoCard
                color={themeColors.cardBg}
                hoverable={false}
                className={`rounded-xl p-4 cursor-pointer ${themeColors.cardHover} transition-all`}
                onClick={onClick}
            >
                <div className="grid grid-cols-12 items-center">
                    {/* 번호 */}
                    <div className="col-span-1 text-center">
                        <span className={`font-black ${themeColors.indexColor}`}>{index}</span>
                    </div>

                    {/* 제목 */}
                    <div className="col-span-7 px-2">
                        <span className={`font-bold ${themeColors.textColor} truncate block`}>
                            {notice.title}
                        </span>
                    </div>

                    {/* 등록일 */}
                    <div className={`col-span-2 text-center text-sm font-bold ${themeColors.dateColor}`}>
                        {formatDate(notice.createdAt)}
                    </div>

                    {/* 조회수 */}
                    <div className="col-span-2 flex justify-center">
                        <span className={`px-3 py-1 ${themeColors.viewBadge} text-white rounded-lg ${theme === 'pop' ? 'border border-gray-200' : ''} text-sm font-black`}>
                            {notice.viewCount || 0}
                        </span>
                    </div>
                </div>
            </NeoCard>
        </div>
    );
};

export default NoticeItem;
