import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const otpDialogThemeStyles = {
  default: {
    primaryButton: "bg-indigo-600 hover:bg-indigo-700",
  },
  christmas: {
    primaryButton: "bg-red-800 hover:bg-red-900",
  },
};

export function OtpDialog({
  open,
  onOpenChange,
  otp,
  actions,
  handleOtpConfirm,
}) {
  const { theme } = useThemeStore();
  const themeStyle = otpDialogThemeStyles[theme] || otpDialogThemeStyles.default;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {otp.mode === "disable" ? "Google OTP 해제" : "Google OTP 설정"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-slate-600 leading-relaxed">
            {otp.mode === "disable"
              ? "등록된 Google OTP를 해제하려면 아래에 인증용 6자리 코드를 입력해주세요."
              : "Google Authenticator 앱을 켜고 QR 코드를 스캔한 뒤 인증용 6자리 코드를 입력해주세요."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          {otp.mode === "enable" && otp.qrUrl && (
            <div className="flex justify-center">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                <QRCodeSVG value={otp.qrUrl} size={180} />
              </div>
            </div>
          )}
          <p className="text-sm text-slate-600 leading-relaxed">
            {otp.mode === "disable"
              ? "등록된 Google OTP를 해제하려면 아래에 인증용 6자리 코드를 입력해주세요."
              : "Google Authenticator 앱을 켜고 QR 코드를 스캔한 뒤 인증용 6자리 코드를 입력해주세요."}
          </p>
          <Input
            type="text"
            value={otp.code}
            maxLength={6}
            inputMode="numeric"
            className="text-center tracking-[0.4em] text-lg"
            onChange={(e) => actions.otp.changeCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleOtpConfirm();
              }
            }}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={actions.otp.closeModal}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleOtpConfirm}
              disabled={otp.loading || otp.code.length !== 6}
              className={`${themeStyle.primaryButton} text-white`}
            >
              인증 완료
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
