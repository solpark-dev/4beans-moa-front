import { Button } from "@/components/ui/button";

export function SocialButton({ provider, isConnected, onClick }) {
  const isGoogle = provider === "google";
  const baseConnected =
    "flex-1 h-10 border text-xs font-bold transition-all duration-200 bg-red-50 border-red-300 text-red-600 hover:bg-red-100 rounded-xl";
  const baseGoogle =
    "flex-1 h-10 border text-xs font-bold transition-all duration-200 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 rounded-xl";
  const baseKakao =
    "flex-1 h-10 border text-xs font-bold transition-all duration-200 bg-[#FEE500] border-[#FCD34D] text-slate-900 hover:bg[#FDE68A] rounded-xl";

  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={isConnected ? baseConnected : isGoogle ? baseGoogle : baseKakao}
    >
      {isConnected
        ? `${provider.toUpperCase()} 해제`
        : `${provider.toUpperCase()} 연동`}
    </Button>
  );
}
