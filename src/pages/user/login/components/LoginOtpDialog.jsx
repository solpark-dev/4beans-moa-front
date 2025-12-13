import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginOtpDialog({
  open,
  isBackupMode,
  otpCode,
  errors,
  onOpenChange,
  onSwitchOtp,
  onSwitchBackup,
  onChangeCode,
  onConfirm,
  loading,
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onOpenChange();
      }}
    >
      <DialogContent className="max-w-sm p-0">
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-[28px]">
          <DialogHeader className="px-8 pt-8 pb-2">
            <DialogTitle className="text-lg font-black text-slate-900">
              {isBackupMode
                ? "백업 코드로 인증을 진행해주세요"
                : "Google OTP 인증"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              보안을 위해 추가 인증이 필요합니다. 인증 코드 또는 백업 코드를
              사용해 본인 인증을 완료해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center gap-3 px-6 pb-4">
            <button
              type="button"
              onClick={onSwitchOtp}
              className={`flex-1 py-2 rounded-2xl border-2 border-black font-black text-[11px] uppercase tracking-[0.3em] ${
                isBackupMode ? "text-slate-500" : "bg-white text-slate-900"
              }`}
            >
              OTP 코드
            </button>
            <button
              type="button"
              onClick={onSwitchBackup}
              className={`flex-1 py-2 rounded-2xl border-2 border-black font-black text-[11px] uppercase tracking-[0.3em] ${
                isBackupMode ? "bg-white text-slate-900" : "text-slate-500"
              }`}
            >
              백업 코드
            </button>
          </div>

          <div className="space-y-4 px-8 pb-6">
            <p className="text-sm text-slate-500 text-center">
              {isBackupMode
                ? "OTP 앱을 사용할 수 없는 경우 백업 코드를 입력해주세요."
                : "Google Authenticator 앱에 표시된 6자리 코드를 입력해주세요."}
            </p>

            <Input
              value={otpCode}
              maxLength={isBackupMode ? 16 : 6}
              inputMode={isBackupMode ? "text" : "numeric"}
              placeholder={
                isBackupMode
                  ? "백업 코드 입력 (예: X7K9-AB12)"
                  : "6자리 인증 코드 입력"
              }
              className="text-center tracking-[0.4em] text-lg border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onChange={(e) => onChangeCode(e.target.value)}
            />

            {errors.otp && (
              <p className="text-xs text-red-500 text-center">{errors.otp}</p>
            )}

            <Button
              className="w-full h-12 bg-indigo-600 text-white font-black rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
              onClick={onConfirm}
              disabled={loading || !otpCode.trim()}
            >
              {loading ? "인증 중..." : "인증 완료"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
