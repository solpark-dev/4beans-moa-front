// src/pages/user/UpdatePwdPage.jsx

import { useEffect } from "react";
import { useUpdatePwdStore } from "@/store/user/updatePwdStore";
import { useUpdatePwdLogic } from "@/services/logic/updatePwdLogic";

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
    setField,
    setModal,
  } = useUpdatePwdStore();

  const logic = useUpdatePwdLogic();

  const closeModal = () => {
    setModal(false);
    window.history.back();
  };

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key !== "Enter") return;

      if (!stepVerified) {
        logic.verify();
      } else {
        logic.update();
      }
    };

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [stepVerified, logic]);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          {/* 왼쪽 설명 영역 */}
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
              안전한 계정 사용을 위해 주기적으로 비밀번호를 변경해 주세요. 현재
              비밀번호 확인 후, 새 비밀번호를 설정할 수 있습니다.
            </p>
          </div>

          {/* 오른쪽 카드 영역 */}
          <div className="flex-1 w-full max-w-md">
            <Card className="bg-white border border-gray-100 shadow-2xl rounded-3xl">
              <CardContent className="p-7 space-y-6">
                {!stepVerified && (
                  <div className="text-center py-6 text-sm text-slate-500">
                    먼저 팝업에서 현재 비밀번호를 한 번 확인하면,
                    <br className="hidden sm:block" />새 비밀번호를 설정할 수
                    있어요.
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
                          setField("newPassword", e.target.value)
                        }
                        className="mt-1 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                        placeholder="영문+숫자+특수문자 포함 8~20자"
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
                          setField("newPasswordConfirm", e.target.value)
                        }
                        className="mt-1 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                        placeholder="한번 더 입력해 주세요"
                      />
                      {error.confirm && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.confirm}
                        </p>
                      )}
                    </div>

                    <Button
                      className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 rounded-xl"
                      onClick={logic.update}
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

      {/* 현재 비밀번호 확인 모달 */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-sm bg-white border border-slate-200 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              현재 비밀번호 확인
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-sm">
              본인 확인을 위해 현재 사용 중인 비밀번호를 입력해 주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <Label className="text-xs text-slate-700">현재 비밀번호</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setField("currentPassword", e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
            />
            {error.current && (
              <p className="text-red-500 text-xs">{error.current}</p>
            )}

            <Button
              className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 rounded-xl"
              onClick={logic.verify}
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
