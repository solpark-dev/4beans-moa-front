import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Coffee, X, Calendar, CalendarPlus, Sparkles, LayoutGrid, Bell, Users, Lightbulb, AlertTriangle } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';
import AddSubscriptionModal from '../../components/subscription/AddSubscriptionModal';
import AddProductModal from '../../components/product/AddProductModal';
import UpdateProductModal from '../../components/product/UpdateProductModal';
import { useThemeStore } from '@/store/themeStore';
import { ThemeSwitcher, ChristmasBackground } from '@/config/themeConfig';

// Theme-based styles
const getThemeStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return {
        bg: 'bg-transparent',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-[2rem] shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
        cardHover: 'hover:border-[#c41e3a]/30 hover:shadow-[0_25px_50px_-12px_rgba(196,30,58,0.2)]',
        searchBg: 'bg-white/90 backdrop-blur-sm border border-gray-200',
        inputBg: 'bg-gray-50/80',
        inputFocus: 'focus:ring-[#c41e3a]/20 focus:bg-white',
        filterActive: 'bg-[#c41e3a]/10 text-[#c41e3a] ring-1 ring-[#c41e3a]/30',
        filterInactive: 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200',
        buttonPrimary: 'bg-[#c41e3a] hover:bg-[#a51830] text-white',
        buttonSecondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
        modalBg: 'bg-white/95 backdrop-blur-sm',
        highlight: 'text-[#c41e3a]',
        priceBox: 'bg-gray-50/80 border-gray-100',
      };
    case 'dark':
      return {
        bg: 'bg-[#0B1120]',
        text: 'text-white',
        subtext: 'text-gray-400',
        cardBg: 'bg-[#1E293B] border border-gray-700 rounded-[2rem] shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
        cardHover: 'hover:border-[#635bff]/30 hover:shadow-[0_25px_50px_-12px_rgba(99,91,255,0.2)]',
        searchBg: 'bg-[#1E293B] border border-gray-700',
        inputBg: 'bg-[#0F172A]',
        inputFocus: 'focus:ring-[#635bff]/20 focus:bg-[#0F172A]',
        filterActive: 'bg-[#635bff]/10 text-[#635bff] ring-1 ring-[#635bff]/30',
        filterInactive: 'bg-[#0F172A] text-gray-400 hover:bg-gray-800 border border-gray-700',
        buttonPrimary: 'bg-[#635bff] hover:bg-[#5851e8] text-white',
        buttonSecondary: 'bg-[#1E293B] border border-gray-700 text-white hover:bg-gray-700',
        modalBg: 'bg-[#1E293B]',
        highlight: 'text-[#635bff]',
        priceBox: 'bg-[#0F172A]/80 border-gray-700',
      };
    case 'portrait':
      return {
        bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        cardBg: 'bg-white/80 backdrop-blur-sm border border-pink-200 rounded-[2rem] shadow-[4px_4px_12px_rgba(255,181,197,0.2)]',
        cardHover: 'hover:border-pink-300 hover:shadow-[0_25px_50px_-12px_rgba(255,181,197,0.3)]',
        searchBg: 'bg-white/80 backdrop-blur-sm border border-pink-200',
        inputBg: 'bg-pink-50/50',
        inputFocus: 'focus:ring-pink-300/20 focus:bg-white',
        filterActive: 'bg-pink-100 text-pink-600 ring-1 ring-pink-300',
        filterInactive: 'bg-white text-gray-500 hover:bg-pink-50 border border-pink-200',
        buttonPrimary: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90 text-white',
        buttonSecondary: 'bg-white border border-pink-200 text-gray-700 hover:bg-pink-50',
        modalBg: 'bg-white/90 backdrop-blur-sm',
        highlight: 'text-pink-500',
        priceBox: 'bg-pink-50/80 border-pink-100',
      };
    case 'pop':
      return {
        bg: 'bg-slate-50',
        text: 'text-black',
        subtext: 'text-gray-600',
        cardBg: 'bg-white border-2 border-black rounded-[2rem] shadow-[6px_6px_0px_rgba(0,0,0,1)]',
        cardHover: 'hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1',
        searchBg: 'bg-white border-2 border-black',
        inputBg: 'bg-gray-50',
        inputFocus: 'focus:ring-pink-500/20 focus:bg-white',
        filterActive: 'bg-pink-500 text-white border-2 border-black',
        filterInactive: 'bg-white text-black hover:bg-gray-50 border-2 border-black',
        buttonPrimary: 'bg-pink-500 hover:bg-pink-600 text-white border-2 border-black',
        buttonSecondary: 'bg-white border-2 border-black text-black hover:bg-gray-50',
        modalBg: 'bg-white',
        highlight: 'text-pink-500',
        priceBox: 'bg-gray-50 border-2 border-black',
      };
    case 'classic':
      return {
        bg: 'bg-white',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        cardBg: 'bg-white border border-gray-200 rounded-[2rem] shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
        cardHover: 'hover:border-[#635bff]/30 hover:shadow-[0_25px_50px_-12px_rgba(99,91,255,0.15)]',
        searchBg: 'bg-white border border-gray-200',
        inputBg: 'bg-gray-50',
        inputFocus: 'focus:ring-[#635bff]/20 focus:bg-white',
        filterActive: 'bg-[#635bff]/10 text-[#635bff] ring-1 ring-[#635bff]/30',
        filterInactive: 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200',
        buttonPrimary: 'bg-[#635bff] hover:bg-[#5851e8] text-white',
        buttonSecondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
        modalBg: 'bg-white',
        highlight: 'text-[#635bff]',
        priceBox: 'bg-gray-50 border-gray-100',
      };
    default:
      return {
        bg: 'bg-white',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        cardBg: 'bg-white border border-stone-200 rounded-[2rem]',
        cardHover: 'hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10',
        searchBg: 'bg-white border border-gray-200',
        inputBg: 'bg-gray-50',
        inputFocus: 'focus:ring-indigo-500/20 focus:bg-white',
        filterActive: 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200',
        filterInactive: 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200',
        buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        buttonSecondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
        modalBg: 'bg-white',
        highlight: 'text-indigo-600',
        priceBox: 'bg-stone-50/80 border-stone-100',
      };
  }
};

