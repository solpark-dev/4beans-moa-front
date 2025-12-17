import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BouncyCard } from "@/components/common/neo";
import { useThemeStore } from "@/store/themeStore";

// 테마별 Comparison 섹션 스타일
const comparisonThemeStyles = {
  pop: {
    cardBg: "bg-gradient-to-br from-pink-50 to-cyan-50",
    iconBg: "bg-pink-500",
    priceColor: "text-pink-500",
    savingBg: "bg-lime-100",
    savingText: "text-lime-600",
    avatarColors: ["bg-red-500", "bg-blue-500", "bg-lime-400", "bg-cyan-400"],
    emoji: "🎉",
  },
  christmas: {
    cardBg: "bg-gradient-to-br from-red-50 to-green-50",
    iconBg: "bg-[#c41e3a]",
    priceColor: "text-[#c41e3a]",
    savingBg: "bg-[#1a5f2a]/10",
    savingText: "text-[#1a5f2a]",
    avatarColors: ["bg-[#c41e3a]", "bg-[#1a5f2a]", "bg-[#c41e3a]", "bg-[#1a5f2a]"],
    emoji: "🎄",
  },
};

// ============================================
// Comparison Section - 혼자 vs 모아 비교
// ============================================
export default function MainComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme } = useThemeStore();
  const themeStyle = comparisonThemeStyles[theme] || comparisonThemeStyles.pop;

  return (
    <section ref={ref} className="py-24 px-6 bg-slate-100 border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            얼마나 절약할 수 있을까요?
          </h2>
          <p className="text-gray-600 font-bold">같은 서비스, 다른 가격</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 혼자 결제 */}
          <BouncyCard className="p-8 text-center" delay={0.1}>
            <div className="w-20 h-20 bg-gray-200 rounded-2xl border border-gray-200 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
              <span className="text-4xl">😢</span>
            </div>
            <h3 className="text-xl font-black mb-2">혼자 결제하면</h3>
            <p className="text-gray-500 font-bold mb-6">정가 그대로, 매달 부담</p>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-gray-300 border border-gray-200" />
            </div>
            <p className="text-4xl font-black text-red-500">월 17,000원</p>
            <p className="text-sm text-gray-400 font-bold mt-2">넷플릭스 프리미엄 기준</p>
          </BouncyCard>

          {/* 모아에서 */}
          <BouncyCard className={`p-8 text-center ${themeStyle.cardBg}`} delay={0.2}>
            <div className={`w-20 h-20 ${themeStyle.iconBg} rounded-2xl border border-gray-200 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
              <span className="text-4xl">{themeStyle.emoji}</span>
            </div>
            <h3 className="text-xl font-black mb-2">모아에서 나누면</h3>
            <p className="text-gray-500 font-bold mb-6">똑같은 서비스, 저렴한 가격</p>
            <div className="flex justify-center -space-x-2 mb-4">
              {themeStyle.avatarColors.map((color, i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-full ${color} border border-gray-200 shadow-sm`}
                />
              ))}
            </div>
            <p className={`text-4xl font-black ${themeStyle.priceColor}`}>월 4,250원</p>
            <p className="text-sm font-bold mt-2">
              <span className={`${themeStyle.savingText} ${themeStyle.savingBg} px-2 py-1 rounded-full border border-gray-200`}>
                {theme === "christmas" ? "🎁 -75% 절약!" : "-75% 절약!"}
              </span>
            </p>
          </BouncyCard>
        </div>
      </div>
    </section>
  );
}
