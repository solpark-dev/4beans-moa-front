import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Coffee, X, Calendar, CalendarPlus, Sparkles, LayoutGrid, Bell, Users, Lightbulb, AlertTriangle } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';
import AddSubscriptionModal from '../../components/subscription/AddSubscriptionModal';
import AddProductModal from '../../components/product/AddProductModal';
import UpdateProductModal from '../../components/product/UpdateProductModal';

// ProductDetailModal 컴포넌트
const ProductDetailModal = ({ product, onClose, user, navigate, onSubscribe, onEdit }) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(''); // 종료일 (선택사항)

  if (!product) return null;

  const handleSubscribe = () => {
    onClose(); // 상세보기 모달 닫기
    onSubscribe({ productId: product.productId, startDate, endDate }); // 구독 모달 열기
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in-95 duration-200 relative flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-stone-500" />
        </button>

        {/* Header Section */}
        <div className="bg-purple-50 py-9 px-6 flex flex-row items-center gap-6 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-200 rounded-full filter blur-3xl opacity-50 -ml-10 -mt-10"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-200 rounded-full filter blur-3xl opacity-50 -mr-10 -mb-10"></div>

          <div className="relative z-10 flex-shrink-0">
            {product.image ? (
              <img
                src={product.image}
                alt={product.productName}
                className="w-20 h-20 rounded-3xl shadow-lg object-cover bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-white shadow-lg flex items-center justify-center text-gray-400">
                No Img
              </div>
            )}
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-stone-900 leading-tight">
              {product.productName}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
                {product.categoryName || '구독'}
              </span>
              {product.productStatus === 'INACTIVE' && (
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                  판매중지
                </span>
              )}
              <span className="text-stone-900 font-extrabold text-lg">
                ₩{product.price?.toLocaleString()}
                <span className="text-xs font-normal text-stone-500 ml-0.5">/월</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-8">
            {/* Description */}
            {product.description && (
              <div>
                <p className="text-stone-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* MoA 혜택 */}
            <div>
              <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-indigo-500" /> MoA 구독 관리 혜택
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: LayoutGrid,
                    color: 'bg-indigo-50 text-indigo-600',
                    title: "1. 모든 구독을 한눈에 정리하세요",
                    desc: "흩어진 구독을 한 곳에서 확인하고 더 쉽고 편하게 관리할 수 있어요."
                  },
                  {
                    icon: Bell,
                    color: 'bg-rose-50 text-rose-600',
                    title: "2. 매달 빠져나가는 구독비, 미리 대비하세요",
                    desc: "결제일을 자동으로 알려주어 불필요한 지출을 막아줘요."
                  },
                  {
                    icon: Users,
                    color: 'bg-orange-50 text-orange-600',
                    title: "3. 가족의 구독도 함께 관리하는 패밀리 센터",
                    desc: "가족이 어떤 서비스에 가입했는지 쉽고 투명하게 관리하세요."
                  },
                  {
                    icon: Lightbulb,
                    color: 'bg-yellow-50 text-yellow-600',
                    title: "4. 꼭 필요한 구독만 남기는 똑똑한 소비 도우미",
                    desc: "활용도가 낮은 구독을 알려줘서 해지·유지 판단을 도와줘요."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-800 leading-tight">{item.title}</h4>
                      <p className="text-xs text-stone-500 leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 구독 시작일 & 종료일 선택 (일반 사용자만) */}
            {user?.role !== 'ADMIN' && (
              <div className="pt-4 border-t border-stone-100 space-y-4">
                {/* 시작일 */}
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">
                    구독 시작일 (결제일) 지정
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-stone-900"
                    />
                  </div>
                </div>

                {/* 종료일 */}
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">
                    구독 종료일 (선택사항)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      placeholder="종료일 미지정 시 계속 유지"
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-stone-900"
                    />
                  </div>
                  <p className="text-xs text-stone-400 mt-1 ml-1">미지정 시 자동 갱신으로 계속 유지됩니다</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer Actions */}
        <div className="p-4 bg-white border-t border-stone-100 flex gap-3 flex-shrink-0">
          {user?.role === 'ADMIN' ? (
            <>
              <button
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
                className="flex-1 py-3.5 bg-white border border-stone-300 text-stone-700 rounded-2xl font-bold hover:bg-stone-50 transition-colors"
              >
                수정하기
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.productId}/delete`);
                }}
                className="flex-1 py-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
              >
                삭제하기
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3.5 bg-stone-100 text-stone-600 rounded-2xl font-bold hover:bg-stone-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubscribe}
                className="flex-[2] py-3.5 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/20 flex items-center justify-center gap-2"
              >
                <CalendarPlus className="w-5 h-5" />
                구독 일정에 등록
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const GetProductList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Data States
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // Modal State
  const [viewingProduct, setViewingProduct] = useState(null);
  const [subscribingData, setSubscribingData] = useState(null); // { productId, startDate, endDate }
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productRes, categoryRes] = await Promise.all([
        httpClient.get('/product'),
        httpClient.get('/product/categorie')
      ]);

      if (productRes.success) {
        setAllProducts(productRes.data || []);
        // 필터링 상태가 유지되도록 여기서 setFilteredProducts를 직접하지 않고
        // dependency useEffect가 처리하게 두거나, 여기서도 반영해야 함.
        // 하지만 allProducts가 바뀌면 아래 useEffect([searchKeyword, selectedCategory, allProducts])가 돌아서 업데이트 됨.
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

  // Fetch Initial Data
  useEffect(() => {
    fetchData();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = allProducts;

    if (selectedCategory !== '전체') {
      result = result.filter(p => p.categoryName === selectedCategory);
    }

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
              {/* <Coffee className="w-3 h-3" /> */}
              개인 구독 관리
            </span>
          </h1>
          <p className="text-gray-500 mt-2">다양한 구독 서비스를 확인하고 관리해보세요.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <span>+</span> 상품 등록
          </button>
        )}
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
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
              <div className="relative z-10 flex flex-col gap-4 h-full">
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

                    {product.productStatus === 'INACTIVE' && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                        <span className="text-white text-xs font-bold">중지</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-stone-900 mb-1 truncate">
                      {product.productName}
                    </h3>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-xs font-medium">
                      {product.categoryName || '구독'}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl p-5 flex-1 border transition-colors backdrop-blur-sm bg-stone-50/80 border-stone-100 group-hover:bg-white group-hover:border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 text-sm font-medium">월 공식 구독료</span>
                    <span className="text-xl font-bold text-stone-900">
                      ₩{product.price?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingProduct(product);
                    }}
                    className="border border-stone-200 text-stone-700 rounded-lg py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
                  >
                    상세보기
                  </button>
                  {user?.role === 'ADMIN' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProduct(product);
                      }}
                      className="bg-stone-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors"
                    >
                      상품관리
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const today = new Date().toISOString().split('T')[0];
                        setSubscribingData({ productId: product.productId, startDate: today, endDate: '' });
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

      {/* Product Detail Modal */}
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          user={user}
          navigate={navigate}
          onSubscribe={(data) => setSubscribingData(data)}
          onEdit={(product) => setEditingProduct(product)}
        />
      )}

      {/* Add Subscription Modal */}
      {subscribingData && (
        <AddSubscriptionModal
          productId={subscribingData.productId}
          startDate={subscribingData.startDate}
          endDate={subscribingData.endDate}
          onClose={() => setSubscribingData(null)}
          user={user}
          onSuccess={() => {
            // 구독 목록으로 이동할 수도 있음
            // navigate('/subscriptions');
          }}
        />
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSuccess={() => {
          fetchData(); // 목록 갱신
        }}
      />

      {/* Update Product Modal */}
      <UpdateProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        productId={editingProduct?.productId}
        initialData={editingProduct}
        onSuccess={() => {
          fetchData(); // 목록 갱신
        }}
      />
    </div>
  );
};

export default GetProductList;
