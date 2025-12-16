import React, { useRef } from 'react';
import { NeoCard, NeoButton } from '@/components/common/neo';
import { useThemeStore } from '@/store/themeStore';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

const InquiryForm = ({ formData, setFormData, imagePreview, setImageFile, setImagePreview, onSubmit }) => {
    const fileInputRef = useRef(null);
    const { theme } = useThemeStore();

    // Theme-based colors
    const getThemeColors = () => {
        switch (theme) {
            case 'christmas':
                return {
                    focusRing: 'focus:ring-[#c41e3a]',
                    fileButton: 'file:bg-[#1a5f2a]',
                    removeButton: 'bg-[#c41e3a] hover:bg-[#a51830]',
                    submitButton: 'bg-[#c41e3a]',
                    cardBg: theme === 'dark' ? 'bg-[#1E293B]' : 'bg-white',
                    textColor: theme === 'dark' ? 'text-gray-200' : 'text-black',
                    inputBg: theme === 'dark' ? 'bg-[#0F172A] border-gray-700' : 'bg-white border-gray-200',
                };
            case 'dark':
                return {
                    focusRing: 'focus:ring-[#635bff]',
                    fileButton: 'file:bg-[#635bff]',
                    removeButton: 'bg-[#635bff] hover:bg-[#5851e8]',
                    submitButton: 'bg-[#635bff]',
                    cardBg: 'bg-[#1E293B]',
                    textColor: 'text-gray-200',
                    inputBg: 'bg-[#0F172A] border-gray-700',
                };
            case 'portrait':
                return {
                    focusRing: 'focus:ring-pink-400',
                    fileButton: 'file:bg-gradient-to-r file:from-[#FFB5C5] file:to-[#C5B5FF]',
                    removeButton: 'bg-pink-500 hover:bg-pink-600',
                    submitButton: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF]',
                    cardBg: 'bg-white',
                    textColor: 'text-black',
                    inputBg: 'bg-white border-gray-200',
                };
            case 'classic':
                return {
                    focusRing: 'focus:ring-[#635bff]',
                    fileButton: 'file:bg-[#635bff]',
                    removeButton: 'bg-[#635bff] hover:bg-[#5851e8]',
                    submitButton: 'bg-[#635bff]',
                    cardBg: 'bg-white',
                    textColor: 'text-black',
                    inputBg: 'bg-white border-gray-200',
                };
            case 'pop':
            default:
                return {
                    focusRing: 'focus:ring-cyan-400',
                    fileButton: 'file:bg-lime-400',
                    removeButton: 'bg-pink-500 hover:bg-pink-600',
                    submitButton: 'bg-pink-500',
                    cardBg: 'bg-white',
                    textColor: 'text-black',
                    inputBg: 'bg-white border-gray-200',
                };
        }
    };

    const themeColors = getThemeColors();

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
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <NeoCard
            color={themeColors.cardBg}
            hoverable={false}
            className="rounded-2xl p-6 h-[687px] flex flex-col"
        >
            <div className="space-y-6 flex-1 overflow-y-auto">
                {/* Category */}
                <div>
                    <label className={`block text-sm font-black ${themeColors.textColor} mb-2`}>
                        카테고리
                    </label>
                    <select
                        name="communityCodeId"
                        value={formData.communityCodeId}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl font-bold ${themeColors.inputBg} focus:outline-none focus:ring-2 ${themeColors.focusRing} ${themeColors.textColor}`}
                    >
                        <option value="1">회원</option>
                        <option value="2">결제</option>
                        <option value="3">기타</option>
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className={`block text-sm font-black ${themeColors.textColor} mb-2`}>
                        제목
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="문의 제목을 입력하세요"
                        className={`w-full px-4 py-3 rounded-xl font-bold ${themeColors.inputBg} focus:outline-none focus:ring-2 ${themeColors.focusRing} ${themeColors.textColor} placeholder-gray-400`}
                    />
                </div>

                {/* Content */}
                <div>
                    <label className={`block text-sm font-black ${themeColors.textColor} mb-2`}>
                        내용
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="문의 내용을 입력하세요"
                        rows={6}
                        className={`w-full px-4 py-3 rounded-xl font-bold ${themeColors.inputBg} focus:outline-none focus:ring-2 ${themeColors.focusRing} ${themeColors.textColor} placeholder-gray-400 resize-none`}
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className={`block text-sm font-black ${themeColors.textColor} mb-2`}>
                        이미지 첨부
                    </label>
                    <p className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-3`}>JPG, PNG 파일만 가능 (최대 10MB)</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageChange}
                        className={`w-full text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-black
                            ${themeColors.fileButton} file:text-white
                            file:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
                            file:hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]

                            file:transition-all file:cursor-pointer`}
                    />
                    {imagePreview && (
                        <div className="mt-4 relative inline-block">
                            <img
                                src={imagePreview}
                                alt="미리보기"
                                className="max-w-[120px] h-auto rounded-xl border border-gray-200 max-h-20 object-contain shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className={`absolute -top-1 -right-1 w-6 h-6 ${themeColors.removeButton} text-white rounded-full font-black text-xs border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] transition-colors flex items-center justify-center`}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                </div>

            {/* Submit Button - 항상 하단 고정 */}
            <div className="pt-4 mt-auto">
                <NeoButton
                    color={`${themeColors.submitButton} text-white`}
                    size="xs"
                    onClick={onSubmit}
                    className="w-full justify-center"
                >
                    문의 등록
                </NeoButton>
            </div>
        </NeoCard>
    );
};

export default InquiryForm;
