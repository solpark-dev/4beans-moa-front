// src/pages/user/UpdatePwdPage.jsx

import { useEffect } from "react";
import { useUpdatePwdStore } from "@/store/user/updatePwdStore";
import { useUpdatePwdLogic } from "@/hooks/user/useUpdatePassword";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher, ChristmasBackground } from "@/config/themeConfig";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

// Theme-based styles
const getThemeStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return {
        bg: 'bg-transparent',
        text: 'text-gray-900',
        subtext: 'text-slate-700',
        card: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
        section: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(196,30,58,0.1)]',
        input: 'bg-white border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(196,30,58,0.08)] text-slate-900',
        button: 'bg-[#c41e3a] text-white hover:bg-[#a51830] border-[#c41e3a]',
        highlight: 'text-[#c41e3a]',
        stepBg: 'bg-[#c41e3a]',
      };
    case 'dark':
      return {
        bg: 'bg-[#0B1120]',
        text: 'text-white',
        subtext: 'text-gray-400',
        card: 'bg-[#1E293B] border border-gray-700 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
        section: 'bg-[#0F172A] border border-gray-700 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.2)]',
        input: 'bg-[#0F172A] border border-gray-700 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.2)] text-white placeholder:text-gray-500',
        button: 'bg-[#635bff] text-white hover:bg-[#5851e8] border-[#635bff]',
        highlight: 'text-[#635bff]',
        stepBg: 'bg-[#635bff]',
      };
    case 'portrait':
      return {
        bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        card: 'bg-white/80 backdrop-blur-sm border border-pink-200 rounded-3xl shadow-[4px_4px_12px_rgba(255,181,197,0.2)]',
        section: 'bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl shadow-[4px_4px_12px_rgba(255,181,197,0.15)]',
        input: 'bg-white/60 border border-pink-200 rounded-2xl shadow-[4px_4px_12px_rgba(255,181,197,0.1)] text-gray-900',
        button: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] text-white hover:opacity-90 border-transparent',
        highlight: 'text-pink-500',
        stepBg: 'bg-pink-500',
      };
    case 'pop':
      return {
        bg: 'bg-slate-50',
        text: 'text-black',
        subtext: 'text-gray-600',
        card: 'bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)]',
        section: 'bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]',
        input: 'bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black',
        button: 'bg-pink-500 text-white hover:bg-pink-600 border-2 border-black',
        highlight: 'text-pink-500',
        stepBg: 'bg-black',
      };
    case 'classic':
      return {
        bg: 'bg-white',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        card: 'bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
        section: 'bg-white border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(99,91,255,0.08)]',
        input: 'bg-white border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(99,91,255,0.08)] text-gray-900',
        button: 'bg-[#635bff] text-white hover:bg-[#5851e8] border-gray-200',
        highlight: 'text-[#635bff]',
        stepBg: 'bg-[#635bff]',
      };
    default:
      return {
        bg: 'bg-white',
        text: 'text-slate-900',
        subtext: 'text-slate-700',
        card: 'bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        section: 'bg-white border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        input: 'bg-white border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] text-slate-900 placeholder:text-slate-400',
        button: 'bg-slate-900 text-white hover:bg-slate-800 border-gray-200',
        highlight: 'text-slate-900',
        stepBg: 'bg-black',
      };
  }
};

