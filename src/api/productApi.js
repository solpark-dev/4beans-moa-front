import httpClient from './httpClient';

/**
 * 카테고리 목록 조회
 */
export const getCategories = () => {
    return httpClient.get('/product/categorie');
};

/**
 * 상품 상세 조회
 * @param {number|string} id 
 */
export const getProduct = (id) => {
    return httpClient.get(`/product/${id}`);
};

/**
 * 상품 등록
 * @param {Object} data 
 */
export const createProduct = (data) => {
    return httpClient.post('/product', data);
};

/**
 * 상품 수정
 * @param {Object} data 
 */
export const updateProduct = (data) => {
    return httpClient.put('/product', data);
};

/**
 * 이미지 업로드
 * @param {FormData} formData 
 */
export const uploadProductImage = (formData) => {
    return httpClient.post('/product/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
