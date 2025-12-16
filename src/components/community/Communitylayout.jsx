import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { NeoCard, NeoButton } from '@/components/common/neo';

const CommunityLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();

    // Theme-based colors
    const getThemeColors = () => {
        switch (theme) {
            case 'christmas':
                return {
                    primary: 'bg-[#c41e3a]',
                    secondary: 'bg-[#1a5f2a]',
                    tertiary: 'bg-white',
                    activeTab: 'bg-[#c41e3a]',
                    inactiveTabHover: 'hover:bg-[#c41e3a]/10',
                };
            case 'dark':
                return {
                    primary: 'bg-[#635bff]',
                    secondary: 'bg-gray-700',
                    tertiary: 'bg-gray-800',
                    activeTab: 'bg-[#635bff]',
                    inactiveTabHover: 'hover:bg-[#635bff]/20',
                };
            case 'portrait':
                return {
                    primary: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF]',
                    secondary: 'bg-pink-300',
                    tertiary: 'bg-white',
                    activeTab: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF]',
                    inactiveTabHover: 'hover:bg-pink-100',
                };
            case 'classic':
                return {
                    primary: 'bg-[#635bff]',
                    secondary: 'bg-blue-500',
                    tertiary: 'bg-white',
                    activeTab: 'bg-[#635bff]',
                    inactiveTabHover: 'hover:bg-blue-100',
                };
            case 'pop':
            default:
                return {
                    primary: 'bg-pink-500',
                    secondary: 'bg-cyan-400',
                    tertiary: 'bg-lime-400',
                    activeTab: 'bg-cyan-400',
                    inactiveTabHover: 'hover:bg-lime-400',
                };
        }
    };

    const themeColors = getThemeColors();

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
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0B1120]' : theme === 'portrait' ? 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]' : 'bg-slate-50'}`}>
            {/* Header Section */}
            <div className={`${theme === 'pop' ? 'border-b-4 border-black' : theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'} ${theme === 'dark' ? 'bg-[#1E293B]' : 'bg-white'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                    <NeoCard
                        color={themeColors.primary}
                        rotate={-1}
                        hoverable={false}
                        className="inline-block px-6 py-3 rounded-2xl mx-auto"
                    >
                        <h1 className={`text-3xl font-black tracking-tight ${theme === 'portrait' || theme === 'pop' || theme === 'christmas' ? 'text-white' : 'text-white'}`}>
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
                                        ${theme === 'pop' ? 'border border-gray-200' : theme === 'dark' ? 'border border-gray-600' : 'border border-gray-200'}
                                        transition-all duration-200
                                        ${isActive
                                            ? `${themeColors.activeTab} ${theme === 'dark' ? 'text-white' : 'text-white'} shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`
                                            : `${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-white text-black'} ${themeColors.inactiveTabHover} shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`
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
