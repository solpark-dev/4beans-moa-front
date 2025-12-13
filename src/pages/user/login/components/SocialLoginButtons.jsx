import { Button } from "@/components/ui/button";

const SOCIAL_BUTTON =
  "w-full h-12 flex items-center justify-center gap-3 border-4 border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-[13px] font-black uppercase tracking-[0.2em]";

export function SocialLoginButtons({ onKakao, onGoogle, loginLoading }) {
  return (
    <div className="space-y-3">
      <Button
        id="btnKakaoLogin"
        type="button"
        onClick={onKakao}
        className={`${SOCIAL_BUTTON} bg-[#FEE500] text-black hover:bg-[#FEE500] hover:text-black hover:brightness-95 transition`}
      >
        <span className="w-4 h-4 bg-black/20 rounded-full" />
        카카오로 로그인
      </Button>

      <Button
        id="btnGoogleLogin"
        type="button"
        onClick={onGoogle}
        className={`${SOCIAL_BUTTON} bg-white text-slate-900 hover:bg-white hover:text-slate-900 hover:brightness-95 transition`}
        disabled={loginLoading}
      >
        <span className="w-4 h-4 bg-slate-300 rounded-full" />
        Google 계정으로 로그인
      </Button>
    </div>
  );
}
