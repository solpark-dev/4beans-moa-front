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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isBackupMode ? "백업 코드로 로그인" : "Google OTP 인증"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            로그인 완료를 위해 인증 코드를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={onSwitchOtp}
              className={`flex-1 py-1.5 rounded-md ${
                isBackupMode
                  ? "text-slate-500"
                  : "bg-white text-slate-900 shadow-sm"
              }`}
            >
              OTP 코드
            </button>
            <button
              type="button"
              onClick={onSwitchBackup}
              className={`flex-1 py-1.5 rounded-md ${
                isBackupMode
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              백업 코드
            </button>
          </div>

          <p className="text-sm text-slate-600">
            {isBackupMode
              ? "휴대폰이 없어도 로그인할 수 있는 백업 코드를 입력해주세요."
              : "Google Authenticator 앱에 표시된 6자리 코드를 입력하세요."}
          </p>

          <Input
            value={otpCode}
            maxLength={isBackupMode ? 16 : 6}
            inputMode={isBackupMode ? "text" : "numeric"}
            placeholder={
              isBackupMode ? "백업 코드 입력 (예: X7K9-AB12)" : "6자리 숫자 입력"
            }
            className="text-center tracking-[0.4em] text-lg"
            onChange={(e) => onChangeCode(e.target.value)}
          />
          {errors.otp && (
            <p className="text-xs text-red-500 text-center">{errors.otp}</p>
          )}

          <Button
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={loading || !otpCode.trim()}
          >
            {loading ? "인증 중..." : "인증 완료"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
