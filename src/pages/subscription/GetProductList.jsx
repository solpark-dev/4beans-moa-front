import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronRight } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher } from "@/config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";

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
    <div className={`min-h-screen ${themeClasses.bg.base}`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>구독 상품</h1>
        <p className={`${themeClasses.text.muted} mb-8`}>다양한 구독 서비스를 확인하세요.</p>

        <div className={`${themeClasses.card.base} p-4 rounded-xl mb-8 flex flex-col gap-4`}>
          <div className="relative">
            <Search className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-text-muted)]`} />
            <input
              type="text"
              placeholder="서비스명 검색..."
              className={`w-full pl-12 pr-4 py-3 rounded-lg outline-none border border-[var(--theme-border-light)] bg-[var(--theme-bg)] ${themeClasses.text.primary} focus:border-[var(--theme-primary)] placeholder-[var(--theme-text-muted)]`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2 rounded-lg whitespace-nowrap border transition-colors ${selectedCategory === "ALL"
                  ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white'
                  : `border-[var(--theme-border-light)] bg-[var(--theme-bg)] ${themeClasses.text.secondary} hover:bg-[var(--theme-bg)]/80`
                }`}
            >
              <Filter className="w-4 h-4 inline-block mr-2" />
              전체
            </button>

            {categories.map((cat) => (
              <button
                key={cat.categoryId}
                onClick={() => setSelectedCategory(cat.categoryId)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap border transition-colors ${selectedCategory === cat.categoryId
                    ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white'
                    : `border-[var(--theme-border-light)] bg-[var(--theme-bg)] ${themeClasses.text.secondary} hover:bg-[var(--theme-bg)]/80`
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
              className={`${themeClasses.card.base} rounded-2xl p-6 cursor-pointer hover:shadow-[var(--theme-shadow-hover)] transition`}
              onClick={() => navigate(`/subscriptions/${product.productId}`)}
            >
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />

              <h2 className={`text-xl font-bold ${themeClasses.text.primary} mb-2`}>
                {product.productName}
              </h2>

              <div className="flex justify-between items-center">
                <span className={`text-sm bg-[var(--theme-bg)] ${themeClasses.text.secondary} border border-[var(--theme-border-light)] px-2 py-1 rounded`}>
                  {product.categoryName}
                </span>

                <span className={`text-[var(--theme-primary)] font-semibold flex items-center gap-1`}>
                  상세보기
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className={`text-center py-20 ${themeClasses.text.muted}`}>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
