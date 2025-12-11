import React, { useEffect, useRef } from "react";
import { useMyPage } from "@/hooks/user/useMyPage";
import { useLoginHistory } from "@/hooks/user/useLoginHistory";
import { useBackupCodeModal } from "@/hooks/user/useBackupCodeModal";
import { useOtpStore } from "@/store/user/otpStore";

import { Separator } from "@/components/ui/separator";

import { ProfileCard } from "./components/ProfileCard";
import { AccountMenu } from "./components/AccountMenu";
import { AdminMenu } from "./components/AdminMenu";
import { AccountInfoCard } from "./components/AccountInfoCard";
import { ConnectionStatusCard } from "./components/ConnectionStatusCard";
import { LoginHistoryCard } from "./components/LoginHistoryCard";
import { OtpDialog } from "./components/OtpDialog";
import { BackupCodeDialog } from "./components/BackupCodeDialog";

export default function MyPage() {
  const { state, actions } = useMyPage();
  const loginHistory = useLoginHistory(10);
  const loginHistoryRef = useRef(null);

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

  useEffect(() => {
    if (otp.enabled) {
      backup.fetchExistingCodes();
    }
  }, [otp.enabled]);

  const handleOtpConfirm = async () => {
    const result = await actions.otp.confirmOtp();

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
              MoA 계정 관리자 · ID: {shortId}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
              나의 구독, 파티, 계정까지
              <br />
              <span className="text-indigo-100">한곳에서 관리해요</span>
            </h2>
            <p className="text-sm sm:text-base text-indigo-50/90 leading-relaxed max-w-md mx-auto md:mx-0">
              로그인 정보, 비밀번호, 소셜 연동 관리가 모두 여기서 가능합니다.
              안전한 계정 관리를 위해 정보를 최신 상태로 유지하세요.
            </p>
          </div>

          <ProfileCard
            user={user}
            isAdmin={isAdmin}
            shortId={shortId}
            actions={actions}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="flex flex-col lg:flex-row gap-8 mt-8 min-h-[520px]">
          <aside className="w-full lg:w-72 flex flex-col gap-4">
            {showUserUI && (
              <AccountMenu actions={actions} loginHistoryRef={loginHistoryRef} />
            )}
            {isAdmin && <AdminMenu actions={actions} />}
          </aside>

          {showUserUI && (
            <main className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AccountInfoCard
                  user={user}
                  marketingAgreed={marketingAgreed}
                  formatDate={actions.formatDate}
                />
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
              <Separator className="bg-slate-200" />
              <div ref={loginHistoryRef}>
                <LoginHistoryCard loginHistory={loginHistory} />
              </div>
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
