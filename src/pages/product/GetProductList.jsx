import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Coffee } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';

const GetProductList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Data States
  const [allProducts, setAllProducts] = useState([]); // Original Data
  const [filteredProducts, setFilteredProducts] = useState([]); // Display Data
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 1. Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Parallel Fetch: Products & Categories
        const [productRes, categoryRes] = await Promise.all([
          httpClient.get('/product'),
          httpClient.get('/product/categorie')
        ]);

        if (productRes.success) {
          setAllProducts(productRes.data || []);
          setFilteredProducts(productRes.data || []);
        }

        if (categoryRes.success) {
          setCategories(categoryRes.data || []);
        }

      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Filtering Logic
  useEffect(() => {
    let result = allProducts;

    // Filter by Category
    if (selectedCategory !== '전체') {
      result = result.filter(p => p.categoryName === selectedCategory);
    }

    // Filter by Keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(p =>
        p.productName?.toLowerCase().includes(keyword)
      );
    }

    setFilteredProducts(result);
  }, [searchKeyword, selectedCategory, allProducts]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            구독 상품
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF4E5] text-[#B95000] animate-bounce shadow-sm ml-2">
              <Coffee className="w-3 h-3" />
              개인 구독 관리
            </span>
          </h1>
          <p className="text-gray-500 mt-2">다양한 구독 서비스를 확인하고 관리해보세요.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => navigate('/product/add')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <span>+</span> 상품 등록
          </button>
        )}
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar (Expanded) */}
        <div className="relative w-full flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
            placeholder="서비스명 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {/* Category Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto px-2 md:px-0 scrollbar-hide flex-shrink-0">
          <button
            onClick={() => setSelectedCategory('전체')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === '전체'
              ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200'
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
              }`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => setSelectedCategory(cat.categoryName)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat.categoryName
                ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">
            {searchKeyword ? `'${searchKeyword}' 검색 결과가 없습니다.` : '등록된 구독 상품이 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(product => (
            <div
              key={product.productId}
              className="group relative flex flex-col h-full bg-white rounded-[2rem] border border-stone-200 p-6 overflow-hidden transition-all duration-500 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:-translate-y-2"
            >
              {/* 콘텐츠 레이어 */}
              <div className="relative z-10 flex flex-col gap-4 h-full">
                {/* 상단: 아이콘 + 서비스 정보 */}
                <div className="flex items-start gap-3">
                  <div className="relative w-[60px] h-[60px] flex-shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-full h-full rounded-xl object-cover border border-stone-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-stone-100 flex items-center justify-center border border-stone-200">
                        <span className="text-stone-400 text-xs">No Img</span>
                      </div>
                    )}

                    {/* INACTIVE 오버레이 */}
                    {product.productStatus === 'INACTIVE' && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                        <span className="text-white text-xs font-bold">중지</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-stone-900 mb-0.5 truncate">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {product.categoryName || '구독'}
                    </p>
                  </div>
                </div>

                {/* 중단: 가격 정보 박스 */}
                <div className="rounded-2xl p-5 flex-1 border transition-colors backdrop-blur-sm bg-stone-50/80 border-stone-100 group-hover:bg-white group-hover:border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 text-sm font-medium">월 공식 구독료</span>
                    <span className="text-xl font-bold text-stone-900">
                      ₩{product.price?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 하단: 액션 버튼 */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.productId}`);
                    }}
                    className="border border-stone-200 text-stone-700 rounded-lg py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
                  >
                    상세보기
                  </button>
                  {user?.role === 'ADMIN' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.productId}/edit`);
                      }}
                      className="bg-stone-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors"
                    >
                      상품관리
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/subscription/add/${product.productId}`);
                      }}
                      className="bg-stone-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-600 transition-colors"
                    >
                      구독신청
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetProductList;
