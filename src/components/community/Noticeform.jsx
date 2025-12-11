import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NoticeForm = ({ formData, setFormData, onSubmit, submitText, cancelPath }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    카테고리
                </label>
                <select
                    value={formData.communityCodeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, communityCodeId: parseInt(e.target.value) }))}
                    className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:border-[#1e3a5f] focus:ring-0 bg-transparent text-[#1e3a5f]"
                >
                    <option value="5">회원</option>
                    <option value="6">결제</option>
                    <option value="7">구독</option>
                    <option value="8">파티</option>
                    <option value="9">정산</option>
                    <option value="10">시스템</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    제목
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="제목을 입력하세요"
                    className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:border-[#1e3a5f] focus:ring-0 focus:outline-none bg-transparent text-[#1e3a5f] placeholder-gray-400"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    내용
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="내용을 입력하세요"
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] focus:outline-none bg-transparent text-[#1e3a5f] placeholder-gray-400 resize-none"
                />
            </div>

            <div className="flex items-center justify-center gap-4 pt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(cancelPath)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    className="bg-[#1e3a5f] hover:bg-[#152a45] text-white"
                >
                    {submitText}
                </Button>
            </div>
        </form>
    );
};

export default NoticeForm;