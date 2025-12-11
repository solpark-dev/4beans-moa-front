import React from 'react';
import { Button } from '@/components/ui/button';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

const InquiryForm = ({ formData, setFormData, imagePreview, setImageFile, setImagePreview, onSubmit }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            alert('JPG, PNG 파일만 업로드 가능합니다.');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            alert('파일 크기는 10MB 이하만 가능합니다.');
            e.target.value = '';
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    return (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    카테고리
                </label>
                <select
                    name="communityCodeId"
                    value={formData.communityCodeId}
                    onChange={handleChange}
                    className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:border-[#1e3a5f] focus:ring-0 bg-transparent text-[#1e3a5f]"
                >
                    <option value="1">회원</option>
                    <option value="2">결제</option>
                    <option value="3">기타</option>
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
                    placeholder="문의 제목을 입력하세요"
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
                    placeholder="문의 내용을 입력하세요"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] focus:outline-none bg-transparent text-[#1e3a5f] placeholder-gray-400 resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    이미지 첨부
                </label>
                <p className="text-xs text-gray-500 mb-2">JPG, PNG 파일만 가능 (최대 10MB)</p>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#1e3a5f]/10 file:text-[#1e3a5f] hover:file:bg-[#1e3a5f]/20"
                />
                {imagePreview && (
                    <div className="mt-3 relative inline-block">
                        <img 
                            src={imagePreview} 
                            alt="미리보기" 
                            className="max-w-full h-auto rounded-lg border max-h-40 object-contain"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-[#e91e63] text-white rounded-full text-xs hover:bg-[#c2185b]"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            <Button 
                onClick={onSubmit}
                className="w-full bg-[#1e3a5f] hover:bg-[#152a45] text-white"
            >
                문의 등록
            </Button>
        </div>
    );
};

export default InquiryForm;