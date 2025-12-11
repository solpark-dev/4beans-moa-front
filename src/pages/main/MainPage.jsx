import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import TrendingPartiesSection from "./components/TrendingPartiesSection";
import SubscriptionProductsSection from "./components/SubscriptionProductsSection";
import { MOCK_PARTIES } from "@/constants/constants";

export default function MainPage() {
  return (
    <div className="w-full pb-20">
      <HeroSection />
      <FeaturesSection />
      <SubscriptionProductsSection />
      <TrendingPartiesSection parties={MOCK_PARTIES} />
    </div>
  );
}