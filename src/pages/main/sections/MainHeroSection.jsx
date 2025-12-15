import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { useMainStore } from "@/store/main/mainStore";
import {
  formatCurrency,
  getProductName,
  getProductPrice,
} from "@/utils/format";

function Sticker({ children, color = "bg-white", rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
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

function PopButton({
  children,
  color = "bg-pink-500",
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        ${color}
        px-7 py-4
        font-black text-lg md:text-xl
        border-4 border-black
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[4px] hover:translate-y-[4px]
        transition-all duration-200
        rounded-2xl
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function Marquee({ children, direction = "left", speed = 20 }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="inline-flex"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default function MainHeroSection() {
  const products = useMainStore((s) => s.products);
  const productsLoading = useMainStore((s) => s.productsLoading);

  const topProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    const sorted = [...products].sort((a, b) => {
      const ap = Number(getProductPrice(a) ?? -1);
      const bp = Number(getProductPrice(b) ?? -1);
      return bp - ap;
    });
    return sorted.slice(0, 3);
  }, [products]);

  return (
    <section className="relative px-6 md:px-12 pt-10 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <Sticker
              color="bg-white"
              rotate={-2}
              className="inline-block px-5 py-2 rounded-xl mb-6"
            >
              <span className="font-black text-base md:text-lg">
                혼자 내면 부담, 같이 내면 반값! 🍿
              </span>
            </Sticker>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-7"
            >
              <span className="block -rotate-1">SHARE</span>
              <span className="block rotate-1">
                <span className="text-cyan-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  YOUR
                </span>
              </span>
              <span className="block -rotate-1 text-pink-500 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                OTT!
              </span>
            </motion.h1>

            <p className="text-base md:text-lg font-medium text-gray-700 max-w-xl mx-auto lg:mx-0 mb-8">
              메인에서도 구독 상품과 파티를 한 번에 확인하고, 바로 파티
              찾기/만들기를 시작하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/parties">
                <PopButton color="bg-pink-500 text-white">
                  <span className="flex items-center gap-2">
                    파티 찾기 <ArrowRight className="w-6 h-6" />
                  </span>
                </PopButton>
              </Link>

              <Link to="/parties/create">
                <PopButton color="bg-white text-black">
                  <span className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    파티 만들기
                  </span>
                </PopButton>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative flex justify-center lg:justify-end"
          >
            <Sticker
              color="bg-white"
              rotate={2}
              className="w-full max-w-sm p-6 rounded-3xl"
            >
              <div className="text-center mb-4">
                <span className="text-sm font-bold text-pink-500 uppercase tracking-wider">
                  인기 구독 상품
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {productsLoading && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-14 bg-slate-100 rounded-xl border-2 border-black animate-pulse"
                      />
                    ))}
                  </>
                )}

                {!productsLoading &&
                  topProducts.map((p, i) => (
                    <div
                      key={`${getProductName(p)}-${i}`}
                      className="flex items-center justify-between p-3 bg-slate-100 rounded-xl border-2 border-black"
                    >
                      <div className="min-w-0">
                        <div className="font-black truncate">
                          {getProductName(p) || "-"}
                        </div>
                        <div className="text-xs font-bold text-gray-600">
                          {formatCurrency(getProductPrice(p), {
                            fallback: "-",
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-black" />
                        <span className="font-black text-sm">HOT</span>
                      </div>
                    </div>
                  ))}

                {!productsLoading && topProducts.length === 0 && (
                  <div className="p-4 bg-slate-100 rounded-xl border-2 border-black text-center font-bold text-gray-700">
                    구독 상품을 불러오지 못했어요.
                  </div>
                )}
              </div>

              <div className="bg-black text-white p-4 rounded-2xl text-center">
                <p className="text-sm mb-1">지금 바로</p>
                <p className="text-2xl md:text-3xl font-black">
                  파티로 절약 시작 💰
                </p>
              </div>
            </Sticker>

            <div className="absolute -top-4 -left-4 w-full max-w-sm h-full bg-cyan-400 rounded-3xl border-4 border-black -z-10 transform -rotate-6" />
            <div className="absolute -top-8 -left-8 w-full max-w-sm h-full bg-pink-400 rounded-3xl border-4 border-black -z-20 transform -rotate-12" />
          </motion.div>
        </div>
      </div>

      <div className="mt-14 bg-black text-white py-4 border-y-4 border-black">
        <Marquee speed={25}>
          <div className="flex items-center gap-8 px-4">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="flex items-center gap-4 text-lg md:text-xl font-black uppercase tracking-wider"
              >
                <Star className="w-6 h-6 text-pink-400 fill-pink-400" />
                Netflix
                <Star className="w-6 h-6 text-cyan-400 fill-cyan-400" />
                Disney+
                <Star className="w-6 h-6 text-lime-400 fill-lime-400" />
                Wavve
              </span>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
}
