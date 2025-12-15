import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { NeoCard, NeoButton } from '@/components/common/neo';

const CommunityLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();

    const isActiveTab = (path) => {
        if (path === '/community/inquiry') {
            return location.pathname.includes('/community/inquiry');
        }
        return location.pathname.includes(path);
    };

    const handleInquiryClick = () => {
        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        if (user.role === 'ADMIN') {
            navigate('/community/inquiry/admin');
        } else {
            navigate('/community/inquiry');
        }
    };

    const tabs = [
        { name: 'FAQ', path: '/community/faq', onClick: null },
        { name: '공지사항', path: '/community/notice', onClick: null },
        { name: '1:1 문의', path: '/community/inquiry', onClick: handleInquiryClick }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="border-b-4 border-black bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                    <NeoCard
                        color="bg-pink-500"
                        rotate={-1}
                        hoverable={false}
                        className="inline-block px-6 py-3 rounded-2xl mx-auto"
                    >
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            고객센터
                        </h1>
                    </NeoCard>
                </div>

                {/* Tab Navigation */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                    <nav className="flex justify-center gap-4">
                        {tabs.map((tab) => {
                            const isActive = isActiveTab(tab.path);
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => tab.onClick ? tab.onClick() : navigate(tab.path)}
                                    className={`
                                        px-6 py-3 font-black text-lg rounded-xl
                                        border-4 border-black
                                        transition-all duration-200
                                        ${isActive
                                            ? 'bg-cyan-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                            : 'bg-white text-black hover:bg-lime-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                                        }
                                    `}
                                >
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </div>
        </div>
    );
};

export default CommunityLayout;
