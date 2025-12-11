import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ProfileCard({ user, isAdmin, shortId, actions }) {
  if (!user) return null;

  return (
    <Card className="bg-white/95 border border-indigo-100 shadow-xl rounded-3xl w-full max-w-md">
      <CardContent className="p-6 flex items-center gap-5">
        <div className="relative">
          <Avatar className="w-20 h-20 border border-slate-200 bg-slate-100">
            <AvatarImage
              src={
                user.profileImage
                  ? user.profileImage.startsWith("http")
                    ? user.profileImage
                    : `https://localhost:8443${user.profileImage}`
                  : ""
              }
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-200 text-2xl font-bold text-slate-700">
              {user.nickname?.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border border-slate-200">
            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm" />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg md:text-xl font-bold text-slate-900">
              {user.nickname}
            </p>
            {isAdmin && (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                ADMINISTRATOR
              </Badge>
            )}
            <Badge className="bg-white text-indigo-600 border border-indigo-200 text-[10px]">
              MEMBER
            </Badge>
          </div>
          <p className="text-xs text-slate-500">{user.userId}</p>
          <div className="text-[11px] text-slate-400">ID: {shortId}</div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              type="button"
              onClick={actions.goEditUser}
              className="h-9 px-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              회원정보 수정
            </Button>
            <Button
              type="button"
              onClick={actions.goChangePwd}
              variant="outline"
              className="h-9 px-4 text-xs border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 rounded-lg"
            >
              비밀번호 변경
            </Button>
            <Button
              type="button"
              onClick={actions.goDeleteUser}
              variant="outline"
              className="h-9 px-4 text-xs border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg"
            >
              회원 탈퇴
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
