import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OutlineCard from "./OutlineCard";
import { resolveProfileImageUrl } from "@/utils/profileImage";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const profileCardThemeStyles = {
  default: {
    avatarBorder: "border-2 border-slate-900",
    statusDotBorder: "border-2 border-slate-900",
    badgeBorder: "border-2 border-slate-900",
    buttonBorder: "border-2 border-slate-900",
    buttonHover: "hover:bg-slate-50",
    blacklistActive: "bg-slate-900 text-white hover:bg-slate-900",
  },
  christmas: {
    avatarBorder: "border border-gray-200",
    statusDotBorder: "border border-gray-200",
    badgeBorder: "border border-gray-200",
    buttonBorder: "border border-gray-200",
    buttonHover: "hover:bg-red-50",
    blacklistActive: "bg-red-800 text-white hover:bg-red-800",
  },
};

export default function AdminUserDetailProfileCard({
  user,
  statusDotClass,
  isAdmin,
  isBlacklisted,
  goBackList,
  goLoginHistory,
  goBlacklistAdd,
}) {
  const { theme } = useThemeStore();
  const themeStyle = profileCardThemeStyles[theme] || profileCardThemeStyles.default;

  return (
    <OutlineCard>
      <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className={`w-20 h-20 ${themeStyle.avatarBorder} bg-slate-100`}>
              <AvatarImage
                src={resolveProfileImageUrl(user.profileImage)}
                className="object-cover"
              />
              <AvatarFallback className="bg-slate-200 text-2xl font-black text-slate-900">
                {user.nickname?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full ${themeStyle.statusDotBorder}`}>
              <div className={`w-3 h-3 rounded-full ${statusDotClass}`} />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-black text-slate-900">
                {user.nickname}
              </p>
              {isAdmin && (
                <Badge className={`bg-white text-slate-900 ${themeStyle.badgeBorder} text-[10px] font-black`}>
                  ADMINISTRATOR
                </Badge>
              )}
              <Badge className={`bg-white text-slate-900 ${themeStyle.badgeBorder} text-[10px] font-black`}>
                MEMBER
              </Badge>
              {isBlacklisted && (
                <Badge className={`bg-red-500 text-white ${themeStyle.badgeBorder} text-[10px] font-black`}>
                  BLACKLIST
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-600 font-semibold">
              {user.userId}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:ml-auto">
          <Button
            type="button"
            onClick={goBackList}
            className={`h-10 px-4 rounded-2xl ${themeStyle.buttonBorder} bg-white text-slate-900 font-black ${themeStyle.buttonHover}`}
          >
            회원 목록
          </Button>

          <Button
            type="button"
            onClick={goLoginHistory}
            className={`h-10 px-4 rounded-2xl ${themeStyle.buttonBorder} bg-white text-slate-900 font-black ${themeStyle.buttonHover}`}
          >
            로그인 이력
          </Button>

          <Button
            type="button"
            onClick={goBlacklistAdd}
            className={`h-10 px-4 rounded-2xl ${themeStyle.buttonBorder} font-black ${
              isBlacklisted
                ? themeStyle.blacklistActive
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {isBlacklisted ? "블랙리스트 해제" : "블랙리스트 등록"}
          </Button>
        </div>
      </div>
    </OutlineCard>
  );
}
