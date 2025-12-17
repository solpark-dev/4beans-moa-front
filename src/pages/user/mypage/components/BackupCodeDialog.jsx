import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const backupCodeThemeStyles = {
  pop: {
    primaryButton: "bg-indigo-600 hover:bg-indigo-700",
  },
  christmas: {
    primaryButton: "bg-[#c41e3a] hover:bg-red-700",
  },
};

export function BackupCodeDialog({ backup }) {
  const { theme } = useThemeStore();
  const themeStyle = backupCodeThemeStyles[theme] || backupCodeThemeStyles.pop;
  return (
    <Dialog
      open={backup.open}
      onOpenChange={(open) => {
        if (!open) backup.close();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Google OTP 백업 코드</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            OTP 기기를 분실했을 때만 사용할 일회용 로그인 코드입니다. 잃어버리지
            않도록 안전한 곳에 보관해주세요.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-64 overflow-y-auto space-y-1">
            {backup.codes.length > 0 ? (
              backup.codes.map((code, index) => (
                <div
                  key={`${code}-${index}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-mono tracking-widest text-slate-800">
                    {code}
                  </span>
                  <span className="text-xs text-slate-400">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-slate-400">
                아직 발급된 백업 코드가 없습니다.
              </div>
            )}
          </div>

          <div className="flex justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={backup.copyAll}
              disabled={!backup.codes.length}
            >
              전체 복사
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={backup.downloadTxt}
                disabled={!backup.codes.length}
              >
                TXT 저장
              </Button>
              <Button
                type="button"
                className={`${themeStyle.primaryButton} text-white`}
                onClick={backup.close}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
