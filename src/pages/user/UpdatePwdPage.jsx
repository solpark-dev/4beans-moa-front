// src/pages/user/UpdatePwdPage.jsx

import { useEffect } from "react";
import { useUpdatePwdStore } from "@/store/user/updatePwdStore";
import { useUpdatePwdLogic } from "@/services/logic/updatePwdLogic";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col items-center pt-28 pb-20 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">비밀번호 변경</h2>
      <p className="text-gray-500 mb-8 text-sm">
        안전한 계정 관리를 위해 비밀번호를 주기적으로 변경해 주세요.
      </p>

      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6 p-8">
          {!stepVerified && (
            <div className="text-center py-10 text-gray-500">
              현재 비밀번호 확인 중...
            </div>
          )}

          {stepVerified && (
            <div className="space-y-4">
              <div>
                <Label>새 비밀번호</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setField("newPassword", e.target.value)}
                  className="mt-1"
                />
                {error.rule && (
                  <p className="text-red-500 text-xs mt-1">{error.rule}</p>
                )}
              </div>

              <div>
                <Label>새 비밀번호 확인</Label>
                <Input
                  type="password"
                  value={newPasswordConfirm}
                  onChange={(e) =>
                    setField("newPasswordConfirm", e.target.value)
                  }
                  className="mt-1"
                />
                {error.confirm && (
                  <p className="text-red-500 text-xs mt-1">{error.confirm}</p>
                )}
              </div>

              <Button className="w-full mt-3" onClick={logic.update}>
                비밀번호 변경
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>현재 비밀번호 확인</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setField("currentPassword", e.target.value)}
            />
            {error.current && (
              <p className="text-red-500 text-xs">{error.current}</p>
            )}

            <Button className="w-full mt-3" onClick={logic.verify}>
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
