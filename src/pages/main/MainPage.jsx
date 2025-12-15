import { useEffect } from "react";
import { motion } from "framer-motion";
import { useMainStore } from "@/store/main/mainStore";
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

  useEffect(() => {
    loadMain();
  }, [loadMain]);

  return (
    <div className="min-h-screen bg-slate-50 text-black -mt-35 pt-5">
      {/* Animated Gradient Orbs Background - portrait-v2 effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Primary Orb - Orange/Coral */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 40%, transparent 70%)",
            top: "-10%",
            right: "-5%",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary Orb - Indigo/Purple */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%)",
            bottom: "10%",
            left: "-10%",
          }}
          animate={{
            x: [0, -25, 35, 0],
            y: [0, 35, -25, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Tertiary Orb - Cyan/Teal */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(20, 184, 166, 0.04) 40%, transparent 70%)",
            top: "40%",
            left: "30%",
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />

        {/* Fourth Orb - Pink/Rose */}
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(244, 114, 182, 0.1) 0%, rgba(236, 72, 153, 0.04) 40%, transparent 70%)",
            bottom: "30%",
            right: "15%",
          }}
          animate={{
            x: [0, -20, 25, 0],
            y: [0, 25, -20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </div>

      {/* Dot Pattern Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {error ? (
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] p-6 font-black">
            {error}
          </div>
        </div>
      ) : null}

      <div className="relative z-10">
        <MainHeroSection products={products} parties={parties} stats={stats} />
        <MainMarqueeSection />
        <MainStatementSection />
        <MainComparisonSection />
        <MainStatsMarquee />
        <MainFeaturesSection stats={stats} />
        <MainProductsSection />
        <MainTrendingSection parties={parties} />
        <MainHowItWorksSection />
      </div>
    </div>
  );
}
