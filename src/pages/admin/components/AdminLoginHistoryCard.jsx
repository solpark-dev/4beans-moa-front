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
    <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden">
      <CardHeader className="pb-6 border-b-4 border-black bg-slate-50">
        <CardTitle className="text-sm font-black uppercase tracking-[0.18em] flex items-center gap-3 text-black">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <KeyRound className="w-4 h-4 text-black" />
          </span>
          LOGIN HISTORY
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-slate-700">
            로그인 이력 {totalCount}건
          </span>
        </div>

        {loading && (
          <div className="py-10 text-center text-sm font-bold text-slate-600">
            불러오는 중...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="py-10 text-center text-sm font-bold text-slate-500">
            로그인 이력이 없습니다.
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-sm bg-white">
                <thead>
                  <tr className="border-b-4 border-black bg-slate-100">
                    <th className="py-3 px-3 text-left font-black text-black">
                      일시
                    </th>
                    <th className="py-3 px-3 text-left font-black text-black">
                      결과
                    </th>
                    <th className="py-3 px-3 text-left font-black text-black">
                      IP
                    </th>
                    <th className="py-3 px-3 text-left font-black text-black">
                      타입
                    </th>
                    <th className="py-3 px-3 text-left font-black text-black">
                      User-Agent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={`${item.loginAt}-${idx}`}
                      className="border-b border-black/10 hover:bg-slate-100 transition-colors"
                    >
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {item.loginAtFormatted}
                      </td>
                      <td
                        className={`py-3 px-3 font-black whitespace-nowrap ${
                          item.success ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {item.successText}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                        {item.loginIp || "-"}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                        {item.loginType || "-"}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-600 max-w-[220px] truncate">
                        {item.userAgent || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xs font-black bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl hover:brightness-95"
                onClick={goFirst}
                disabled={page <= 1}
              >
                {"<<"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xs font-black bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl hover:brightness-95"
                onClick={goPrev}
                disabled={page <= 1}
              >
                {"<"}
              </Button>

              {pages.map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  className={`h-10 min-w-[2.5rem] text-xs font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl hover:brightness-95 ${
                    p === page
                      ? "bg-pink-500 text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => goPage(p)}
                >
                  {p}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xs font-black bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl hover:brightness-95"
                onClick={goNextBlock}
                disabled={page >= pageCount}
              >
                {">"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xs font-black bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl hover:brightness-95"
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
