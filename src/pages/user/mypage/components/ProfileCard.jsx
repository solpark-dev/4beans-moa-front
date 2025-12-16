import React from "react";
import { useThemeStore } from "@/store/themeStore";

const CARD =
  "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-3xl";
const BTN =
  "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-black font-black text-sm active:translate-y-[1px]";
const BTN_DANGER =
  "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-red-600 font-black text-sm active:translate-y-[1px]";

// 테마별 스타일
const profileCardThemeStyles = {
  default: {
    buttonHover: "hover:bg-slate-50",
  },
  christmas: {
    buttonHover: "hover:bg-red-50",
  },
};

export function ProfileCard({
  user,
  isAdmin,
  shortId,
  actions,
  profileImageUrl,
}) {
  const { theme } = useThemeStore();
  const themeStyle = profileCardThemeStyles[theme] || profileCardThemeStyles.default;

  const name = user?.nickname || "USER";
  const idText = shortId || user?.userId || "";
  const displayImageUrl = profileImageUrl || "";

  const goUpdate = () => {
    if (typeof actions?.goEditUser === "function") return actions.goEditUser();
    if (typeof actions?.goUpdateUser === "function")
      return actions.goUpdateUser();
    if (typeof actions?.navigateUpdateUser === "function")
      return actions.navigateUpdateUser();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/mypage/edit");
  };

  const goPassword = () => {
    if (typeof actions?.goChangePwd === "function") return actions.goChangePwd();
    if (typeof actions?.goUpdatePassword === "function")
      return actions.goUpdatePassword();
    if (typeof actions?.navigateUpdatePassword === "function")
      return actions.navigateUpdatePassword();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/mypage/password");
  };

  const goDelete = () => {
    if (typeof actions?.goDeleteUser === "function")
      return actions.goDeleteUser();
    if (typeof actions?.navigateDeleteUser === "function")
      return actions.navigateDeleteUser();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/mypage/delete");
  };

  return (
    <div className={`${CARD} p-6`}>
      <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border border-gray-200 bg-slate-100 flex items-center justify-center overflow-hidden">
            {displayImageUrl ? (
              <img
                src={displayImageUrl}
                alt={`${name} profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-black text-xl">{name?.[0] || "U"}</span>
            )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-black text-lg leading-none">{name}</p>
            <span className="px-2 py-0.5 rounded-full border border-gray-200 text-xs font-black bg-white">
              {isAdmin ? "ADMIN" : "MEMBER"}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 font-bold truncate">
            ID: {idText}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {!isAdmin && (
          <>
            <button type="button" className={`${BTN} ${themeStyle.buttonHover}`} onClick={goUpdate}>
              회원정보 수정
            </button>
            <button type="button" className={`${BTN} ${themeStyle.buttonHover}`} onClick={goPassword}>
              비밀번호 변경
            </button>
            <button type="button" className={`${BTN_DANGER} ${themeStyle.buttonHover}`} onClick={goDelete}>
              회원 탈퇴
            </button>
          </>
        )}
      </div>
    </div>
  );
}
