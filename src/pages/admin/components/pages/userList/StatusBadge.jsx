import { Badge } from "@/components/ui/badge";
import { useThemeStore } from "@/store/themeStore";

// 테마별 상태 뱃지 스타일
const statusBadgeThemeStyles = {
  default: {
    blacklist: "bg-red-500 hover:bg-red-500 text-white",
    BLOCK: "bg-orange-500 text-white",
    WITHDRAW: "bg-slate-400 text-white",
    PENDING: "bg-yellow-400 text-slate-900",
    ACTIVE: "bg-emerald-500 text-white",
  },
  christmas: {
    blacklist: "bg-red-800 hover:bg-red-800 text-red-100",           // 버건디
    BLOCK: "bg-amber-700 hover:bg-amber-700 text-amber-100",         // 카라멜
    WITHDRAW: "bg-stone-500 hover:bg-stone-500 text-stone-100",      // 웜 그레이
    PENDING: "bg-amber-100 hover:bg-amber-100 text-amber-700",       // 크림 베이지
    ACTIVE: "bg-green-800 hover:bg-green-800 text-green-100",        // 포레스트 그린
  },
};

export default function StatusBadge({ status, blacklisted }) {
  const { theme } = useThemeStore();
  const themeStyle = statusBadgeThemeStyles[theme] || statusBadgeThemeStyles.default;

  if (blacklisted) {
    return (
      <Badge className={`${themeStyle.blacklist} text-white text-xs font-black border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-full`}>
        블랙리스트
      </Badge>
    );
  }

  const labels = {
    BLOCK: "이용제한",
    WITHDRAW: "탈퇴",
    PENDING: "미인증",
    ACTIVE: "정상",
  };
  const key = status === "ACTIVE" || !themeStyle[status] ? "ACTIVE" : status;

  return (
    <Badge
      className={`${themeStyle[key]} hover:${themeStyle[key]} text-xs font-black border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-full`}
    >
      {labels[key]}
    </Badge>
  );
}
