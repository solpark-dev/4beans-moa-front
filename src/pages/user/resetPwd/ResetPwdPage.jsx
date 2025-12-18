// src/pages/user/ResetPwdPage.jsx
import { useEffect } from "react";
import { initResetPwdPage } from "@/hooks/auth/useResetPassword";
import { ResetPwdGuide } from "./components/ResetPwdGuide";
import { ResetPwdForm } from "./components/ResetPwdForm";
import { PageTitle } from "../shared/PageTitle";
import { PageSteps } from "../shared/PageSteps";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher, ChristmasBackground } from "@/config/themeConfig";

// Theme-based styles
const getThemeStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return {
        bg: 'bg-transparent',
        text: 'text-gray-900',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
        subtext: 'text-gray-500',
      };
    case 'dark':
      return {
        bg: 'bg-transparent',
        text: 'text-white',
        cardBg: 'bg-[#1E293B]/90 backdrop-blur-sm border border-gray-700 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
        subtext: 'text-gray-400',
      };
    case 'pop':
      return {
        bg: 'bg-transparent',
        text: 'text-black',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-[0_4px_12px_rgba(236,72,153,0.1)]',
        subtext: 'text-gray-600',
      };
    case 'classic':
      return {
        bg: 'bg-transparent',
        text: 'text-gray-900',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
        subtext: 'text-gray-500',
      };
    default:
      return {
        bg: 'bg-transparent',
        text: 'text-slate-900',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        subtext: 'text-gray-500',
      };
  }
};

export default function ResetPwdPage() {
  const { theme, setTheme } = useThemeStore();
  const themeStyles = getThemeStyles(theme);

  useEffect(() => {
    initResetPwdPage();
  }, []);

  const steps = [
    { number: 1, label: "본인 인증", active: true },
    { number: 2, label: "새 비밀번호 설정", active: false },
  ];

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text}`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-20 space-y-8">
        <div className="text-center">
          <PageTitle
            title={theme === 'christmas' ? '🎄 비밀번호 재설정' : '비밀번호 재설정'}
            subtitle="PASS 본인 인증 후 새 비밀번호를 설정해 주세요"
          />
        </div>

        <div className={`${themeStyles.cardBg} p-10 space-y-8`}>
          <PageSteps steps={steps} />

          <div className="grid md:grid-cols-2 gap-6">
            <ResetPwdGuide />
            <ResetPwdForm />
          </div>

          <p className={`text-xs ${themeStyles.subtext} text-center`}>
            본인 확인이 완료된 경우 비밀번호 재설정이 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
