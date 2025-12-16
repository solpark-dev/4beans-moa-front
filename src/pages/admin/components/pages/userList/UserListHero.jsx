import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import Sticker from "./Sticker";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const heroThemeStyles = {
  default: {
    dotColor: "bg-lime-400",
    cardBg1: "bg-cyan-400",
    cardBg2: "bg-pink-400",
    iconBg: "bg-lime-400",
    countText: "text-pink-500",
    progressBar: "bg-black",
  },
  christmas: {
    dotColor: "bg-green-600",
    cardBg1: "bg-green-800",
    cardBg2: "bg-red-800",
    iconBg: "bg-green-800",
    countText: "text-red-700",
    progressBar: "bg-red-800",
  },
};

export default function UserListHero({ totalCount }) {
  const { theme } = useThemeStore();
  const themeStyle = heroThemeStyles[theme] || heroThemeStyles.default;
  return (
    <section className="relative px-6 md:px-12 pt-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="text-center lg:text-left">
            <Sticker className="inline-flex items-center gap-2 px-5 py-2 mb-6">
              <span className={`inline-flex h-3 w-3 rounded-full ${themeStyle.dotColor} border border-gray-200`} />
              <span className="font-black tracking-tight">
                MOA 관리자 · 회원 관리 센터
              </span>
            </Sticker>

            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6 ${isDark ? 'text-white' : ''}`}>
              회원목록
            </h1>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className={`absolute -top-4 -left-4 w-full h-full ${themeStyle.cardBg1} rounded-3xl border border-gray-200 -z-10`} />
              <div className={`absolute -top-8 -left-8 w-full h-full ${themeStyle.cardBg2} rounded-3xl border border-gray-200 -z-20`} />

              <Card className={`${isDark ? 'bg-[#1E293B] border-gray-600' : 'bg-white border-gray-200'} border shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${themeStyle.iconBg} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center`}>
                      <LayoutDashboard className={`w-6 h-6 ${theme === 'christmas' ? 'text-green-100' : 'text-black'}`} />
                    </div>
                    <div>
                      <p className={`text-lg md:text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>
                        MOA 회원{" "}
                        <span className={themeStyle.countText}>
                          {(totalCount ?? 0).toLocaleString()}명
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className={`h-2 ${themeStyle.progressBar} rounded-full`} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
