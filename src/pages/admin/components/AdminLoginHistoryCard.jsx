import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KeyRound } from "lucide-react";

export default function AdminLoginHistoryCard({ loginHistory }) {
  const {
    state: { items, page, pages, pageCount, loading, totalCount },
    actions: { goFirst, goPrev, goPage, goNextBlock, goLast },
  } = loginHistory;

  return (
    <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-4 border-b border-slate-200">
        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em] flex items-center gap-2">
          <KeyRound className="w-4 h-4" />
          LOGIN HISTORY
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500">
            로그인 이력 {totalCount}건
          </span>
        </div>

        {loading && (
          <div className="py-8 text-center text-sm text-slate-500">
            불러오는 중...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-400">
            로그인 이력이 없습니다.
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2 px-2 text-left font-semibold text-slate-600">
                      일시
                    </th>
                    <th className="py-2 px-2 text-left font-semibold text-slate-600">
                      결과
                    </th>
                    <th className="py-2 px-2 text-left font-semibold text-slate-600">
                      IP
                    </th>
                    <th className="py-2 px-2 text-left font-semibold text-slate-600">
                      타입
                    </th>
                    <th className="py-2 px-2 text-left font-semibold text-slate-600">
                      User-Agent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={`${item.loginAt}-${idx}`}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-2 px-2 text-slate-800 whitespace-nowrap">
                        {item.loginAtFormatted}
                      </td>
                      <td
                        className={`py-2 px-2 font-semibold ${
                          item.success ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {item.successText}
                      </td>
                      <td className="py-2 px-2 text-slate-700 whitespace-nowrap">
                        {item.loginIp || "-"}
                      </td>
                      <td className="py-2 px-2 text-slate-700 whitespace-nowrap">
                        {item.loginType || "-"}
                      </td>
                      <td className="py-2 px-2 text-slate-500 max-w-[220px] truncate">
                        {item.userAgent || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={goFirst}
                disabled={page <= 1}
              >
                {"<<"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={goPrev}
                disabled={page <= 1}
              >
                {"<"}
              </Button>

              {pages.map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  className={`h-8 min-w-[2rem] text-xs ${
                    p === page ? "bg-indigo-600 text-white" : "text-slate-700"
                  }`}
                  onClick={() => goPage(p)}
                >
                  {p}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={goNextBlock}
                disabled={page >= pageCount}
              >
                {">"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={goLast}
                disabled={page >= pageCount}
              >
                {">>"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
