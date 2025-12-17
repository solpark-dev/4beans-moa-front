import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { useMainStore } from "@/store/main/mainStore";
import { useThemeStore } from "@/store/themeStore";
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

// 테마별 Products 섹션 스타일
const productsThemeStyles = {
  pop: {
    stickerBg: "bg-cyan-400",
    priceColor: "text-pink-500",
    emoji: "🎬",
  },
  christmas: {
    stickerBg: "bg-[#1a5f2a]",
    stickerText: "text-white",
    priceColor: "text-[#c41e3a]",
    emoji: "🎄",
  },
};

function Sticker({ children, color = "bg-white", rotate = 0, className = "", isDark = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${color}
        ${isDark ? 'border-gray-600' : 'border border-gray-200'}
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

function BouncyCard({ children, className = "", delay = 0, onClick, isDark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 16 }}
      whileHover={{ y: -8, rotate: 1 }}
      onClick={onClick}
      className={`
        ${isDark ? 'bg-[#1E293B]' : 'bg-white'}
        ${isDark ? 'border-gray-600' : 'border-gray-200'}
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
  const { theme } = useThemeStore();
  const themeStyle = productsThemeStyles[theme] || productsThemeStyles.pop;
  const isDark = theme === "dark";

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
    <section className={`relative px-6 md:px-12 py-20 ${isDark ? 'bg-[#0F172A] border-gray-700' : 'bg-slate-100 border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div>
            <Sticker
              color={themeStyle.stickerBg}
              rotate={-1}
              className="inline-block px-4 py-2 rounded-xl mb-4"
              isDark={isDark}
            >
              <span className={`font-black ${themeStyle.stickerText || ""}`}>
                {theme === "christmas" ? "🎄 구독 상품 🎁" : `구독 상품 ${themeStyle.emoji}`}
              </span>
            </Sticker>
            <h2 className={`text-4xl md:text-5xl font-black ${isDark ? 'text-white' : 'text-black'}`}>
              원하는 서비스를 골라요
            </h2>
            <p className={`font-medium mt-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              다양한 구독 서비스를 확인하고 파티에 참여하세요.
            </p>
          </div>

          <Link to="/product">
            <Sticker color="bg-black" rotate={2} className="px-5 py-3 rounded-xl cursor-pointer" isDark={isDark}>
              <span className="flex items-center gap-2 text-white font-black">
                전체 보기 <ArrowUpRight className="w-5 h-5" />
              </span>
            </Sticker>
          </Link>
        </motion.div>

        {productsError?.status === 401 && (
          <div className="mb-10">
            <div className={`${isDark ? 'bg-[#1E293B] border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'} rounded-3xl p-6 font-bold shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
              구독 상품은 로그인 후 확인할 수 있어요.
            </div>
          </div>
        )}

        {productsLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`h-72 ${isDark ? 'bg-[#1E293B] border-gray-600' : 'bg-white border-gray-200'} rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] animate-pulse`}
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
                    isDark={isDark}
                  >
                    <div className={`p-6 ${isDark ? 'border-gray-600 bg-[#2D3B4F]' : 'border-gray-200 bg-slate-50'} border-b`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className={`font-black text-xl truncate ${isDark ? 'text-white' : 'text-black'}`}>
                            {name || "-"}
                          </div>
                          <div className="mt-2 inline-flex">
                            <span
                              className={`${badge.cls} ${isDark ? 'border-gray-600' : 'border-gray-200'} px-3 py-1 rounded-full font-black text-sm`}
                            >
                              {badge.label}
                            </span>
                          </div>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${isDark ? 'bg-[#1E293B] border-gray-600' : 'bg-white border-gray-200'} overflow-hidden flex items-center justify-center`}>
                          {icon ? (
                            <img
                              src={icon}
                              alt={name || "icon"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className={`font-black text-lg ${isDark ? 'text-white' : 'text-black'}`}>MoA</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-3 text-sm font-bold">
                      <div className={`flex justify-between pb-2 ${isDark ? 'border-gray-600' : 'border-gray-100'} border-b`}>
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>요금제</span>
                        <span className={isDark ? 'text-white' : 'text-black'}>{tier || "-"}</span>
                      </div>
                      <div className={`flex justify-between pb-2 ${isDark ? 'border-gray-600' : 'border-gray-100'} border-b`}>
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>가격</span>
                        <span className={`${themeStyle.priceColor} font-black`}>
                          {formatCurrency(price, { fallback: "-" })}
                        </span>
                      </div>
                      <div className={`flex justify-between pb-2 ${isDark ? 'border-gray-600' : 'border-gray-100'} border-b`}>
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>동시 접속</span>
                        <span className={isDark ? 'text-white' : 'text-black'}>
                          {maxProfiles ? `최대 ${maxProfiles}명` : "-"}
                        </span>
                      </div>

                      <p className={`font-medium leading-6 line-clamp-2 min-h-[48px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {desc || "설명 정보가 없습니다."}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goDetail(p);
                        }}
                        className={`w-full mt-2 ${isDark ? 'bg-[#1E293B] border-gray-600 hover:bg-[#2D3B4F]' : 'bg-white border-gray-200 hover:bg-slate-100'} rounded-2xl py-3 font-black transition flex items-center justify-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}
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
                <div className={`inline-block ${isDark ? 'bg-[#1E293B] border-gray-600 text-white' : 'bg-white border-gray-200 text-black'} rounded-3xl px-8 py-6 font-black shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
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
