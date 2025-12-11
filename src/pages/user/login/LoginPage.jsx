import { useEffect } from "react";
import { useLoginPageLogic } from "@/hooks/auth/useLogin";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { LoginHero } from "./components/LoginHero";
import { LoginForm } from "./components/LoginForm";
import { SocialLoginButtons } from "./components/SocialLoginButtons";
import { LoginOtpDialog } from "./components/LoginOtpDialog";

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
    <div className="w-full pb-20 bg-slate-50 text-slate-900">
      <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <LoginHero />

          <div className="w-full max-w-md">
            <Card className="w-full bg-white border border-gray-100 shadow-2xl rounded-3xl">
              <CardHeader className="pb-3 px-6 pt-6">
                <CardTitle className="text-lg md:text-xl text-gray-900">
                  이메일로 로그인
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 px-6 pb-4">
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

              <CardFooter className="px-6 pb-6 pt-0 flex flex-col gap-3">
                <SocialLoginButtons
                  onKakao={handleKakaoLogin}
                  onGoogle={handleGoogleLogin}
                  loginLoading={loginLoading}
                />
              </CardFooter>
            </Card>
          </div>
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
