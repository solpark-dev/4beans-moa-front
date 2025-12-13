import { Button } from "@/components/ui/button";

export function SocialButton({ provider, isConnected, onClick }) {
  const isGoogle = provider === "google";

  const baseNeo =
    "h-9 px-4 text-xs font-black border-2 border-black rounded-xl " +
    "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] " +
    "hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] " +
    "hover:translate-x-[1px] hover:translate-y-[1px] " +
    "transition-all";

  const googleStyle = "bg-white text-black hover:bg-slate-50";

  const kakaoStyle = "bg-[#FEE500] text-black hover:bg-[#FDE68A]";

  const disconnectStyle = "bg-white text-red-600 hover:bg-red-50";

  return (
    <Button
      type="button"
      onClick={onClick}
      variant="outline"
      className={`${baseNeo} ${
        isConnected ? disconnectStyle : isGoogle ? googleStyle : kakaoStyle
      }`}
    >
      {isConnected
        ? `${provider.toUpperCase()} 해제`
        : `${provider.toUpperCase()} 연동`}
    </Button>
  );
}
