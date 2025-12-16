import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { useMainStore } from "@/store/main/mainStore";
import {
  formatCurrency,
  getProductId,
  getProductName,
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
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]
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
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
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

  // 랜덤 3개 상품 선택
  const randomProducts = useMemo(() => {
    const list = Array.isArray(products) ? [...products] : [];
    if (list.length <= 3) return list;

    // Fisher-Yates 셔플 알고리즘으로 랜덤 선택
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list.slice(0, 3);
  }, [products]);

  const goDetail = (p) => {
    const id = getProductId(p);
    if (!id) return;
    navigate(`/product/${id}`);
  };

  return (
    <section className="relative px-6 md:px-12 py-20 bg-slate-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
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
              다양한 구독 서비스를 확인하고 파티에 참여하세요.
            </p>
          </div>

          <Link to="/product">
            <Sticker color="bg-black" rotate={2} className="px-5 py-3 rounded-xl cursor-pointer">
              <span className="flex items-center gap-2 text-white font-black">
                전체 보기 <ArrowUpRight className="w-5 h-5" />
              </span>
            </Sticker>
          </Link>
        </motion.div>

        {productsError?.status === 401 && (
          <div className="mb-10">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 font-bold text-gray-800 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
              구독 상품은 로그인 후 확인할 수 있어요.
            </div>
          </div>
        )}

        {productsLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] animate-pulse"
              />
            ))}
          </div>
        )}

        {!productsLoading && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {randomProducts.map((p, i) => {
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
                    delay={i * 0.08}
                    onClick={() => goDetail(p)}
                  >
                    <div className="p-6 border-b border-gray-200 bg-slate-50">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-black text-xl truncate">
                            {name || "-"}
                          </div>
                          <div className="mt-2 inline-flex">
                            <span
                              className={`${badge.cls} border border-gray-200 px-3 py-1 rounded-full font-black text-sm`}
                            >
                              {badge.label}
                            </span>
                          </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
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
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">요금제</span>
                        <span className="text-black">{tier || "-"}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">가격</span>
                        <span className="text-pink-500 font-black">
                          {formatCurrency(price, { fallback: "-" })}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
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
                        className="w-full mt-2 bg-white border border-gray-200 rounded-2xl py-3 font-black hover:bg-slate-100 transition flex items-center justify-center gap-2"
                      >
                        자세히 보기 <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </BouncyCard>
                );
              })}
            </div>

            {randomProducts.length === 0 && (
              <div className="py-16 text-center">
                <div className="inline-block bg-white border border-gray-200 rounded-3xl px-8 py-6 font-black shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
                  등록된 상품이 없습니다.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
