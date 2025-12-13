import { useEffect } from "react";
import { useLoginPageLogic } from "@/hooks/auth/useLogin";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LoginForm } from "./components/LoginForm";
import { SocialLoginButtons } from "./components/SocialLoginButtons";
import { LoginOtpDialog } from "./components/LoginOtpDialog";

const CARD_STYLE =
  "bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-[32px] overflow-hidden";

export default function LoginPage() {
  const {
    email,
    password,
    remember,
    otpModalOpen,
    otpCode,
    otpMode,
    setField,
    handleEmailLogin,
    handleKakaoLogin,
    handleGoogleLogin,
    handleOtpChange,
    handleOtpConfirm,
    closeOtpModal,
    handleUnlockByCertification,
    switchToOtpMode,
    switchToBackupMode,
    loginLoading,
    otpLoading,
    errors,
    handleEmailChange,
    handlePasswordChange,
  } = useLoginPageLogic();

  const isBackupMode = otpMode === "backup";
  const isLoginDisabled = loginLoading || !email.trim() || !password.trim();

  useEffect(() => {
    setField("password", "");
  }, [setField]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <section className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className={CARD_STYLE}>
            <CardHeader className="px-10 pt-10 pb-4 border-b border-black/30">
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900 text-center">
                Login
              </CardTitle>
            </CardHeader>

            <CardContent className="px-10 pt-6 pb-6 space-y-6">
              <LoginForm
                email={email}
                password={password}
                remember={remember}
                errors={errors}
                onEmailChange={handleEmailChange}
                onPasswordChange={handlePasswordChange}
                onRememberChange={(v) => setField("remember", v)}
                onSubmit={handleEmailLogin}
                onUnlock={handleUnlockByCertification}
                isLoginDisabled={isLoginDisabled}
                loginLoading={loginLoading}
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-10 pb-10 pt-0">
              <SocialLoginButtons
                onKakao={handleKakaoLogin}
                onGoogle={handleGoogleLogin}
                loginLoading={loginLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </section>

      <LoginOtpDialog
        open={otpModalOpen}
        isBackupMode={isBackupMode}
        otpCode={otpCode}
        errors={errors}
        onOpenChange={closeOtpModal}
        onSwitchOtp={switchToOtpMode}
        onSwitchBackup={switchToBackupMode}
        onChangeCode={handleOtpChange}
        onConfirm={handleOtpConfirm}
        loading={otpLoading}
      />
    </div>
  );
}
