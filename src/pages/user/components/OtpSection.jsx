import { Button } from "@/components/ui/button";

export function OtpSection({ otp, backup, actions }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
        Security · Google OTP
      </p>
      <div className="flex items-center justify-between">
        <span
          className={
            otp.enabled
              ? "text-sm font-semibold text-emerald-600"
              : "text-sm font-semibold text-slate-400"
          }
        >
          {otp.enabled ? "OTP 사용중" : "OTP 미사용"}
        </span>
        <div className="flex gap-2">
          {!otp.enabled && (
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              onClick={actions.otp.openSetup}
            >
              OTP 설정
            </Button>
          )}

          {otp.enabled && (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={backup.issued || backup.loading}
                className={`h-8 px-3 text-xs rounded-lg ${
                  backup.issued
                    ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50"
                }`}
                onClick={backup.issued ? undefined : backup.issueBackupCodes}
              >
                {backup.issued ? "발급 완료" : "백업 코드 발급"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg"
                onClick={actions.otp.prepareDisable}
              >
                OTP 해제
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
