import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';

const GetProductList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get('/product');
        if (response.success) {
          console.log('Products data:', response.data);
          setProducts(response.data || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">구독 상품 목록</h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => navigate('/product/add')}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            상품 등록
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          등록된 구독 상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.productId}
              onClick={() => navigate(`/product/${product.productId}`)}
              className="bg-white border border-gray-200 rounded-[2rem] p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 relative">
                  {product.image ? (
                    <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                  )}
                  {product.productStatus === 'INACTIVE' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">판매중지</span>
                    </div>
                  )}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  ₩{product.price?.toLocaleString()}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-4 mb-8">
                {product.productName}
              </h3>

              <div className="flex justify-between items-center">
                {product.categoryName ? (
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded uppercase">
                    {product.categoryName}
                  </span>
                ) : (
                  <span></span>
                )}

                <span className="text-indigo-600 font-semibold text-sm flex items-center gap-1">
                  상세보기 &gt;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetProductList;
