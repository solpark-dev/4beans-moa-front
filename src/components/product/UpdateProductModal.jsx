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

const UpdateProductModal = ({ isOpen, onClose, productId, onSuccess, initialData }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        categoryId: '',
        image: '',
        productStatus: 'ACTIVE'
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

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

    // Reset and Fetch Data on Open
    useEffect(() => {
        if (isOpen && productId) {
            // 1. Initial Data로 즉시 렌더링
            if (initialData) {
                setFormData({
                    productName: initialData.productName || '',
                    price: initialData.price || '',
                    categoryId: initialData.categoryId || '',
                    image: initialData.image || '',
                    productStatus: initialData.productStatus || 'ACTIVE'
                });
                if (initialData.image) {
                    setPreviewUrl(initialData.image);
                }
            } else {
                // initialData가 없을 때만 초기화 (깜빡임 방지)
                setFormData({
                    productName: '',
                    price: '',
                    categoryId: '',
                    image: '',
                    productStatus: 'ACTIVE'
                });
                setPreviewUrl(null);
            }
            setSelectedFile(null);

            // 2. Background Fetch (최신 데이터 동기화)
            const initData = async () => {
                try {
                    // 데이터가 없으면 로딩 표시
                    if (!initialData) setLoading(true);

                    // Fetch Categories
                    const catResponse = await httpClient.get('/product/categorie');
                    if (catResponse.success) {
                        setCategories(catResponse.data);
                    }

                    // Fetch Product Data
                    const prodResponse = await httpClient.get(`/product/${productId}`);
                    if (prodResponse.success) {
                        const product = prodResponse.data;
                        // 폼 데이터 최신화 (사용자가 이미 입력을 시작했으면 덮어쓰지 않는게 좋지만, 
                        // 여기서는 단순함을 위해 최신 데이터로 업데이트)
                        setFormData({
                            productName: product.productName,
                            price: product.price,
                            categoryId: product.categoryId,
                            image: product.image || '',
                            productStatus: product.productStatus
                        });

                        if (product.image) {
                            setPreviewUrl(product.image);
                        }
                    }
                } catch (error) {
                    console.error("Failed to load data", error);
                    if (!initialData) showAlert("데이터를 불러오는데 실패했습니다.", "오류", onClose);
                } finally {
                    setLoading(false);
                }
            };
            initData();
        }
    }, [isOpen, productId, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (selectedFile) {
            e.preventDefault();
            showAlert("이미지가 이미 지정되어 있습니다. 새로운 이미지를 업로드하려면 'X' 버튼을 눌러 기존 이미지를 삭제해주세요.");
            return;
        }

        if (!selectedFile && previewUrl && !formData.image.startsWith('blob:')) {
            if (previewUrl) {
                e.preventDefault();
                showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
                return;
            }
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
        if (selectedFile || previewUrl) {
            e.preventDefault();
            showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData(prev => ({ ...prev, image: '' }));
        const fileInput = document.getElementById('update-modal-image-upload');
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
                productId: Number(productId),
                price: Number(formData.price),
                categoryId: Number(formData.categoryId),
                image: imageUrl
            };

            const response = await httpClient.put('/product', productPayload);

            if (response === undefined || response === '' || response?.success) {
                onSuccess?.();
                onClose();
            } else {
                showAlert(response?.error?.message || '상품 수정에 실패했습니다.', '오류');
            }

        } catch (error) {
            console.error("Failed to update product", error);
            showAlert('상품 수정 중 오류가 발생했습니다.', '오류');
        } finally {
            setLoading(false);
        }
    };

    // Drag and Drop
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);
    const hasFileRef = useRef(false);

    useEffect(() => {
        hasFileRef.current = !!(selectedFile || previewUrl);
    }, [selectedFile, previewUrl]);

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

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
                        <DialogTitle className="text-3xl font-bold text-stone-900">상품 정보 수정</DialogTitle>
                        <DialogDescription className="text-stone-500">
                            관리자 권한으로 기존 구독 상품 정보를 수정합니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative">
                        {isDragging && !selectedFile && !previewUrl && (
                            <div className="absolute inset-0 z-50 bg-indigo-500/10 backdrop-blur-sm border-4 border-indigo-500 rounded-xl flex items-center justify-center m-4 pointer-events-none">
                                <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-bounce">
                                    <Upload className="w-16 h-16 text-indigo-600 mb-4" />
                                    <h3 className="text-2xl font-bold text-indigo-900">여기에 파일을 놓으세요</h3>
                                    <p className="text-indigo-600">이미지가 자동으로 업로드됩니다.</p>
                                </div>
                            </div>
                        )}

                        <form id="update-product-form" onSubmit={handleSubmit} className="space-y-8">
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

                            {/* 상태 */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">판매 상태</label>
                                <div className="relative">
                                    <select
                                        name="productStatus"
                                        value={formData.productStatus}
                                        onChange={handleChange}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none font-medium cursor-pointer"
                                    >
                                        <option value="ACTIVE">판매중 (ACTIVE)</option>
                                        <option value="INACTIVE">판매중지 (INACTIVE)</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
                                                id="update-modal-image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                onClick={handleInputClick}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="update-modal-image-upload"
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
                                                    {selectedFile ? (
                                                        <>
                                                            <p className="font-bold truncate text-lg mb-1">{selectedFile.name}</p>
                                                            <p className="text-stone-300 text-sm font-medium bg-white/20 inline-block px-2 py-1 rounded-lg backdrop-blur-sm">
                                                                {formatBytes(selectedFile.size)}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="font-bold truncate text-lg mb-1">현재 등록된 이미지</p>
                                                    )}
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
                                form="update-product-form"
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
                                    '수정 완료'
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={alertInfo.isOpen} onOpenChange={(open) => !open && setAlertInfo(prev => ({ ...prev, isOpen: false }))}>
                <DialogContent className="sm:max-w-md bg-white rounded-2xl z-[60]">
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

export default UpdateProductModal;
