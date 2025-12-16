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
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher, ChristmasBackground } from "@/config/themeConfig";

// Theme-based styles
const getThemeStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return {
        bg: 'bg-transparent',
        cardStyle: 'bg-white/90 backdrop-blur-sm border border-gray-200 shadow-[4px_4px_12px_rgba(196,30,58,0.15)] rounded-[32px] overflow-hidden',
        titleColor: 'text-[#c41e3a]',
        headerBorder: 'border-b border-[#c41e3a]/30',
      };
    case 'dark':
      return {
        bg: 'bg-[#0B1120]',
        cardStyle: 'bg-[#1E293B] border border-gray-700 shadow-[4px_4px_12px_rgba(0,0,0,0.3)] rounded-[32px] overflow-hidden',
        titleColor: 'text-white',
        headerBorder: 'border-b border-gray-700',
      };
    case 'portrait':
      return {
        bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
        cardStyle: 'bg-white/80 backdrop-blur-sm border border-pink-200 shadow-[4px_4px_12px_rgba(255,181,197,0.2)] rounded-[32px] overflow-hidden',
        titleColor: 'text-pink-600',
        headerBorder: 'border-b border-pink-200',
      };
    case 'pop':
      return {
        bg: 'bg-slate-50',
        cardStyle: 'bg-white border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-[32px] overflow-hidden',
        titleColor: 'text-pink-500',
        headerBorder: 'border-b-2 border-black',
      };
    case 'classic':
      return {
        bg: 'bg-white',
        cardStyle: 'bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(99,91,255,0.1)] rounded-[32px] overflow-hidden',
        titleColor: 'text-[#635bff]',
        headerBorder: 'border-b border-gray-200',
      };
    case 'default':
    default:
      return {
        bg: 'bg-slate-50',
        cardStyle: 'bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-[32px] overflow-hidden',
        titleColor: 'text-slate-900',
        headerBorder: 'border-b border-black/30',
      };
  }
};

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

  // Theme
  const { theme, setTheme } = useThemeStore();
  const themeStyles = getThemeStyles(theme);

  const isBackupMode = otpMode === "backup";
  const isLoginDisabled = loginLoading || !email.trim() || !password.trim();

  useEffect(() => {
    setField("password", "");
  }, [setField]);

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${theme === 'dark' ? 'text-white' : 'text-slate-900'} pb-20`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      <section className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className={themeStyles.cardStyle}>
            <CardHeader className={`px-10 pt-10 pb-4 ${themeStyles.headerBorder}`}>
              <CardTitle className={`text-2xl font-black tracking-tight ${themeStyles.titleColor} text-center`}>
                {theme === 'christmas' ? '🎄 Login' : 'Login'}
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
                theme={theme}
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-10 pb-10 pt-0">
              <SocialLoginButtons
                onKakao={handleKakaoLogin}
                onGoogle={handleGoogleLogin}
                loginLoading={loginLoading}
                theme={theme}
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
        theme={theme}
      />
    </div>
  );
}
