import { useFindIdStore } from "@/store/user/findIdStore";
import { useFindIdLogic } from "@/hooks/auth/useFindId";
import { FindIdForm } from "./components/FindIdForm";
import { FindIdResult } from "./components/FindIdResult";
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
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
        subtext: 'text-gray-500',
      };
    case 'dark':
      return {
        bg: 'bg-[#0B1120]',
        text: 'text-white',
        cardBg: 'bg-[#1E293B] border border-gray-700 shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
        subtext: 'text-gray-400',
      };
    case 'portrait':
      return {
        bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
        text: 'text-gray-900',
        cardBg: 'bg-white/80 backdrop-blur-sm border border-pink-200 shadow-[4px_4px_12px_rgba(255,181,197,0.2)]',
        subtext: 'text-gray-500',
      };
    case 'pop':
      return {
        bg: 'bg-slate-50',
        text: 'text-black',
        cardBg: 'bg-white border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]',
        subtext: 'text-gray-600',
      };
    case 'classic':
      return {
        bg: 'bg-white',
        text: 'text-gray-900',
        cardBg: 'bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
        subtext: 'text-gray-500',
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-900',
        cardBg: 'bg-white border border-gray-200 shadow-lg',
        subtext: 'text-gray-400',
      };
  }
};

export default function FindIdPage() {
  const { step, foundEmail, isLoading } = useFindIdStore();
  const { handlePassAuth } = useFindIdLogic();
  const { theme, setTheme } = useThemeStore();
  const themeStyles = getThemeStyles(theme);

  const steps = [
    { number: 1, label: "본인 인증", active: step === 1 },
    { number: 2, label: "이메일 확인", active: step === 2 },
  ];

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text}`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      <div className="flex flex-col items-center pt-28 pb-20">
        <PageTitle
          title={theme === 'christmas' ? '🎄 아이디 찾기' : '아이디 찾기'}
          subtitle="가입 시 등록한 휴대폰 번호로 본인 인증 후 이메일을 확인하세요."
        />

        <div className={`w-full max-w-xl ${themeStyles.cardBg} rounded-2xl p-10 space-y-8`}>
          <PageSteps steps={steps} />

          {step === 1 && <FindIdForm onPassAuth={handlePassAuth} isLoading={isLoading} />}
          {step === 2 && <FindIdResult email={foundEmail} />}

          <p className={`text-xs ${themeStyles.subtext} text-center`}>
            명의자 정보가 다르면 아이디 찾기가 제한될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