export default function UpdatePwdPage() {
  const { currentPassword, newPassword, newPasswordConfirm, modalOpen, stepVerified, error, setModal, resetAll, openModal } =
    useUpdatePwdStore();
  const { verify, update, handleChange, loading } = useUpdatePwdLogic();
  const { theme, setTheme } = useThemeStore();
  const themeStyles = getThemeStyles(theme);

  const isVerifyDisabled = loading || !currentPassword.trim();
  const isUpdateDisabled =
    loading || !newPassword.trim() || !newPasswordConfirm.trim();

  const closeAndExit = () => {
    resetAll();
    window.history.back();
  };

  useEffect(() => {
    openModal();
    return () => resetAll();
  }, [openModal, resetAll]);

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key !== "Enter") return;

      if (!stepVerified) {
        verify();
      } else {
        update();
      }
    };

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [stepVerified, update, verify]);

  const handleDialogChange = (open) => {
    if (open) {
      openModal();
      return;
    }

    if (stepVerified) {
      setModal(false);
      return;
    }

    closeAndExit();
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text}`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-16">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          <div className={`${themeStyles.card} p-8 space-y-4`}>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1 rounded-xl ${theme === 'dark' ? 'border border-gray-700 bg-[#0F172A]' : 'border border-gray-200 bg-white'} text-xs font-black tracking-wide`}>
                MoA 계정 보안 · 비밀번호 재설정
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-black leading-tight flex items-center gap-3 ${themeStyles.text}`}>
              <KeyRound className={`w-7 h-7 ${themeStyles.highlight}`} />
              {theme === 'christmas' ? '🎄 비밀번호 변경' : '비밀번호 변경'}
            </h2>
            <p className={`text-sm sm:text-base ${themeStyles.subtext} leading-relaxed`}>
              안전하게 사용하려면 현재 비밀번호를 확인하고 새 비밀번호를 설정해 주세요.
            </p>
          </div>

          <div className={`${themeStyles.card} p-8 space-y-6`}>
            <div className={`flex items-center justify-between text-xs font-semibold ${themeStyles.section} px-4 py-3`}>
              <span className="flex items-center gap-2">
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${themeStyles.stepBg} text-white font-bold`}>
                  1
                </span>
                현재 비밀번호 확인
              </span>
              <span
                className={`text-xs font-black ${stepVerified ? "text-emerald-600" : themeStyles.subtext
                  }`}
              >
                {stepVerified ? "완료" : "진행 중"}
              </span>
            </div>

            {!stepVerified && (
              <div className={`${themeStyles.section} p-6 text-center text-sm ${themeStyles.subtext}`}>
                먼저 입력란에 현재 비밀번호를 입력해 본인 인증을 해주세요.
                <br className="hidden sm:block" />
                인증이 끝나면 새 비밀번호를 변경할 수 있습니다.
              </div>
            )}

            {stepVerified && (
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  update();
                }}
              >
                <div className={`${themeStyles.section} p-6 space-y-4`}>
                  <div className="space-y-1.5">
                    <Label className={`text-sm ${themeStyles.text}`}>새 비밀번호</Label>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) =>
                        handleChange("newPassword", e.target.value)
                      }
                      className={`${themeStyles.input} mt-1`}
                      placeholder="영문·숫자·특수문자 조합 8~20자"
                    />
                    {error.rule && (
                      <p className="text-red-500 text-xs mt-1">{error.rule}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className={`text-sm ${themeStyles.text}`}>
                      새 비밀번호 확인
                    </Label>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      value={newPasswordConfirm}
                      onChange={(e) =>
                        handleChange("newPasswordConfirm", e.target.value)
                      }
                      className={`${themeStyles.input} mt-1`}
                      placeholder="같은 비밀번호를 입력해 주세요"
                    />
                    {error.confirm && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.confirm}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  className={`w-full ${themeStyles.button} rounded-2xl font-black h-11`}
                  type="submit"
                  disabled={isUpdateDisabled}
                >
                  비밀번호 변경
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className={`max-w-sm ${themeStyles.card}`}>
          <DialogHeader>
            <DialogTitle className={`${themeStyles.text} flex items-center gap-2`}>
              <KeyRound className={`w-5 h-5 ${themeStyles.highlight}`} />
              현재 비밀번호 확인
            </DialogTitle>
            <DialogDescription className={`${themeStyles.subtext} text-sm`}>
              본인 인증을 위해 현재 비밀번호를 입력해 주세요.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-3 mt-4"
            onSubmit={(event) => {
              event.preventDefault();
              verify();
            }}
          >
            <Label className={`text-xs ${themeStyles.subtext}`}>현재 비밀번호</Label>
            <Input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              className={themeStyles.input}
            />
            {error.current && (
              <p className="text-red-500 text-xs">{error.current}</p>
            )}

            <Button
              className={`w-full ${themeStyles.button} rounded-2xl font-black h-11`}
              type="submit"
              disabled={isVerifyDisabled}
            >
              확인
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
