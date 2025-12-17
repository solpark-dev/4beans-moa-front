import React, { useEffect, useState } from "react";
import { useMyPage } from "@/hooks/user/useMyPage";
import { useLoginHistory } from "@/hooks/user/useLoginHistory";
import { useBackupCodeModal } from "@/hooks/user/useBackupCodeModal";
import { useOtpStore } from "@/store/user/otpStore";
import { resolveProfileImageUrl } from "@/utils/profileImage";
import { useThemeStore } from "@/store/themeStore";

import { Separator } from "@/components/ui/separator";

// 테마별 스타일
const myPageThemeStyles = {
  pop: {
    // Neo/Pop 스타일 - 핑크, 시안 계열
    accent: "text-pink-500",
    accentBg: "bg-pink-500",
    buttonBg: "bg-pink-500 hover:bg-pink-600",
    accentText: "text-pink-500",
    cyanText: "text-cyan-500",
    bg: "bg-slate-50",
    cardBg: "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    text: "text-slate-900",
  },
  christmas: {
    accent: "text-[#c41e3a]",
    accentBg: "bg-[#c41e3a]",
    buttonBg: "bg-[#c41e3a] hover:bg-red-700",
    accentText: "text-[#c41e3a]",
    cyanText: "text-[#1a5f2a]",
    bg: "bg-transparent",
    cardBg: "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    text: "text-slate-900",
  },
  dark: {
    accent: "text-[#635bff]",
    accentBg: "bg-[#635bff]",
    buttonBg: "bg-[#635bff] hover:bg-[#5851e8]",
    accentText: "text-[#635bff]",
    cyanText: "text-[#00d4ff]",
    bg: "bg-[#0B1120]",
    cardBg: "bg-[#1E293B] border border-gray-700 shadow-lg",
    text: "text-white",
  },
  classic: {
    accent: "text-[#635bff]",
    accentBg: "bg-[#635bff]",
    buttonBg: "bg-[#635bff] hover:bg-[#5851e8]",
    accentText: "text-[#635bff]",
    cyanText: "text-[#00d4ff]",
    bg: "bg-white",
    cardBg: "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]",
    text: "text-slate-900",
  },
};

import { ProfileCard } from "./components/ProfileCard";
import { AccountMenu } from "./components/AccountMenu";
import { AdminMenu } from "./components/AdminMenu";
import { AccountInfoCard } from "./components/AccountInfoCard";
import { ConnectionStatusCard } from "./components/ConnectionStatusCard";
import { LoginHistoryCard } from "./components/LoginHistoryCard";
import { OtpDialog } from "./components/OtpDialog";
import { BackupCodeDialog } from "./components/BackupCodeDialog";

const HERO_WRAPPER = "relative mt-6 sm:mt-10 overflow-hidden";

// PANE_WRAPPER는 이제 동적으로 themeStyle.cardBg를 사용합니다

export default function MyPage() {
  const { theme } = useThemeStore();
  const themeStyle = myPageThemeStyles[theme] || myPageThemeStyles.pop;
  const { state, actions } = useMyPage();

  const {
    user,
    isAdmin,
    shortId,
    marketingAgreed,
    googleConn,
    kakaoConn,
    loginProvider,
  } = state;

  const otp = {
    enabled: useOtpStore((s) => s.enabled),
    modalOpen: useOtpStore((s) => s.modalOpen),
    mode: useOtpStore((s) => s.mode),
    qrUrl: useOtpStore((s) => s.qrUrl),
    code: useOtpStore((s) => s.code),
    loading: useOtpStore((s) => s.loading),
  };

  const backup = useBackupCodeModal();
  const showUserUI = !isAdmin;
  const [activeView, setActiveView] = useState("main");
  const loginHistory = useLoginHistory({
    size: 10,
    enabled: activeView === "history" && !!user,
  });
  const loginHistoryState = loginHistory?.state;

  useEffect(() => {
    if (otp.enabled) {
      backup.fetchExistingCodes();
    }
  }, [otp.enabled]);

  useEffect(() => {
    if (user) {
      useOtpStore.getState().setEnabled(!!user.otpEnabled);
    }
  }, [user]);

  const handleOtpConfirm = async () => {
    const result = await actions.otp.confirmOtp?.();

    if (result?.success && result.mode === "enable") {
      if (backup.issued) {
        await backup.openExistingCodes();
      } else {
        await backup.issueBackupCodes();
      }
    }
  };

  if (!user) return null;

  const paneWrapperClass = `${themeStyle.cardBg} rounded-2xl sm:rounded-3xl`;

  return (
    <div className={`min-h-screen font-sans pb-20 relative z-10 ${themeStyle.bg} ${themeStyle.text}`}>
      <section className={HERO_WRAPPER}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className={`${themeStyle.cardBg} rounded-2xl sm:rounded-[32px] min-h-[280px] sm:min-h-[320px] flex items-center`}>
            <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
              <div className="text-center lg:text-left max-w-2xl">
                <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3 ${themeStyle.text}`}>
                  나의 구독과 계정
                  <br />
                  <span className={themeStyle.accentText}>한곳에서 관리해요</span>
                </h2>
              </div>

              <div className="w-full max-w-xl">
                <ProfileCard
                  user={user}
                  isAdmin={isAdmin}
                  shortId={shortId}
                  actions={actions}
                  profileImageUrl={
                    user?.profileImage
                      ? `${resolveProfileImageUrl(user.profileImage)}${user.updatedAt ? `?v=${user.updatedAt}` : ""
                      }`
                      : ""
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-8 sm:mt-12">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 min-h-[400px] sm:min-h-[520px]">
          <aside className="w-full lg:w-80 flex flex-col gap-3 sm:gap-4">
            {showUserUI && (
              <div className={paneWrapperClass}>
                <AccountMenu
                  actions={actions}
                  activeView={activeView}
                  onShowMain={() => setActiveView("main")}
                  onShowLoginHistory={() => setActiveView("history")}
                />
              </div>
            )}

            {isAdmin && (
              <div className={paneWrapperClass}>
                <AdminMenu actions={actions} />
              </div>
            )}
          </aside>

          {showUserUI && (
            <main className="flex-1 flex flex-col gap-4 sm:gap-8">
              {activeView === "main" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  <div className={paneWrapperClass}>
                    <AccountInfoCard
                      user={user}
                      marketingAgreed={marketingAgreed}
                      formatDate={actions.formatDate}
                    />
                  </div>

                  <div className={paneWrapperClass}>
                    <ConnectionStatusCard
                      user={user}
                      loginProvider={loginProvider}
                      googleConn={googleConn}
                      kakaoConn={kakaoConn}
                      otp={otp}
                      backup={backup}
                      actions={actions}
                    />
                  </div>
                </div>
              )}

              {activeView === "history" && (
                <div className={paneWrapperClass}>
                  <div className="p-6">
                    <LoginHistoryCard
                      loginHistory={loginHistoryState}
                      onBack={() => setActiveView("main")}
                    />
                  </div>
                  <Separator className={theme === "dark" ? "bg-gray-700" : "bg-slate-200"} />
                </div>
              )}
            </main>
          )}
        </div>
      </div>

      {showUserUI && (
        <>
          <OtpDialog
            open={otp.modalOpen}
            onOpenChange={actions.handleOtpModalChange}
            otp={otp}
            actions={actions}
            handleOtpConfirm={handleOtpConfirm}
          />

          <BackupCodeDialog backup={backup} />
        </>
      )}
    </div>
  );
}
