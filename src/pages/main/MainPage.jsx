<<<<<<< HEAD
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMainStore } from "@/store/main/mainStore";
import { useThemeStore } from "@/store/themeStore";
import { ChristmasBackground } from "@/config/themeConfig";

import IntroSplash from "@/components/intro/IntroSplash";

// 테마별 배경 orbs 스타일
const mainPageThemeStyles = {
  default: {
    orb1: "rgba(249, 115, 22, 0.15)", // Orange
    orb1Fade: "rgba(249, 115, 22, 0.05)",
    orb2: "rgba(99, 102, 241, 0.12)", // Indigo
    orb2Fade: "rgba(139, 92, 246, 0.05)",
    orb3: "rgba(6, 182, 212, 0.1)", // Cyan
    orb3Fade: "rgba(20, 184, 166, 0.04)",
    orb4: "rgba(244, 114, 182, 0.1)", // Pink
    orb4Fade: "rgba(236, 72, 153, 0.04)",
  },
  christmas: {
    orb1: "rgba(196, 30, 58, 0.15)", // Christmas Red
    orb1Fade: "rgba(196, 30, 58, 0.05)",
    orb2: "rgba(26, 95, 42, 0.12)", // Christmas Green
    orb2Fade: "rgba(26, 95, 42, 0.05)",
    orb3: "rgba(196, 30, 58, 0.1)", // Red
    orb3Fade: "rgba(196, 30, 58, 0.04)",
    orb4: "rgba(26, 95, 42, 0.1)", // Green
    orb4Fade: "rgba(26, 95, 42, 0.04)",
  },
};
=======
import { useEffect } from "react";
import { useMainStore } from "@/store/main/mainStore";
import { useThemeStore } from "@/store/themeStore";
>>>>>>> service
import MainHeroSection from "./sections/MainHeroSection";
import MainFeaturesSection from "./sections/MainFeaturesSection";
import MainProductsSection from "./sections/MainProductsSection";
import MainTrendingSection from "./sections/MainTrendingSection";
import MainHowItWorksSection from "./sections/MainHowItWorksSection";
import MainMarqueeSection from "./sections/MainMarqueeSection";
import MainStatementSection from "./sections/MainStatementSection";
import MainComparisonSection from "./sections/MainComparisonSection";
import MainStatsMarquee from "./sections/MainStatsMarquee";
import MainSearchSection from "./sections/MainSearchSection";

export default function MainPage() {
  const loadMain = useMainStore((s) => s.loadMain);
  const products = useMainStore((s) => s.products);
  const parties = useMainStore((s) => s.parties);
  const stats = useMainStore((s) => s.stats);
  const error = useMainStore((s) => s.error);
  const { theme } = useThemeStore();
<<<<<<< HEAD
  const themeStyle = mainPageThemeStyles[theme] || mainPageThemeStyles.default;
  const [showIntro, setShowIntro] = useState(true);
=======
>>>>>>> service

  useEffect(() => {
    loadMain();
  }, [loadMain]);

<<<<<<< HEAD
  useEffect(() => {
    if (sessionStorage.getItem("introPlayed")) {
      setShowIntro(false);
      return;
    }

    const timer = setTimeout(() => {
      // sessionStorage.setItem("introPlayed", "true");
      setShowIntro(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const bgClass =
    theme === "dark"
      ? "bg-[#0B1120] text-white"
      : theme === "christmas"
      ? "bg-transparent text-black"
      : "bg-slate-50 text-black";

  return (
    <>
      {/* 인트로 */}
      <AnimatePresence>{showIntro && <IntroSplash />}</AnimatePresence>

      {/* 메인 페이지 (🔥 이 안에 전부 들어가야 함) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`min-h-screen ${bgClass} -mt-35 pt-5`}
      >
        {theme === "christmas" && <ChristmasBackground />}

        {/* Animated Gradient Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* orb motion.div들 그대로 */}
=======
  return (
    <div className="min-h-screen -mt-35 pt-5">
      {error ? (
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className={`${theme === 'dark' ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-white border-gray-200 text-black'} border rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] p-6 font-black`}>
            {error}
          </div>
>>>>>>> service
        </div>

        {/* Dot Pattern */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />

        {error && (
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] p-6 font-black">
              {error}
            </div>
          </div>
        )}

        <div className="relative z-10">
          <MainHeroSection
            products={products}
            parties={parties}
            stats={stats}
          />
          <MainMarqueeSection />
          <MainStatementSection />
          <MainComparisonSection />
          <MainStatsMarquee />
          <MainFeaturesSection stats={stats} />
          <MainProductsSection />
          <MainTrendingSection parties={parties} />
          <MainHowItWorksSection />
        </div>
      </motion.div>
    </>
  );
}
