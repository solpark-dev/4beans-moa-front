import React from 'react';

/**
 * NeoPagination - 네오브루탈리즘 스타일 페이지네이션 컴포넌트
 *
 * @param {number} currentPage - 현재 페이지
 * @param {number} totalPages - 전체 페이지 수
 * @param {function} onPageChange - 페이지 변경 핸들러
 * @param {number} maxVisible - 표시할 최대 페이지 수 (기본값: 5)
 */
const NeoPagination = ({ currentPage, totalPages, onPageChange, maxVisible = 5 }) => {
    if (totalPages <= 0) return null;

    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    return (
        <div className="flex justify-center">
            <div className="inline-flex items-center gap-2">
                {/* 이전 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 font-black text-sm border-4 border-black rounded-xl bg-white
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-slate-100
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                        hover:translate-x-[2px] hover:translate-y-[2px]
                        transition-all"
                >
                    이전
                </button>

                {/* 페이지 번호들 */}
                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 font-black text-sm border-4 border-black rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            ${currentPage === pageNum
                                ? 'bg-pink-500 text-white'
                                : 'bg-white text-black hover:bg-slate-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                            }`}
                    >
                        {pageNum}
                    </button>
                ))}

                {/* 다음 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 font-black text-sm border-4 border-black rounded-xl bg-white
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-slate-100
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                        hover:translate-x-[2px] hover:translate-y-[2px]
                        transition-all"
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export { NeoPagination };
