import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, ImageIcon } from 'lucide-react';
import httpClient from '../../api/httpClient';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        categoryId: '',
        image: '',
        productStatus: 'ACTIVE'
    });

    // 이미지 파일 관리 state
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // 커스텀 알림(모달) 관리 state
    const [alertInfo, setAlertInfo] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const showAlert = (message, title = "알림", onConfirm = null) => {
        setAlertInfo({
            isOpen: true,
            title,
            message,
            onConfirm
        });
    };

    useEffect(() => {
        // 카테고리 목록 불러오기
        const fetchCategories = async () => {
            try {
                const response = await httpClient.get('/product/categorie');
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        // 이미 파일이 있는데 선택창을 통해 또 선택했을 경우 체크
        if (selectedFile) {
            e.preventDefault();
            // input value 초기화는 어렵지만, UX상 경고
            // 주의: 여기서 preventDefault는 change 이벤트를 막지 못할 수 있음.
            // 하지만 로직상 체크하여 selectedFile 업데이트를 안하면 됨.
            // 다만, 브라우저 파일 인풋은 이미 파일이 바뀐 상태일 것임.
            // 사용자 요구사항 "알림이 떠야해"를 충족하기 위해 confirm 후 교체 혹은 alert 후 차단.
            // "1장만 업로드 가능하니까... 알림이 떠야해" -> 교체 허용 여부는 명시 안됨. 
            // "파일이 지정된 이후에 또 파일을 올리려고 하면 알림이 떠야해" -> 막으라는 뉘앙스가 강함.
            showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
            return;
        }

        const file = e.target.files[0];
        if (file) {
            // 용량 체크 (10MB)
            if (file.size > 10 * 1024 * 1024) {
                showAlert("파일 사이즈는 10MB를 초과할 수 없습니다.");
                e.target.value = ''; // input 초기화
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

    // 파일 인풋 클릭 핸들러 추가
    const handleInputClick = (e) => {
        if (selectedFile) {
            e.preventDefault();
            showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        // 파일 선택 input 초기화를 위해 id 사용 또는 ref 사용 가능하나 단순화
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        try {
            let imageUrl = formData.image; // 기본적으로 입력된 URL이 있다면 사용 (하위 호환)

            // 1. 이미지가 선택되었다면 업로드 수행
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);

                // 이미지 업로드 API 호출
                // 주의: 백엔드 Controller가 String 그대로 반환하므로 httpClient 기본 설정에 따라 response 자체가 URL일 수 있음
                // 하지만 httpClient interceptor가 response.data를 반환하므로, String body가 반환됨
                const uploadResponse = await httpClient.post('/product/upload', uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // 업로드된 URL 사용
                imageUrl = uploadResponse;
            }

            // 2. 상품 등록 요청
            const productPayload = {
                ...formData,
                price: Number(formData.price),
                categoryId: Number(formData.categoryId),
                image: imageUrl
            };

            const response = await httpClient.post('/product', productPayload);

            // 백엔드가 void를 반환하므로 response가 비어있거나 success 필드가 없을 수 있음
            // 에러가 발생하지 않았다면 성공으로 간주
            // 만약 ApiResponse로 래핑되어 있다면 response.success 확인
            if (response === undefined || response === '' || response?.success) {
                showAlert('상품이 성공적으로 등록되었습니다.', '성공', () => navigate('/product'));
            } else {
                showAlert(response?.error?.message || '상품 등록에 실패했습니다.', '오류');
            }

        } catch (error) {
            console.error("Failed to add product", error);
            showAlert('상품 등록 중 오류가 발생했습니다.', '오류');
        } finally {
            setLoading(false);
        }
    };

    // 드래그 앤 드롭 핸들러 (Global)
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = React.useRef(0);
    const hasFileRef = React.useRef(false);

    useEffect(() => {
        hasFileRef.current = !!selectedFile;
    }, [selectedFile]);

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    useEffect(() => {
        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current++;
            if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
                setIsDragging(true);
            }
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current--;
            if (dragCounter.current === 0) {
                setIsDragging(false);
            }
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            dragCounter.current = 0;

            // 파일이 이미 있는지 확인
            if (hasFileRef.current) {
                showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
                return;
            }

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                // 용량 체크 (10MB)
                if (file.size > 10 * 1024 * 1024) {
                    showAlert("파일 사이즈는 10MB를 초과할 수 없습니다.");
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

        // Window 이벤트 등록
        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl relative">
            {/* 전체 화면 드래그 오버레이 */}
            {isDragging && !selectedFile && (
                <div className="fixed inset-0 z-50 bg-indigo-500/10 backdrop-blur-sm border-4 border-indigo-500 rounded-xl flex items-center justify-center m-4 pointer-events-none">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-bounce">
                        <Upload className="w-16 h-16 text-indigo-600 mb-4" />
                        <h3 className="text-2xl font-bold text-indigo-900">여기에 파일을 놓으세요</h3>
                        <p className="text-indigo-600">이미지가 자동으로 업로드됩니다.</p>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold mb-2 text-stone-900">새로운 구독 상품 등록</h1>
            <p className="text-stone-500 mb-8">관리자 권한으로 새로운 구독 서비스를 등록합니다.</p>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-xl space-y-8">
                {/* 상품명 */}
                <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">상품명 <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                        placeholder="예: Netflix Premium"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* 카테고리 */}
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">카테고리 <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none font-medium cursor-pointer"
                                required
                            >
                                <option value="">선택하세요</option>
                                {categories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                    {/* 가격 */}
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">가격 (월) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold">₩</span>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-bold"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* 이미지 업로드 */}
                <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">상품 이미지</label>
                    <div className="space-y-4">
                        {!previewUrl ? (
                            <div className="relative group">
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    onClick={handleInputClick}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all group-hover:scale-[0.99]
                                        ${isDragging
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-indigo-400'
                                        }`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center mb-3 transition-colors ${isDragging ? 'bg-indigo-100' : 'bg-white'}`}>
                                            <Upload className={`w-6 h-6 ${isDragging ? 'text-indigo-600' : 'text-indigo-500'}`} />
                                        </div>
                                        <p className="mb-2 text-sm text-stone-600 font-bold"><span className="text-indigo-600">클릭하여 업로드</span> 또는 파일 놓기</p>
                                        <p className="text-xs text-stone-400">PNG, JPG, GIF (MAX. 10MB)</p>
                                    </div>
                                </label>
                            </div>
                        ) : (
                            <div className="relative w-full h-64 bg-stone-100 rounded-2xl overflow-hidden group border border-stone-200 shadow-sm">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-contain bg-stone-50"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                                    <div className="text-white">
                                        <p className="font-bold truncate text-lg mb-1">{selectedFile?.name}</p>
                                        <p className="text-stone-300 text-sm font-medium bg-white/20 inline-block px-2 py-1 rounded-lg backdrop-blur-sm">
                                            {selectedFile?.size && formatBytes(selectedFile.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white text-stone-700 rounded-xl shadow-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-6 border-t border-stone-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                            ${loading
                                ? 'bg-stone-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                처리 중...
                            </>
                        ) : (
                            '상품 등록하기'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/product')}
                        className="w-full mt-3 py-4 rounded-xl font-bold text-stone-500 hover:bg-stone-100 transition-colors"
                    >
                        취소
                    </button>
                </div>
            </form>

            {/* 커스텀 알림 모달 */}
            <Dialog open={alertInfo.isOpen} onOpenChange={(open) => !open && setAlertInfo(prev => ({ ...prev, isOpen: false }))}>
                <DialogContent className="sm:max-w-md bg-white rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>{alertInfo.title}</DialogTitle>
                        <DialogDescription>
                            {alertInfo.message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                        <Button
                            type="button"
                            onClick={() => {
                                setAlertInfo(prev => ({ ...prev, isOpen: false }));
                                if (alertInfo.onConfirm) alertInfo.onConfirm();
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                        >
                            확인
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddProduct;
