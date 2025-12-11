import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, User, UserX, LayoutDashboard } from "lucide-react";
import { MenuButton } from "./MenuButton";

export function AdminMenu({ actions }) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xs font-bold text-amber-700 uppercase tracking-[0.18em] flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3" />
          Admin Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-2">
        <MenuButton
          icon={<User className="w-4 h-4" />}
          label="회원 관리"
          onClick={actions.goAdminUserList}
        />
        <MenuButton
          icon={<UserX className="w-4 h-4" />}
          label="블랙리스트 관리"
          variant="destructive"
          onClick={actions.goAdminBlacklist}
        />
        <MenuButton
          icon={<LayoutDashboard className="w-4 h-4" />}
          label="관리자 홈"
          onClick={actions.goAdminHome}
        />
      </CardContent>
    </Card>
  );
}
