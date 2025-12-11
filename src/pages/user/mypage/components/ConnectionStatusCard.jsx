import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InfoCard } from "./InfoCard";
import { SocialButton } from "@/pages/user/shared/SocialButton";
import { OtpSection } from "./OtpSection";

export function ConnectionStatusCard({
  user,
  loginProvider,
  googleConn,
  kakaoConn,
  otp,
  backup,
  actions,
}) {
  if (!user) return null;
  return (
    <InfoCard title="CONNECTION STATUS" icon={<Zap className="w-4 h-4" />}>
      <div className="flex justify-between items-center py-1.5">
        <span className="text-sm font-medium text-slate-500">?��???</span>
        <span className="text-sm font-semibold text-slate-900">
          {user.phone}
        </span>
      </div>
      <div className="flex justify-between items-center py-1.5">
        <span className="text-sm font-medium text-slate-500">로그??방식</span>
        <span className="text-sm font-semibold uppercase text-indigo-700">
          {loginProvider}
        </span>
      </div>

      <Separator className="bg-slate-200 my-4" />

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
          Linked Accounts
        </p>
        <div className="flex gap-3">
          <SocialButton
            provider="google"
            isConnected={!!googleConn}
            onClick={actions.handleGoogleClick}
          />
          <SocialButton
            provider="kakao"
            isConnected={!!kakaoConn}
            onClick={actions.handleKakaoClick}
          />
        </div>
      </div>

      <Separator className="bg-slate-200 my-4" />

      <OtpSection otp={otp} backup={backup} actions={actions} />
    </InfoCard>
  );
}
