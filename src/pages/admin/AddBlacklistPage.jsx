import { useAddBlacklistLogic } from "@/hooks/admin/useAddBlacklist";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

export default function AddBlacklistPage() {
  const {
    userId,
    reasonType,
    reasonDetail,
    submitting,
    error,
    handleChangeUserId,
    handleChangeReasonType,
    handleChangeReasonDetail,
    handleSubmit,
    handleCancel,
  } = useAddBlacklistLogic();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-red-300 mr-2" />
              MoA 관리자 · 블랙리스트 관리
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
              위험 계정을 차단해서
              <br />
              <span className="text-indigo-100">서비스를 안전하게 지켜요</span>
            </h1>
            <p className="text-sm sm:text-base text-indigo-50/90 leading-relaxed max-w-md mx-auto md:mx-0">
              결제 사기, 욕설·신고 누적, 정책 위반 등을 사유로 블랙리스트를
              등록하면, 향후 서비스 이용을 제한할 수 있습니다.
            </p>
          </div>

          <Card className="bg-white/95 border border-indigo-100 shadow-xl rounded-3xl w-full max-w-md">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
                    BLACKLIST NOTICE
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    블랙리스트 등록 시 해당 계정의 서비스 이용이 제한될 수
                    있습니다.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                사유와 대상을 정확히 확인한 뒤 등록해 주세요.
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
                블랙리스트 대상 및 사유 입력
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
                  onChange={(e) => handleChangeUserId(e.target.value)}
                  placeholder="user001@example.com"
                  className="h-10 bg-white border border-slate-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  사유 구분
                </label>
                <Select
                  value={reasonType}
                  onValueChange={(value) => handleChangeReasonType(value)}
                >
                  <SelectTrigger className="h-10 bg-white border border-slate-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-500">
                    <SelectValue placeholder="사유를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYMENT_FRAUD">
                      결제 사기 / 악용
                    </SelectItem>
                    <SelectItem value="ABUSE_REPORT">
                      욕설 / 신고 누적
                    </SelectItem>
                    <SelectItem value="POLICY_VIOLATION">
                      서비스 정책 위반
                    </SelectItem>
                    <SelectItem value="ETC">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  상세 사유
                  <span className="ml-1 text-xs text-slate-400">
                    (선택 입력, 내부 참고용)
                  </span>
                </label>
                <Textarea
                  value={reasonDetail}
                  onChange={(e) => handleChangeReasonDetail(e.target.value)}
                  rows={4}
                  className="resize-none bg-white border border-slate-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                  placeholder="상세 사유를 입력하세요."
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
                  className="px-5 h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "등록 중..." : "블랙리스트 등록"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
