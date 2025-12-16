import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const heroThemeStyles = {
  default: {
    gradientBg: "bg-gradient-to-br from-red-500 via-rose-500 to-amber-400",
    dotColor: "bg-emerald-300",
    highlightText: "text-amber-100",
    descText: "text-amber-50/90",
    cardBg: "bg-white/95 border-amber-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  christmas: {
    gradientBg: "bg-gradient-to-br from-red-800 via-red-700 to-green-800",
    dotColor: "bg-green-400",
    highlightText: "text-green-200",
    descText: "text-green-100/90",
    cardBg: "bg-white/95 border-gray-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
  },
};

export default function RemoveBlacklistHero() {
  const { theme } = useThemeStore();
  const themeStyle = heroThemeStyles[theme] || heroThemeStyles.default;

  return (
    <section className="relative">
      <div className={`absolute inset-0 ${themeStyle.gradientBg}`} />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <div className="max-w-xl text-center md:text-left text-white">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-5 backdrop-blur">
              <span className={`flex h-2 w-2 rounded-full ${themeStyle.dotColor} mr-2`} />
              MoA 관리자 · 블랙리스트 해제
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              블랙리스트 상태를 해제하고
              <br />
              <span className={themeStyle.highlightText}>
                회원의 이용 제한을 풀 수 있습니다
              </span>
            </h1>
            <p className={`text-sm sm:text-base ${themeStyle.descText} leading-relaxed max-w-md mx-auto md:mx-0`}>
              해제 사유를 남겨 두면 이후 감사·이력 확인 시 도움을 줄 수
              있습니다. 신중하게 확인한 뒤 해제해 주세요.
            </p>
          </div>

          <Card className={`${themeStyle.cardBg} shadow-xl rounded-3xl w-full max-w-md hover:brightness-[1.03] transition`}>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl ${themeStyle.iconBg} flex items-center justify-center`}>
                  <ShieldCheck className={`w-5 h-5 ${themeStyle.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
                    BLACKLIST RELEASE
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    블랙리스트 해제 후에는 해당 계정의 서비스 이용이 다시
                    허용됩니다.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                계정 상태와 해제 사유를 다시 한 번 검토한 뒤 진행해 주세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
