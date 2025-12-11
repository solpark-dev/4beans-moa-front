import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Search } from "lucide-react";
import { SUBSCRIPTION_PRODUCTS } from "@/constants/constants";

export default function SubscriptionProductsSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = useMemo(() => {
    const unique = new Map();
    SUBSCRIPTION_PRODUCTS.forEach((product) => {
      const key = product.category;
      if (!unique.has(key)) {
        unique.set(key, { categoryId: key, categoryName: product.category });
      }
    });
    return Array.from(unique.values());
  }, []);

  const filteredProducts = useMemo(() => {
    return SUBSCRIPTION_PRODUCTS.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      const matchCategory =
        selectedCategory === "ALL" || product.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleNavigate = (productId) => {
    navigate(`/subscriptions/${productId}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pb-20">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">구독 상품</h2>
          <p className="text-gray-500">
            GetSubscription 화면에서 사용한 카드형 UI를 메인에서도 동일하게
            제공합니다.
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-200 mb-10 shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="서비스명 검색..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto mt-4">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-xl whitespace-nowrap border ${
              selectedCategory === "ALL"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            } transition`}
          >
            <Filter className="w-4 h-4 inline-block mr-2" />
            전체
          </button>

          {categories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => setSelectedCategory(category.categoryId)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap border ${
                selectedCategory === category.categoryId
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              } transition`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition"
            onClick={() => handleNavigate(product.id)}
          >
            <div className="bg-gray-50 p-8 text-center border-b border-gray-100">
              <img
                src={product.iconUrl}
                alt={product.name}
                className="w-20 h-20 rounded-xl object-cover mx-auto mb-4 shadow-sm"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                  product.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.status === "ACTIVE" ? "이용 가능" : "준비중"}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">요금제</span>
                <span className="font-medium text-gray-900">
                  {product.tier}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">가격</span>
                <span className="font-bold text-brand-600">
                  {product.price.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">동시 접속</span>
                <span className="font-medium text-gray-900">
                  최대 {product.maxProfiles}명
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-6">
                {product.description}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate(product.id);
                }}
                className="w-full mt-4 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                자세히 보기
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center py-20 text-gray-400">검색 결과가 없습니다.</p>
      )}
    </section>
  );
}
