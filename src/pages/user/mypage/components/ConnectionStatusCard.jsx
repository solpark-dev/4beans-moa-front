import React from "react";
import { Link2, Shield, Smartphone } from "lucide-react";
import { formatPhone } from "@/utils/phoneUtils";

const SECTION_TITLE = "text-xs font-black tracking-widest";
const ROW = "flex items-center justify-between py-3";
const BTN =
  "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-black font-black text-sm hover:bg-slate-50 active:translate-y-[1px]";
const BTN_DANGER =
  "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-red-600 font-black text-sm hover:bg-slate-50 active:translate-y-[1px]";

export function ConnectionStatusCard({
  user,
  loginProvider,
  googleConn,
  kakaoConn,
  otp,
  actions,
}) {
  const phone = formatPhone(user?.phone);

  const toggleGoogle = () => {
    if (typeof actions?.handleGoogleClick === "function") {
      return actions.handleGoogleClick();
    }
  };

  const toggleKakao = () => {
    if (typeof actions?.handleKakaoClick === "function") {
      return actions.handleKakaoClick();
    }
  };

  const openOtp = () => {
    if (!otp?.enabled) {
      if (typeof actions?.otp?.openSetup === "function")
        return actions.otp.openSetup();
    } else {
      if (typeof actions?.otp?.prepareDisable === "function")
        return actions.otp.prepareDisable();
    }
    if (typeof actions?.handleOtpModalChange === "function")
      return actions.handleOtpModalChange(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="w-4 h-4" />
        <p className="font-black">CONNECTION STATUS</p>
      </div>

      <div className="border-t-2 border-black">
        <div className={ROW}>
          <p className="text-sm text-slate-600 font-bold">전화번호</p>
          <p className="text-sm font-black">{phone}</p>
        </div>

        <div className="border-t border-black/20" />

        <div className={ROW}>
          <p className="text-sm text-slate-600 font-bold">로그인 방식</p>
          <span className="px-3 py-1 rounded-full border border-gray-200 bg-white text-xs font-black">
            {loginProvider || "LOCAL"}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t-2 border-black pt-5">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-4 h-4" />
          <p className={SECTION_TITLE}>LINKED ACCOUNTS</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={googleConn ? BTN_DANGER : BTN}
            onClick={toggleGoogle}
          >
            {googleConn ? "GOOGLE 해제" : "GOOGLE 연동"}
          </button>

          <button
            type="button"
            className={kakaoConn ? BTN_DANGER : BTN}
            onClick={toggleKakao}
          >
            {kakaoConn ? "KAKAO 해제" : "KAKAO 연동"}
          </button>
        </div>
      </div>

      <div className="mt-6 border-t-2 border-black pt-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4" />
          <p className={SECTION_TITLE}>SECURITY · GOOGLE OTP</p>
        </div>

        <div className="flex items-center justify-between gap-3 border border-gray-200 rounded-2xl p-4 bg-white">
          <span className="text-sm font-black">
            {otp?.enabled ? "OTP 사용중" : "OTP 미사용"}
          </span>

          <button type="button" className={BTN} onClick={openOtp}>
            {otp?.enabled ? "OTP 해제" : "OTP 설정"}
          </button>
        </div>
      </div>
    </div>
  );
}
