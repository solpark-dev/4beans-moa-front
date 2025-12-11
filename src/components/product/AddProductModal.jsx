import React, { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';
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

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
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

    // 모달이 열릴 때마다 form 초기화 (선택 사항)
    useEffect(() => {
        if (isOpen) {
            setFormData({
                productName: '',
                price: '',
                categoryId: '',
                image: '',
                productStatus: 'ACTIVE'
            });
            setSelectedFile(null);
            setPreviewUrl(null);
            setLoading(false);
        }
    }, [isOpen]);

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
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (selectedFile) {
            e.preventDefault();
            showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
            return;
        }

        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                showAlert("파일 사이즈는 10MB를 초과할 수 없습니다.");
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

    const handleInputClick = (e) => {
        if (selectedFile) {
            e.preventDefault();
            showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        const fileInput = document.getElementById('modal-image-upload');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        try {
            let imageUrl = formData.image;

            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);

                const uploadResponse = await httpClient.post('/product/upload', uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                imageUrl = uploadResponse;
            }

            const productPayload = {
                ...formData,
                price: Number(formData.price),
                categoryId: Number(formData.categoryId),
                image: imageUrl
            };

            const response = await httpClient.post('/product', productPayload);

            if (response === undefined || response === '' || response?.success) {
                // 성공 시
                onSuccess?.();
                // 알림 대신 바로 닫거나 상위에서 처리할 수도 있지만, 
                // 기존 UX 유지 차원에서 알림 후 닫기
                // 하지만 onSuccess가 리프레시 포함하므로, 여기서 알림 띄우고 닫는게 나음.
                // 여기서는 onSuccess 호출하고 닫습니다. (알림은 생략하거나 필요시 추가)
                onClose();
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

    // 드래그 앤 드롭
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);
    const hasFileRef = useRef(false);

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

    // 드래그 이벤트는 모달 내부 영역에 한정하는 것이 좋으나, 
    // 전체 화면 드래그 UX를 유지하려면 window 이벤트 사용.
    // 다만 다이얼로그 위에 다이얼로그가 뜨면 복잡해질 수 있음.
    // 여기서는 DialogContent 내부 div에 ref를 걸거나 window 사용.
    // 기존 UX 유지를 위해 window 사용하되, isOpen 일때만 동작하도록.

    useEffect(() => {
        if (!isOpen) return;

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

            if (hasFileRef.current) {
                showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
                return;
            }

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
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
    }, [isOpen]);


    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl bg-white rounded-[2rem] p-0 overflow-hidden max-h-[90vh] flex flex-col">
                    <DialogHeader className="p-8 pb-0 shrink-0">
                        <DialogTitle className="text-3xl font-bold text-stone-900">새로운 구독 상품 등록</DialogTitle>
                        <DialogDescription className="text-stone-500">
                            관리자 권한으로 새로운 구독 서비스를 등록합니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative">
                        {/* 전체 화면 드래그 오버레이 (Dialog Content 내부) */}
                        {isDragging && !selectedFile && (
                            <div className="absolute inset-0 z-50 bg-indigo-500/10 backdrop-blur-sm border-4 border-indigo-500 rounded-xl flex items-center justify-center m-4 pointer-events-none">
                                <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-bounce">
                                    <Upload className="w-16 h-16 text-indigo-600 mb-4" />
                                    <h3 className="text-2xl font-bold text-indigo-900">여기에 파일을 놓으세요</h3>
                                    <p className="text-indigo-600">이미지가 자동으로 업로드됩니다.</p>
                                </div>
                            </div>
                        )}

                        <form id="add-product-form" onSubmit={handleSubmit} className="space-y-8">
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
                                                id="modal-image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                onClick={handleInputClick}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="modal-image-upload"
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
                        </form>
                    </div>

                    <DialogFooter className="p-8 pt-4 shrink-0 bg-white border-t border-stone-100">
                        <div className="flex w-full gap-3">
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="outline"
                                className="flex-1 py-6 rounded-xl font-bold text-stone-500 hover:bg-stone-50 text-base"
                            >
                                취소
                            </Button>
                            <Button
                                type="submit"
                                form="add-product-form"
                                disabled={loading}
                                className={`flex-[2] py-6 rounded-xl font-bold text-lg text-white shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] 
                                    ${loading
                                        ? 'bg-stone-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        처리 중...
                                    </>
                                ) : (
                                    '상품 등록하기'
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 커스텀 알림 모달 (중첩 Dialog) */}
            <Dialog open={alertInfo.isOpen} onOpenChange={(open) => !open && setAlertInfo(prev => ({ ...prev, isOpen: false }))}>
                <DialogContent className="sm:max-w-md bg-white rounded-2xl z-[60]">
                    {/* z-index 높여서 위로 뜨게, 기본 Dialog z-index는 50 */}
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
        </>
    );
};

export default AddProductModal;
