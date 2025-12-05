import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
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
            구독 상품 <span className="text-2xl"></span>
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
              onClick={() => navigate(`/product/${product.productId}`)}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-200 ease-out hover:-translate-y-2 border border-gray-100 hover:border-indigo-500 cursor-pointer p-4 flex flex-col h-full relative overflow-hidden"
            >
              {/* Main Content: Horizontal Layout */}
              <div className="flex items-start gap-4 mb-3">
                {/* Icon Box (90x90) */}
                <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0 relative group-hover:border-indigo-500 transition-colors duration-200 p-0.5">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="text-xs">No Img</span>
                      </div>
                    )}

                    {/* Status Overlay */}
                    {product.productStatus === 'INACTIVE' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">중지</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Area (Right) */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="mb-1">
                    {product.categoryName && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold tracking-wide">
                        {product.categoryName}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">
                    {product.productName}
                  </h3>

                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[#FF6B00]">
                      {product.price?.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">원/월</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Hover Action */}
              <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center group-hover:border-indigo-50 transition-colors">
                <span className="text-xs font-medium text-gray-400 group-hover:text-indigo-600 transition-colors">
                  자세히 보기
                </span>
                <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
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