// ProductDetailModal 컴포넌트
const ProductDetailModal = ({ product, onClose, user, navigate, onSubscribe, onEdit, themeStyles, theme }) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  if (!product) return null;

  const handleSubscribe = () => {
    onClose();
    onSubscribe({ productId: product.productId, startDate, endDate });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`${themeStyles.modalBg} w-full max-w-xl rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in-95 duration-200 relative flex flex-col max-h-[90vh] ${theme === 'pop' ? 'border-2 border-black' : ''}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full z-10 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-stone-100 hover:bg-stone-200'} transition-colors`}
        >
          <X className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-stone-500'}`} />
        </button>

        {/* Header Section */}
        <div className={`py-9 px-6 flex flex-row items-center gap-6 relative overflow-hidden flex-shrink-0 ${theme === 'christmas' ? 'bg-[#c41e3a]/10' :
            theme === 'dark' ? 'bg-[#0F172A]' :
              theme === 'portrait' ? 'bg-gradient-to-r from-pink-100 to-purple-100' :
                theme === 'pop' ? 'bg-pink-100' :
                  theme === 'classic' ? 'bg-[#635bff]/10' :
                    'bg-purple-50'
          }`}>
          <div className={`absolute top-0 left-0 w-32 h-32 rounded-full filter blur-3xl opacity-50 -ml-10 -mt-10 ${theme === 'christmas' ? 'bg-[#c41e3a]/30' :
              theme === 'dark' ? 'bg-[#635bff]/30' :
                theme === 'pop' ? 'bg-pink-300' :
                  'bg-purple-200'
            }`}></div>
          <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-50 -mr-10 -mb-10 ${theme === 'christmas' ? 'bg-green-300/30' :
              theme === 'dark' ? 'bg-purple-500/30' :
                theme === 'pop' ? 'bg-yellow-300' :
                  'bg-pink-200'
            }`}></div>

          <div className="relative z-10 flex-shrink-0">
            {product.image ? (
              <img
                src={product.image}
                alt={product.productName}
                className={`w-20 h-20 rounded-3xl shadow-lg object-cover ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
              />
            ) : (
              <div className={`w-20 h-20 rounded-3xl shadow-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-white text-gray-400'}`}>
                No Img
              </div>
            )}
          </div>

          <div className="relative z-10">
            <h2 className={`text-2xl font-extrabold leading-tight ${themeStyles.text}`}>
              {product.productName}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${theme === 'christmas' ? 'bg-[#c41e3a]/20 text-[#c41e3a]' :
                  theme === 'dark' ? 'bg-[#635bff]/20 text-[#635bff]' :
                    theme === 'portrait' ? 'bg-pink-200 text-pink-700' :
                      theme === 'pop' ? 'bg-pink-200 text-pink-700' :
                        theme === 'classic' ? 'bg-[#635bff]/20 text-[#635bff]' :
                          'bg-purple-100 text-purple-700'
                }`}>
                {product.categoryName || '구독'}
              </span>
              {product.productStatus === 'INACTIVE' && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                  판매중지
                </span>
              )}
              <span className={`font-extrabold text-lg ${themeStyles.text}`}>
                ₩{product.price?.toLocaleString()}
                <span className={`text-xs font-normal ml-0.5 ${themeStyles.subtext}`}>/월</span>
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
                <p className={`leading-relaxed ${themeStyles.subtext}`}>{product.description}</p>
              </div>
            )}

            {/* MoA 혜택 */}
            <div>
              <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${themeStyles.text}`}>
                <Sparkles className={`w-4 h-4 ${themeStyles.highlight}`} /> MoA 구독 관리 혜택
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: LayoutGrid,
                    color: theme === 'dark' ? 'bg-[#635bff]/20 text-[#635bff]' : 'bg-indigo-50 text-indigo-600',
                    title: "1. 모든 구독을 한눈에 정리하세요",
                    desc: "흩어진 구독을 한 곳에서 확인하고 더 쉽고 편하게 관리할 수 있어요."
                  },
                  {
                    icon: Bell,
                    color: theme === 'dark' ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600',
                    title: "2. 매달 빠져나가는 구독비, 미리 대비하세요",
                    desc: "결제일을 자동으로 알려주어 불필요한 지출을 막아줘요."
                  },
                  {
                    icon: Users,
                    color: theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600',
                    title: "3. 가족의 구독도 함께 관리하는 패밀리 센터",
                    desc: "가족이 어떤 서비스에 가입했는지 쉽고 투명하게 관리하세요."
                  },
                  {
                    icon: Lightbulb,
                    color: theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600',
                    title: "4. 꼭 필요한 구독만 남기는 똑똑한 소비 도우미",
                    desc: "활용도가 낮은 구독을 알려줘서 해지·유지 판단을 도와줘요."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold leading-tight ${themeStyles.text}`}>{item.title}</h4>
                      <p className={`text-xs leading-relaxed mt-1 ${themeStyles.subtext}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 구독 시작일 & 종료일 선택 (일반 사용자만) */}
            {user?.role !== 'ADMIN' && (
              <div className={`pt-4 border-t space-y-4 ${theme === 'dark' ? 'border-gray-700' : 'border-stone-100'}`}>
                {/* 시작일 */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${themeStyles.text}`}>
                    구독 시작일 (결제일) 지정
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${themeStyles.subtext}`} />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 border-none rounded-xl font-medium ${theme === 'dark'
                          ? 'bg-[#0F172A] text-white focus:ring-2 focus:ring-[#635bff]'
                          : 'bg-stone-50 text-stone-900 focus:ring-2 focus:ring-indigo-500'
                        }`}
                    />
                  </div>
                </div>

                {/* 종료일 */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${themeStyles.text}`}>
                    구독 종료일 (선택사항)
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${themeStyles.subtext}`} />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      placeholder="종료일 미지정 시 계속 유지"
                      className={`w-full pl-11 pr-4 py-3 border-none rounded-xl font-medium ${theme === 'dark'
                          ? 'bg-[#0F172A] text-white focus:ring-2 focus:ring-[#635bff]'
                          : 'bg-stone-50 text-stone-900 focus:ring-2 focus:ring-indigo-500'
                        }`}
                    />
                  </div>
                  <p className={`text-xs mt-1 ml-1 ${themeStyles.subtext}`}>미지정 시 자동 갱신으로 계속 유지됩니다</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer Actions */}
        <div className={`p-4 border-t flex gap-3 flex-shrink-0 ${theme === 'dark' ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-stone-100'}`}>
          {user?.role === 'ADMIN' ? (
            <>
              <button
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
                className={`flex-1 py-3.5 rounded-2xl font-bold transition-colors ${themeStyles.buttonSecondary}`}
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
                className={`flex-1 py-3.5 rounded-2xl font-bold transition-colors ${themeStyles.buttonSecondary}`}
              >
                취소
              </button>
              <button
                onClick={handleSubscribe}
                className={`flex-[2] py-3.5 rounded-2xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2 ${themeStyles.buttonPrimary}`}
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
  const { theme, setTheme } = useThemeStore();
  const themeStyles = getThemeStyles(theme);

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
  const [subscribingData, setSubscribingData] = useState(null);
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
      <div className={`min-h-screen ${themeStyles.bg} flex justify-center items-center`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-[#635bff]' : 'border-indigo-600'}`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.bg}`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-2 ${themeStyles.text}`}>
              {theme === 'christmas' ? '🎄 구독 상품' : '구독 상품'}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold animate-bounce shadow-sm ml-2 ${theme === 'christmas' ? 'bg-[#c41e3a]/20 text-[#c41e3a]' :
                  theme === 'dark' ? 'bg-[#635bff]/20 text-[#635bff]' :
                    'bg-[#FFF4E5] text-[#B95000]'
                }`}>
                개인 구독 관리
              </span>
            </h1>
            <p className={`mt-2 ${themeStyles.subtext}`}>다양한 구독 서비스를 확인하고 관리해보세요.</p>
          </div>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 ${themeStyles.buttonPrimary}`}
            >
              <span>+</span> 상품 등록
            </button>
          )}
        </div>

        {/* Search & Filter Section */}
        <div className={`p-2 rounded-2xl shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between ${themeStyles.searchBg}`}>
          <div className="relative w-full flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${themeStyles.subtext}`} />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-3 py-2.5 border-none rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${themeStyles.inputBg} ${themeStyles.inputFocus} ${themeStyles.text}`}
              placeholder="서비스명 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto px-2 md:px-0 scrollbar-hide flex-shrink-0">
            <button
              onClick={() => setSelectedCategory('전체')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === '전체' ? themeStyles.filterActive : themeStyles.filterInactive
                }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat.categoryId}
                onClick={() => setSelectedCategory(cat.categoryName)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat.categoryName ? themeStyles.filterActive : themeStyles.filterInactive
                  }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl border border-dashed ${theme === 'dark' ? 'bg-[#1E293B] border-gray-700' : 'bg-gray-50 border-gray-300'
            }`}>
            <p className={`text-lg ${themeStyles.subtext}`}>
              {searchKeyword ? `'${searchKeyword}' 검색 결과가 없습니다.` : '등록된 구독 상품이 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <div
                key={product.productId}
                className={`group relative flex flex-col h-full p-6 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 ${themeStyles.cardBg} ${themeStyles.cardHover}`}
              >
                <div className="relative z-10 flex flex-col gap-4 h-full">
                  <div className="flex items-start gap-3">
                    <div className="relative w-[60px] h-[60px] flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.productName}
                          className={`w-full h-full rounded-xl object-cover shadow-sm ${theme === 'dark' ? 'border border-gray-700' : 'border border-stone-200'}`}
                        />
                      ) : (
                        <div className={`w-full h-full rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-stone-100 border border-stone-200'}`}>
                          <span className={`text-xs ${themeStyles.subtext}`}>No Img</span>
                        </div>
                      )}

                      {product.productStatus === 'INACTIVE' && (
                        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                          <span className="text-white text-xs font-bold">중지</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold mb-1 truncate ${themeStyles.text}`}>
                        {product.productName}
                      </h3>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-stone-100 text-stone-600'
                        }`}>
                        {product.categoryName || '구독'}
                      </span>
                    </div>
                  </div>

                  <div className={`rounded-2xl p-5 flex-1 border transition-colors backdrop-blur-sm ${themeStyles.priceBox} group-hover:bg-white group-hover:border-stone-200`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${themeStyles.subtext}`}>월 공식 구독료</span>
                      <span className={`text-xl font-bold ${themeStyles.text}`}>
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
                      className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${themeStyles.buttonSecondary}`}
                    >
                      상세보기
                    </button>
                    {user?.role === 'ADMIN' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct(product);
                        }}
                        className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${themeStyles.buttonPrimary}`}
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
                        className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${themeStyles.buttonPrimary}`}
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
            themeStyles={themeStyles}
            theme={theme}
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
    </div>
  );
};

export default GetProductList;
