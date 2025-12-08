import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CommunityLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActiveTab = (path) => {
        return location.pathname.includes(path);
    };

    const tabs = [
        { name: 'FAQ', path: '/community/faq' },
        { name: '공지사항', path: '/community/notice' },
        { name: '문의하기', path: null, onClick: handleInquiryClick }
    ];

    function handleInquiryClick() {
        // 임시: 로그인 체크 비활성화
        // const userRole = sessionStorage.getItem('role');
        // const userId = sessionStorage.getItem('userId');
        
        // if (!userId) {
        //     alert('로그인이 필요한 서비스입니다.');
        //     navigate('/login');
        //     return;
        // }
        
        // if (userRole === 'ADMIN') {
        //     navigate('/community/inquiry/admin');
        // } else {
        //     navigate('/community/inquiry');
        // }
        
        // 임시: 무조건 유저 페이지로
        navigate('/community/inquiry');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
                        고객센터
                    </h1>
                    
                    <div className="flex justify-center gap-2">
                        {tabs.map((tab) => (
                            <Button
                                key={tab.name}
                                variant={isActiveTab(tab.path || '/community/inquiry') ? 'default' : 'ghost'}
                                onClick={() => tab.onClick ? tab.onClick() : navigate(tab.path)}
                                className={isActiveTab(tab.path || '/community/inquiry') ? 'bg-blue-600 hover:bg-blue-700' : ''}
                            >
                                {tab.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </div>
        </div>
    );
};

export default CommunityLayout;