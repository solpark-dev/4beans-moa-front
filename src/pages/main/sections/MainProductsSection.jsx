import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, ChevronRight } from "lucide-react";
import { useMainStore } from "@/store/main/mainStore";
import {
  formatCurrency,
  getProductId,
  getProductName,
  getProductCategory,
  getProductTier,
  getProductPrice,
  getProductMaxProfiles,
  getProductDescription,
  getProductStatus,
  getProductIconUrl,
} from "@/utils/format";

function Sticker({ children, color = "bg-white", rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${color}
        border-4 border-black
        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[3px] hover:translate-y-[3px]
        transition-all duration-200
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

function BouncyCard({ children, className = "", delay = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 16 }}
      whileHover={{ y: -8, rotate: 1 }}
      onClick={onClick}
      className={`
        bg-white
        border-4 border-black
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        rounded-3xl
        overflow-hidden
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default function MainProductsSection() {
  const navigate = useNavigate();
  const products = useMainStore((s) => s.products);
  const productsLoading = useMainStore((s) => s.productsLoading);
  const productsError = useMainStore((s) => s.productsError);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = useMemo(() => {
    const map = new Map();
    (products || []).forEach((p) => {
      const c = getProductCategory(p) || "기타";
      if (!map.has(c)) map.set(c, c);
    });
    return ["ALL", ...Array.from(map.values())];
  }, [products]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return (products || []).filter((p) => {
      const name = (getProductName(p) || "").toLowerCase();
      const category = getProductCategory(p) || "기타";
      const okName = !q || name.includes(q);
      const okCat = selectedCategory === "ALL" || category === selectedCategory;
      return okName && okCat;
    });
  }, [products, searchTerm, selectedCategory]);

  const goDetail = (p) => {
    const id = getProductId(p);
    if (!id) return;
    navigate(`/subscriptions/${id}`);
  };

  return (
    <section className="relative px-6 md:px-12 py-20 bg-slate-100 border-b-4 border-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <Sticker
              color="bg-cyan-400"
              rotate={-1}
              className="inline-block px-4 py-2 rounded-xl mb-4"
            >
              <span className="font-black">구독 상품 🎬</span>
            </Sticker>
            <h2 className="text-4xl md:text-5xl font-black">
              원하는 서비스를 골라요
            </h2>
            <p className="text-gray-700 font-medium mt-3">
              메인에서도 구독 상품을 검색/필터하고 바로 상세로 이동할 수 있어요.
            </p>
          </div>
        </div>

        <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 md:p-6 mb-10">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-black" />
            <input
              type="text"
              placeholder="서비스명 검색..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-2xl outline-none border-2 border-black font-bold focus:bg-white transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto mt-4 pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-2 rounded-2xl whitespace-nowrap border-2 border-black font-black transition
                  ${
                    selectedCategory === c
                      ? "bg-pink-500 text-white"
                      : "bg-white text-black hover:bg-slate-100"
                  }`}
              >
                {c === "ALL" ? (
                  <span className="inline-flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    전체
                  </span>
                ) : (
                  c
                )}
              </button>
            ))}
          </div>
        </div>

        {productsError?.status === 401 && (
          <div className="mb-10">
            <div className="bg-white border-4 border-black rounded-3xl p-6 font-bold text-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              구독 상품은 로그인 후 확인할 수 있어요. (서버 응답: 인증 필요)
            </div>
          </div>
        )}

        {productsLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse"
              />
            ))}
          </div>
        )}

        {!productsLoading && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => {
                const name = getProductName(p);
                const status = getProductStatus(p);
                const tier = getProductTier(p);
                const price = getProductPrice(p);
                const maxProfiles = getProductMaxProfiles(p);
                const desc = getProductDescription(p);
                const icon = getProductIconUrl(p);

                const badge =
                  status === "ACTIVE"
                    ? { label: "이용 가능", cls: "bg-lime-400" }
                    : status
                    ? { label: String(status), cls: "bg-slate-200" }
                    : { label: "준비중", cls: "bg-slate-200" };

                return (
                  <BouncyCard
                    key={`${getProductId(p) ?? i}`}
                    delay={i * 0.04}
                    onClick={() => goDetail(p)}
                  >
                    <div className="p-6 border-b-4 border-black bg-slate-50">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-black text-xl truncate">
                            {name || "-"}
                          </div>
                          <div className="mt-2 inline-flex">
                            <span
                              className={`${badge.cls} border-2 border-black px-3 py-1 rounded-full font-black text-sm`}
                            >
                              {badge.label}
                            </span>
                          </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-black overflow-hidden flex items-center justify-center">
                          {icon ? (
                            <img
                              src={icon}
                              alt={name || "icon"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-black text-lg">MoA</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-3 text-sm font-bold">
                      <div className="flex justify-between border-b-2 border-black/10 pb-2">
                        <span className="text-gray-600">요금제</span>
                        <span className="text-black">{tier || "-"}</span>
                      </div>
                      <div className="flex justify-between border-b-2 border-black/10 pb-2">
                        <span className="text-gray-600">가격</span>
                        <span className="text-pink-500 font-black">
                          {formatCurrency(price, { fallback: "-" })}
                        </span>
                      </div>
                      <div className="flex justify-between border-b-2 border-black/10 pb-2">
                        <span className="text-gray-600">동시 접속</span>
                        <span className="text-black">
                          {maxProfiles ? `최대 ${maxProfiles}명` : "-"}
                        </span>
                      </div>

                      <p className="text-gray-700 font-medium leading-6 line-clamp-2 min-h-[48px]">
                        {desc || "설명 정보가 없습니다."}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goDetail(p);
                        }}
                        className="w-full mt-2 bg-white border-4 border-black rounded-2xl py-3 font-black hover:bg-slate-100 transition flex items-center justify-center gap-2"
                      >
                        자세히 보기 <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </BouncyCard>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <div className="inline-block bg-white border-4 border-black rounded-3xl px-8 py-6 font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  검색 결과가 없습니다.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
