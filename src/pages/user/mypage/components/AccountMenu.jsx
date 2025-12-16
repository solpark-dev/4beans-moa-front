import React from "react";
import { KeyRound, Home, Clock, CreditCard, Users, Wallet } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const WRAP = "p-6";
const TITLE = "flex items-center gap-2 font-black";
const ITEM =
  "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-black font-black text-sm active:translate-y-[1px]";
const ACTIVE =
  "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-slate-100 text-black font-black text-sm";

// 테마별 스타일
const accountMenuThemeStyles = {
  default: {
    itemHover: "hover:bg-slate-50",
  },
  christmas: {
    itemHover: "hover:bg-red-50",
  },
};

export function AccountMenu({
  actions,
  activeView,
  onShowMain,
  onShowLoginHistory,
}) {
  const { theme } = useThemeStore();
  const themeStyle = accountMenuThemeStyles[theme] || accountMenuThemeStyles.default;
  const goPassword = () => {
    if (typeof actions?.goChangePwd === "function") return actions.goChangePwd();
    if (typeof actions?.goUpdatePassword === "function")
      return actions.goUpdatePassword();
    if (typeof actions?.navigateUpdatePassword === "function")
      return actions.navigateUpdatePassword();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/mypage/password");
  };

  const goSubscription = () => {
    if (typeof actions?.goSubscription === "function")
      return actions.goSubscription();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/subscription");
  };

  const goMyParties = () => {
    if (typeof actions?.goMyParties === "function")
      return actions.goMyParties();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/my-parties");
  };

  const goWallet = () => {
    if (typeof actions?.goWallet === "function") return actions.goWallet();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/mypage/wallet");
  };

  return (
    <div className={WRAP}>
      <div className="flex items-center justify-between mb-4">
        <p className={TITLE}>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 bg-white">
            ▦
          </span>
          Account Menu
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className={activeView === "main" ? ACTIVE : `${ITEM} ${themeStyle.itemHover}`}
          onClick={onShowMain}
        >
          <span className="inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            마이페이지
          </span>
        </button>

        <button type="button" className={`${ITEM} ${themeStyle.itemHover}`} onClick={goSubscription}>
          <span className="inline-flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            구독·결제 관리
          </span>
        </button>

        <button type="button" className={`${ITEM} ${themeStyle.itemHover}`} onClick={goMyParties}>
          <span className="inline-flex items-center gap-2">
            <Users className="w-4 h-4" />내 파티 목록
          </span>
        </button>

        <button type="button" className={`${ITEM} ${themeStyle.itemHover}`} onClick={goPassword}>
          <span className="inline-flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            비밀번호 변경
          </span>
        </button>

        <button type="button" className={`${ITEM} ${themeStyle.itemHover}`} onClick={goWallet}>
          <span className="inline-flex items-center gap-2">
            <Wallet className="w-4 h-4" />내 지갑
          </span>
        </button>

        <button
          type="button"
          className={activeView === "history" ? ACTIVE : `${ITEM} ${themeStyle.itemHover}`}
          onClick={onShowLoginHistory}
        >
          <span className="inline-flex items-center gap-2">
            <Clock className="w-4 h-4" />
            로그인 기록
          </span>
        </button>
      </div>
    </div>
  );
}
