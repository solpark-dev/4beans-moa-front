import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import NoticeForm from '../../components/community/NoticeForm';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

const AddNotice = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [formData, setFormData] = useState({
        communityCodeId: 10,
        title: '',
        content: ''
    });

    const isAdmin = user?.role === 'ADMIN';
    const userId = user?.userId || 'admin@moa.com';

    if (!isAdmin) {
        return (
            <CommunityLayout>
                <div className="text-center py-20">
                    <p className="text-gray-500 mb-4">관리자만 접근 가능합니다.</p>
                    <Button 
                        onClick={() => navigate('/community/notice')}
                        className="bg-[#1e3a5f] hover:bg-[#152a45]"
                    >
                        목록으로 돌아가기
                    </Button>
                </div>
            </CommunityLayout>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('제목을 입력하세요.');
            return;
        }

        if (!formData.content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }

        try {
            const response = await fetch('/api/community/notice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: userId
                }),
            });

            if (response.ok) {
                alert('공지사항이 등록되었습니다.');
                navigate('/community/notice');
            } else {
                alert('등록에 실패했습니다.');
            }
        } catch (error) {
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <CommunityLayout>
            <div className="max-w-3xl mx-auto pt-8">
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-8">공지사항 등록</h2>
                <NoticeForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    submitText="등록"
                    cancelPath="/community/notice"
                />
            </div>
        </CommunityLayout>
    );
};

export default AddNotice;