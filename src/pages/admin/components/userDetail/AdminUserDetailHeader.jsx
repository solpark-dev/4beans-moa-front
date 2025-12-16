import { AlertTriangle } from "lucide-react";
import OutlineCard from "./OutlineCard";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const headerThemeStyles = {
  default: {
    tagBorder: "border-2 border-slate-900",
    dotColor: "bg-red-500",
  },
  christmas: {
    tagBorder: "border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    dotColor: "bg-green-600",
  },
};

export default function AdminUserDetailHeader({ shortId }) {
  const { theme } = useThemeStore();
  const themeStyle = headerThemeStyles[theme] || headerThemeStyles.default;

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 ${themeStyle.tagBorder} rounded-full px-4 py-2 text-xs font-extrabold`}>
              <span className={`w-2 h-2 rounded-full ${themeStyle.dotColor}`} />
              MoA 관리자 · 회원 상세 · ID: {shortId}
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-[1.05]">
              MOA 회원 목록
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
