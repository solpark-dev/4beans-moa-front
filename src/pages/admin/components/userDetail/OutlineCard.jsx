import { Card } from "@/components/ui/card";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const outlineCardThemeStyles = {
  default: {
    border: "border-2 border-slate-900",
    shadow: "shadow-[0_10px_0_rgba(0,0,0,0.06)]",
  },
  christmas: {
    border: "border border-gray-200",
    shadow: "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
  },
};

export default function OutlineCard({ className = "", children }) {
  const { theme } = useThemeStore();
  const themeStyle = outlineCardThemeStyles[theme] || outlineCardThemeStyles.default;

  return (
    <Card
      className={`bg-white ${themeStyle.border} rounded-3xl ${themeStyle.shadow} ${className}`}
    >
      {children}
    </Card>
  );
}
