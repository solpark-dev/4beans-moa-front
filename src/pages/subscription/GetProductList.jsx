import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronRight } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher, ChristmasBackground } from "@/config/themeConfig";

const MOCK_PRODUCTS = [
  {
    productId: "prod-1",
    productName: "Netflix",
    categoryName: "Video",
    categoryId: "VIDEO",
    image: "https://picsum.photos/300/200",
  },
  {
    productId: "prod-2",
    productName: "Spotify",
    categoryName: "Music",
    categoryId: "MUSIC",
    image: "https://picsum.photos/300/201",
  },
];

const MOCK_CATEGORIES = [
  { categoryId: "VIDEO", categoryName: "Video" },
  { categoryId: "MUSIC", categoryName: "Music" },
];

export default function GetProductList() {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const [products] = useState(MOCK_PRODUCTS);
  const [categories] = useState(MOCK_CATEGORIES);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Theme-based colors
  const getThemeColors = () => {
    switch (theme) {
      case 'christmas':
        return {
          bg: 'bg-transparent',
          text: 'text-gray-900',
          subtext: 'text-gray-600',
          searchBg: 'bg-white/80 backdrop-blur-sm',
          buttonActive: 'bg-[#c41e3a] text-white border-[#c41e3a]',
          buttonInactive: 'bg-white text-gray-600 border-gray-300',
          cardBg: 'bg-white/90 backdrop-blur-sm',
          cardHover: 'hover:shadow-lg hover:shadow-[#c41e3a]/20 hover:border-[#c41e3a]/30',
          categoryBg: 'bg-[#c41e3a]/10',
          detailText: 'text-[#c41e3a]',
        };
      case 'dark':
        return {
          bg: 'bg-[#0B1120]',
          text: 'text-white',
          subtext: 'text-gray-400',
          searchBg: 'bg-[#1E293B]',
          buttonActive: 'bg-[#635bff] text-white border-[#635bff]',
          buttonInactive: 'bg-[#1E293B] text-gray-400 border-gray-600',
          cardBg: 'bg-[#1E293B]',
          cardHover: 'hover:shadow-lg hover:shadow-[#635bff]/20',
          categoryBg: 'bg-[#0F172A]',
          detailText: 'text-[#635bff]',
        };
      case 'portrait':
        return {
          bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
          text: 'text-gray-900',
          subtext: 'text-gray-500',
          searchBg: 'bg-white/60',
          buttonActive: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] text-white border-transparent',
          buttonInactive: 'bg-white text-gray-600 border-gray-300',
          cardBg: 'bg-white/80 backdrop-blur-sm',
          cardHover: 'hover:shadow-lg hover:shadow-pink-200/30',
          categoryBg: 'bg-gray-100',
          detailText: 'text-pink-500',
        };
      case 'classic':
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          subtext: 'text-gray-500',
          searchBg: 'bg-gray-50',
          buttonActive: 'bg-[#635bff] text-white border-[#635bff]',
          buttonInactive: 'bg-white text-gray-600 border-gray-300',
          cardBg: 'bg-white',
          cardHover: 'hover:shadow-lg',
          categoryBg: 'bg-gray-100',
          detailText: 'text-[#635bff]',
        };
      case 'pop':
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-black',
          subtext: 'text-gray-600',
          searchBg: 'bg-gray-50',
          buttonActive: 'bg-pink-500 text-white border-pink-500',
          buttonInactive: 'bg-white text-gray-600 border-gray-300',
          cardBg: 'bg-white',
          cardHover: 'hover:shadow-lg',
          categoryBg: 'bg-gray-100',
          detailText: 'text-blue-600',
        };
    }
  };

  const themeColors = getThemeColors();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "ALL" || p.categoryId === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className={`min-h-screen ${themeColors.bg}`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className={`text-3xl font-bold ${themeColors.text} mb-2`}>구독 상품</h1>
        <p className={`${themeColors.subtext} mb-8`}>다양한 구독 서비스를 확인하세요.</p>

        <div className={`${themeColors.cardBg} p-4 rounded-xl ${theme === 'dark' ? 'border-gray-700' : 'border'} mb-8 flex flex-col gap-4`}>
          <div className="relative">
            <Search className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="서비스명 검색..."
              className={`w-full pl-12 pr-4 py-3 ${themeColors.searchBg} rounded-lg outline-none ${theme === 'dark' ? 'border-gray-700 text-white' : 'border text-gray-900'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2 rounded-lg whitespace-nowrap border ${
                selectedCategory === "ALL"
                  ? themeColors.buttonActive
                  : themeColors.buttonInactive
              }`}
            >
              <Filter className="w-4 h-4 inline-block mr-2" />
              전체
            </button>

            {categories.map((cat) => (
              <button
                key={cat.categoryId}
                onClick={() => setSelectedCategory(cat.categoryId)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap border ${
                  selectedCategory === cat.categoryId
                    ? themeColors.buttonActive
                    : themeColors.buttonInactive
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.productId}
              className={`${themeColors.cardBg} ${theme === 'dark' ? 'border-gray-700' : 'border'} rounded-2xl p-6 cursor-pointer ${themeColors.cardHover} transition`}
              onClick={() => navigate(`/subscriptions/${product.productId}`)}
            >
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />

              <h2 className={`text-xl font-bold ${themeColors.text} mb-2`}>
                {product.productName}
              </h2>

              <div className="flex justify-between items-center">
                <span className={`text-sm ${themeColors.categoryBg} ${themeColors.text} px-2 py-1 rounded`}>
                  {product.categoryName}
                </span>

                <span className={`${themeColors.detailText} font-semibold flex items-center gap-1`}>
                  상세보기
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className={`text-center py-20 ${themeColors.subtext}`}>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
