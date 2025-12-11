import { useState, useEffect } from 'react';
import { uploadProductImage } from '../../api/productApi';

export const useProductImage = (initialImageUrl = '') => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialImageUrl || null);

    // initialImageUrl 변경 시 미리보기 업데이트 (단, 사용자가 파일을 선택하지 않은 경우에만)
    useEffect(() => {
        if (!selectedFile && initialImageUrl) {
            setPreviewUrl(initialImageUrl);
        } else if (!selectedFile && !initialImageUrl) {
            setPreviewUrl(null);
        }
    }, [initialImageUrl, selectedFile]);


    const handleFileChange = (e, onError) => {
        // 이미 파일이 있는데 선택창을 통해 또 선택했을 경우 체크 (선택사항, UX 정책에 따름)
        if (selectedFile) {
            e.preventDefault();
            if (onError) onError("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
            return;
        }

        const file = e.target.files[0];
        if (file) {
            // 용량 체크 (10MB)
            if (file.size > 10 * 1024 * 1024) {
                if (onError) onError("파일 사이즈는 10MB를 초과할 수 없습니다.");
                e.target.value = '';
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (fileInputId) => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputId) {
            const fileInput = document.getElementById(fileInputId);
            if (fileInput) fileInput.value = '';
        }
    };

    // 이미지 업로드 로직
    // formDataImage: 폼 데이터에 있는 기존 이미지 URL (이미지 변경 없으면 이거 사용)
    const uploadImageIfSelected = async (currentFormImage) => {
        if (selectedFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', selectedFile);
            const uploadResponse = await uploadProductImage(uploadFormData);
            return uploadResponse; // 업로드된 URL
        }
        return currentFormImage; // 변경 없으면 기존 URL 반환
    };

    return {
        selectedFile,
        setSelectedFile,
        previewUrl,
        setPreviewUrl,
        handleFileChange,
        handleRemoveImage,
        uploadImageIfSelected
    };
};
