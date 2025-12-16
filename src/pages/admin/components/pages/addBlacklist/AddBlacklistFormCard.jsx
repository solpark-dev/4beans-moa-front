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
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const blacklistFormThemeStyles = {
  default: {
    headerBorder: "border-b-4 border-black",
    footerBorder: "border-t-4 border-black",
  },
  christmas: {
    headerBorder: "border-b border-gray-200",
    footerBorder: "border-t border-gray-200",
  },
};

export default function AddBlacklistFormCard({
  userId,
  reasonType,
  reasonDetail,
  submitting,
  error,
  onChangeUserId,
  onChangeReasonType,
  onChangeReasonDetail,
  onSubmit,
  onCancel,
}) {
  const { theme } = useThemeStore();
  const themeStyle = blacklistFormThemeStyles[theme] || blacklistFormThemeStyles.default;

  return (
    <section className="relative px-6 md:px-12 pb-24">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden">
          <CardHeader className={`${themeStyle.headerBorder} bg-slate-100`}>
            <CardTitle className="text-xl font-black">
              블랙리스트 대상 및 사유 입력
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-100 border border-gray-200 text-sm font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-black">회원 아이디(이메일)</label>
              <Input
                value={userId}
                onChange={(e) => onChangeUserId(e.target.value)}
                placeholder="user001@example.com"
                className="h-11 border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black">사유 구분</label>
              <Select value={reasonType} onValueChange={onChangeReasonType}>
                <SelectTrigger className="h-11 border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
                  <SelectValue placeholder="사유를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAYMENT_FRAUD">
                    결제 사기 / 악용
                  </SelectItem>
                  <SelectItem value="ABUSE_REPORT">욕설 / 신고 누적</SelectItem>
                  <SelectItem value="POLICY_VIOLATION">
                    서비스 정책 위반
                  </SelectItem>
                  <SelectItem value="ETC">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black">
                상세 사유
                <span className="ml-1 text-xs font-medium text-slate-500">
                  (선택 입력)
                </span>
              </label>
              <Textarea
                value={reasonDetail}
                onChange={(e) => onChangeReasonDetail(e.target.value)}
                rows={4}
                className="resize-none border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
                placeholder="상세 사유를 입력하세요."
              />
            </div>

            <div className={`flex flex-col sm:flex-row sm:justify-end gap-3 pt-6 ${themeStyle.footerBorder}`}>
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] font-black bg-white"
                onClick={onCancel}
                disabled={submitting}
              >
                취소
              </Button>
              <Button
                type="button"
                className="h-11 px-7 bg-red-500 hover:bg-red-500 border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] font-black text-white"
                onClick={onSubmit}
                disabled={submitting}
              >
                {submitting ? "등록 중..." : "블랙리스트 등록"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
