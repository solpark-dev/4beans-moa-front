import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronRight } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">구독 상품</h1>
      <p className="text-gray-500 mb-8">다양한 구독 서비스를 확인하세요.</p>

      <div className="bg-white p-4 rounded-xl border mb-8 flex flex-col gap-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="서비스명 검색..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg outline-none border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-lg whitespace-nowrap border ${
              selectedCategory === "ALL"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-600 border-gray-300"
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
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-white text-gray-600 border-gray-300"
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
            className="bg-white border rounded-2xl p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/subscriptions/${product.productId}`)}
          >
            <img
              src={product.image}
              alt={product.productName}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {product.productName}
            </h2>

            <div className="flex justify-between items-center">
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {product.categoryName}
              </span>

              <span className="text-blue-600 font-semibold flex items-center gap-1">
                상세보기
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center py-20 text-gray-400">검색 결과가 없습니다.</p>
      )}
    </div>
  );
}
