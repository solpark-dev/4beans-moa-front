import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import NoticeForm from '../../components/community/NoticeForm';
import { useAuthStore } from '@/store/authStore';
import { NeoCard, NeoButton } from '@/components/common/neo';

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
                    <NeoCard
                        color="bg-white"
                        hoverable={false}
                        className="inline-block px-8 py-6 rounded-2xl"
                    >
                        <p className="text-gray-600 font-bold mb-6">관리자만 접근 가능합니다.</p>
                        <NeoButton
                            onClick={() => navigate('/community/notice')}
                            color="bg-pink-500"
                            size="sm"
                        >
                            목록으로 돌아가기
                        </NeoButton>
                    </NeoCard>
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
                <NeoCard
                    color="bg-lime-400"
                    hoverable={false}
                    className="inline-block px-4 py-2 rounded-xl mb-8"
                >
                    <h2 className="text-xl font-black text-black">
                        공지사항 등록
                    </h2>
                </NeoCard>
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
