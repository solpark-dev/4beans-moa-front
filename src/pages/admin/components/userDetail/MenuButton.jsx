import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const menuButtonThemeStyles = {
  default: {
    activeBg: "bg-slate-900 hover:bg-slate-900",
    activeBorder: "border-slate-900",
    inactiveHover: "hover:bg-slate-50",
  },
  christmas: {
    activeBg: "bg-red-800 hover:bg-red-800",
    activeBorder: "border-red-800",
    inactiveHover: "hover:bg-red-50",
  },
};

export default function MenuButton({ icon, label, onClick, active = false }) {
  const { theme } = useThemeStore();
  const themeStyle = menuButtonThemeStyles[theme] || menuButtonThemeStyles.default;

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start h-11 px-4 text-sm font-bold rounded-2xl border-2 transition-colors ${
        active
          ? `${themeStyle.activeBorder} ${themeStyle.activeBg} text-white`
          : `border-slate-200 bg-white text-slate-900 ${themeStyle.inactiveHover}`
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
      {active && <span className="ml-auto text-xs">●</span>}
    </Button>
  );
}
