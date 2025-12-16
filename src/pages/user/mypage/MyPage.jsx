import React, { useEffect, useState } from "react";
import { useMyPage } from "@/hooks/user/useMyPage";
import { useLoginHistory } from "@/hooks/user/useLoginHistory";
import { useBackupCodeModal } from "@/hooks/user/useBackupCodeModal";
import { useOtpStore } from "@/store/user/otpStore";
import { resolveProfileImageUrl } from "@/utils/profileImage";

import { Separator } from "@/components/ui/separator";

import { ProfileCard } from "./components/ProfileCard";
import { AccountMenu } from "./components/AccountMenu";
import { AdminMenu } from "./components/AdminMenu";
import { AccountInfoCard } from "./components/AccountInfoCard";
import { ConnectionStatusCard } from "./components/ConnectionStatusCard";
import { LoginHistoryCard } from "./components/LoginHistoryCard";
import { OtpDialog } from "./components/OtpDialog";
import { BackupCodeDialog } from "./components/BackupCodeDialog";

const HERO_WRAPPER = "relative mt-10 overflow-hidden";

const PANE_WRAPPER =
  "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-3xl";

export default function MyPage() {
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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      <section className={HERO_WRAPPER}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-[32px] min-h-[320px] flex items-center">
            <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 px-6 lg:px-10 py-10">
              <div className="text-center lg:text-left max-w-2xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3">
                  나의 구독과 계정
                  <br />
                  <span className="text-indigo-600">한곳에서 관리해요</span>
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
                      ? `${resolveProfileImageUrl(user.profileImage)}${
                          user.updatedAt ? `?v=${user.updatedAt}` : ""
                        }`
                      : ""
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-12">
        <div className="flex flex-col lg:flex-row gap-8 min-h-[520px]">
          <aside className="w-full lg:w-80 flex flex-col gap-4">
            {showUserUI && (
              <div className={PANE_WRAPPER}>
                <AccountMenu
                  actions={actions}
                  activeView={activeView}
                  onShowMain={() => setActiveView("main")}
                  onShowLoginHistory={() => setActiveView("history")}
                />
              </div>
            )}

            {isAdmin && (
              <div className={PANE_WRAPPER}>
                <AdminMenu actions={actions} />
              </div>
            )}
          </aside>

          {showUserUI && (
            <main className="flex-1 flex flex-col gap-8">
              {activeView === "main" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className={PANE_WRAPPER}>
                    <AccountInfoCard
                      user={user}
                      marketingAgreed={marketingAgreed}
                      formatDate={actions.formatDate}
                    />
                  </div>

                  <div className={PANE_WRAPPER}>
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
                <div className={PANE_WRAPPER}>
                  <div className="p-6">
                    <LoginHistoryCard
                      loginHistory={loginHistoryState}
                      onBack={() => setActiveView("main")}
                    />
                  </div>
                  <Separator className="bg-slate-200" />
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
