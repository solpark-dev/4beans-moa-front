// src/pages/user/UpdatePwdPage.jsx

import { useEffect } from "react";
import { useUpdatePwdStore } from "@/store/user/updatePwdStore";
import { useUpdatePwdLogic } from "@/hooks/user/useUpdatePassword";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export default function UpdatePwdPage() {
  const {
    currentPassword,
    newPassword,
    newPasswordConfirm,
    modalOpen,
    stepVerified,
    error,
    setModal,
    resetAll,
    openModal,
  } = useUpdatePwdStore();

  const { verify, update, handleChange, loading } = useUpdatePwdLogic();
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
    <div className="w-full min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
              MoA 계정 보안 · 비밀번호 재설정
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3 drop-shadow-md flex items-center justify-center lg:justify-start gap-2">
              <KeyRound className="w-7 h-7 text-indigo-100" />
              비밀번호 변경
            </h2>
            <p className="text-sm sm:text-base text-indigo-50/90 leading-relaxed max-w-md mx-auto lg:mx-0">
              안전하게 사용하려면 현재 비밀번호를 확인하고 새 비밀번호를 설정해 주세요.
              잘못된 비밀번호를 입력하면 재인증이 필요할 수 있습니다.
            </p>
          </div>

          <div className="flex-1 w-full max-w-md">
            <Card className="bg-white border border-gray-100 shadow-2xl rounded-3xl">
              <CardContent className="p-7 space-y-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold">
                      1
                    </span>
                    현재 비밀번호 확인
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      stepVerified ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {stepVerified ? "완료" : "진행 중"}
                  </span>
                </div>

                {!stepVerified && (
                  <div className="text-center py-6 text-sm text-slate-500">
                    먼저 팝업에서 현재 비밀번호를 입력해 본인 인증을 해주세요.
                    <br className="hidden sm:block" />
                    인증이 끝나면 새 비밀번호로 전환할 수 있습니다.
                  </div>
                )}

                {stepVerified && (
                  <div className="space-y-5">
                    <div>
                      <Label className="text-sm text-slate-800">
                        새 비밀번호
                      </Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) =>
                          handleChange("newPassword", e.target.value)
                        }
                        className="mt-1 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                        placeholder="영문·숫자·특수문자 포함 8~20자 입력"
                      />
                      {error.rule && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.rule}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm text-slate-800">
                        새 비밀번호 확인
                      </Label>
                      <Input
                        type="password"
                        value={newPasswordConfirm}
                        onChange={(e) =>
                          handleChange("newPasswordConfirm", e.target.value)
                        }
                        className="mt-1 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                        placeholder="다시 한 번 입력해주세요"
                      />
                      {error.confirm && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.confirm}
                        </p>
                      )}
                    </div>

                    <Button
                      className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 rounded-xl"
                      onClick={update}
                      disabled={isUpdateDisabled}
                    >
                      비밀번호 변경
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Dialog open={modalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-sm bg-white border border-slate-200 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              현재 비밀번호 확인
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-sm">
              본인 인증을 위해 현재 사용 중인 비밀번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <Label className="text-xs text-slate-700">현재 비밀번호</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
            />
            {error.current && (
              <p className="text-red-500 text-xs">{error.current}</p>
            )}

            <Button
              className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 rounded-xl"
              onClick={verify}
              disabled={isVerifyDisabled}
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
