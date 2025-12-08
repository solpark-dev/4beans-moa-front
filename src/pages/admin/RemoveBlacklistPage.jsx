// src/pages/admin/RemoveBlacklistPage.jsx
import { useRemoveBlacklistLogic } from "@/hooks/admin/useRemoveBlacklist";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function RemoveBlacklistPage() {
  const {
    userId,
    reason,
    submitting,
    error,
    handleChangeReason,
    handleSubmit,
    handleCancel,
  } = useRemoveBlacklistLogic();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <section className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
              MoA 관리자 · 블랙리스트 해제
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
              블랙리스트 상태를 해제하고
              <br />
              <span className="text-amber-100">
                회원의 이용 제한을 풀 수 있습니다
              </span>
            </h1>
            <p className="text-sm sm:text-base text-amber-50/90 leading-relaxed max-w-md mx-auto md:mx-0">
              해제 사유를 남겨 두면 이후 감사·이력 확인 시 도움을 줄 수
              있습니다. 신중하게 확인한 뒤 해제해 주세요.
            </p>
          </div>

          <Card className="bg-white/95 border border-amber-100 shadow-xl rounded-3xl w-full max-w-md">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
                    BLACKLIST RELEASE
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    블랙리스트 해제 후에는 해당 계정의 서비스 이용이 다시
                    허용됩니다.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                계정 상태와 해제 사유를 다시 한 번 검토한 뒤 진행해 주세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="mt-8 flex justify-center">
          <Card className="w-full max-w-3xl shadow-md border-slate-200 rounded-2xl">
            <CardHeader className="border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
              <CardTitle className="text-lg font-semibold text-slate-900">
                블랙리스트 해제 정보 확인
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-6">
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  회원 아이디(이메일)
                </label>
                <Input
                  value={userId}
                  readOnly
                  className="h-10 bg-slate-100 border border-slate-300 text-slate-500"
                />
                <p className="text-[11px] text-slate-400">
                  회원 상세에서 이동한 계정만 해제할 수 있습니다.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  해제 사유
                  <span className="ml-1 text-xs text-slate-400">
                    (필수, 내부 참고용)
                  </span>
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => handleChangeReason(e.target.value)}
                  rows={4}
                  className="resize-none bg-white border border-slate-300 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                  placeholder="해제 사유를 입력하세요. (예: 오인 신고, 본인 확인 완료 등)"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 h-10 rounded-lg border-slate-200 text-slate-700"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  취소
                </Button>
                <Button
                  type="button"
                  className="px-5 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "해제 처리 중..." : "블랙리스트 해제"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
