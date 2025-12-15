import { useEffect } from "react";
import { useMainStore } from "@/store/main/mainStore";
import MainHeroSection from "./sections/MainHeroSection";
import MainFeaturesSection from "./sections/MainFeaturesSection";
import MainProductsSection from "./sections/MainProductsSection";
import MainTrendingSection from "./sections/MainTrendingSection";
import MainHowItWorksSection from "./sections/MainHowItWorksSection";

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
    <div className="min-h-screen bg-slate-50 text-black overflow-hidden">
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
          <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 font-black">
            {error}
          </div>
        </div>
      ) : null}

      <div className="relative z-10">
        <MainHeroSection products={products} stats={stats} />
        <MainFeaturesSection stats={stats} />
        <MainProductsSection />
        <MainTrendingSection parties={parties} />
        <MainHowItWorksSection />
      </div>
    </div>
  );
}
