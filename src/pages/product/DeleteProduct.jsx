import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import httpClient from '../../api/httpClient';

const DeleteProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const deleteProduct = async () => {
            if (window.confirm('정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                try {
                    const response = await httpClient.delete(`/product/${id}`);
                    if (response.success) {
                        alert('상품이 삭제되었습니다.');
                        navigate('/product');
                    } else {
                        alert(response.error?.message || '상품 삭제에 실패했습니다.');
                        navigate(`/product/${id}`);
                    }
                } catch (error) {
                    console.error("Failed to delete product", error);
                    alert('상품 삭제에 실패했습니다. 이미 구독 중인 사용자가 있을 수 있습니다.');
                    navigate(`/products/${id}`);
                }
            } else {
                navigate(`/products/${id}`);
            }
        };

        deleteProduct();
    }, [id, navigate]);

    return (
        <div className="flex justify-center items-center h-64">
            <p>처리 중...</p>
        </div>
    );
};

export default DeleteProduct;
