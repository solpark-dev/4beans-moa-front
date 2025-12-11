import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

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
        <div className="min-h-screen bg-white">
            <div className="border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8">
                    <h1 className="text-4xl font-bold text-center text-[#1e3a5f] tracking-tight">
                        고객센터
                    </h1>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex justify-center gap-12">
                        {tabs.map((tab) => {
                            const isActive = isActiveTab(tab.path);
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => tab.onClick ? tab.onClick() : navigate(tab.path)}
                                    className={`
                                        pb-4 text-base font-medium transition-all duration-200
                                        ${isActive 
                                            ? 'text-[#e91e63] border-b-2 border-[#e91e63]' 
                                            : 'text-[#1e3a5f] hover:text-[#e91e63]'
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </div>
        </div>
    );
};

export default CommunityLayout;