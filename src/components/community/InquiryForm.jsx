import React from 'react';
import { NeoCard, NeoButton } from '@/components/common/neo';

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
        <NeoCard
            color="bg-white"
            hoverable={false}
            className="rounded-2xl p-6"
        >
            <div className="space-y-6">
                {/* Category */}
                <div>
                    <label className="block text-sm font-black text-black mb-2">
                        카테고리
                    </label>
                    <select
                        name="communityCodeId"
                        value={formData.communityCodeId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-4 border-black rounded-xl font-bold bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        <option value="1">회원</option>
                        <option value="2">결제</option>
                        <option value="3">기타</option>
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-black text-black mb-2">
                        제목
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="문의 제목을 입력하세요"
                        className="w-full px-4 py-3 border-4 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-black text-black mb-2">
                        내용
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="문의 내용을 입력하세요"
                        rows={6}
                        className="w-full px-4 py-3 border-4 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 resize-none"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-black text-black mb-2">
                        이미지 첨부
                    </label>
                    <p className="text-xs font-bold text-gray-500 mb-3">JPG, PNG 파일만 가능 (최대 10MB)</p>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageChange}
                        className="w-full text-sm font-bold text-gray-600
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-2 file:border-black
                            file:text-sm file:font-black
                            file:bg-lime-400 file:text-black
                            file:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                            file:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                            file:hover:translate-x-[1px] file:hover:translate-y-[1px]
                            file:transition-all file:cursor-pointer"
                    />
                    {imagePreview && (
                        <div className="mt-4 relative inline-block">
                            <img
                                src={imagePreview}
                                alt="미리보기"
                                className="max-w-full h-auto rounded-xl border-4 border-black max-h-40 object-contain shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 text-white rounded-full font-black text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <NeoButton
                    color="bg-pink-500 text-white"
                    onClick={onSubmit}
                    className="w-full"
                >
                    문의 등록
                </NeoButton>
            </div>
        </NeoCard>
    );
};

export default InquiryForm;
