import { Button } from "@/components/ui/button";

export function OtpSection({ otp, backup, actions }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
        Security · Google OTP
      </p>

      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-bold ${
            otp.enabled ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          {otp.enabled ? "OTP 사용중" : "OTP 미사용"}
        </span>

        <div className="flex gap-1.5">
          {!otp.enabled && (
            <Button
              type="button"
              onClick={actions.otp.openSetup}
              className="
                h-7 px-3 text-[11px] font-black
                bg-indigo-600 text-white
                border-2 border-black rounded-lg
                shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                hover:translate-x-[1px] hover:translate-y-[1px]
              "
            >
              OTP 설정
            </Button>
          )}

          {otp.enabled && (
            <>
              <Button
                type="button"
                disabled={backup.issued || backup.loading}
                onClick={backup.issued ? undefined : backup.issueBackupCodes}
                className={`
                  h-7 px-3 text-[11px] font-black
                  border-2 border-black rounded-lg
                  ${
                    backup.issued
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-white text-indigo-700 hover:bg-indigo-50"
                  }
                `}
              >
                {backup.issued ? "발급완료" : "백업코드"}
              </Button>

              <Button
                type="button"
                onClick={actions.otp.prepareDisable}
                className="
                  h-7 px-3 text-[11px] font-black
                  border-2 border-black rounded-lg
                  bg-white text-red-600 hover:bg-red-50
                "
              >
                해제
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
