import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, CreditCard, Users, KeyRound, Wallet, History } from "lucide-react";
import { MenuButton } from "./MenuButton";

export function AccountMenu({ actions, loginHistoryRef }) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em] flex items-center gap-1.5">
          <LayoutDashboard className="w-3 h-3" />
          Account Menu
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-2">
        <MenuButton
          icon={<CreditCard className="w-4 h-4" />}
          label="구독·결제 관리"
          onClick={actions.goSubscription}
          active
        />
        <MenuButton
          icon={<Users className="w-4 h-4" />}
          label="내 파티 목록"
          onClick={actions.goMyParties}
        />
        <MenuButton
          icon={<KeyRound className="w-4 h-4" />}
          label="비밀번호 변경"
          onClick={actions.goChangePwd}
        />
        <MenuButton
          icon={<Wallet className="w-4 h-4" />}
          label="내 지갑"
          onClick={actions.goWallet}
        />
        <MenuButton
          icon={<History className="w-4 h-4" />}
          label="로그인 기록"
          onClick={() =>
            loginHistoryRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        />
      </CardContent>
    </Card>
  );
}
