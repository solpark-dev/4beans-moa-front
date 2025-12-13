import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import OutlineCard from "./OutlineCard";

export default function AdminUserDetailLoginHistorySection({
  historyLoading,
  historyItems,
  historyTotalCount,
  historyPage,
  historyPages,
  historyPageCount,
  goHistoryFirst,
  goHistoryPrev,
  goHistoryPage,
  goHistoryNextBlock,
  goHistoryLast,
}) {
  return (
    <OutlineCard>
      <CardHeader className="pb-3 border-b-2 border-slate-900">
        <CardTitle className="text-xs font-black tracking-[0.18em] text-slate-900 flex items-center gap-2">
          <KeyRound className="w-4 h-4" />
          LOGIN HISTORY
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {historyLoading && (
          <div className="py-6 text-center text-sm font-bold text-slate-600">
            불러오는 중..
          </div>
        )}

        {!historyLoading && historyItems.length === 0 && (
          <div className="py-6 text-center text-sm font-bold text-slate-500">
            로그인 이력이 없습니다.
          </div>
        )}

        {!historyLoading && historyItems.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-600">
              <span>최근 로그인 이력 {historyTotalCount}건</span>
            </div>

            <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl">
              <table className="w-full text-sm bg-white">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-50">
                    <th className="py-3 px-3 text-left font-black text-slate-900">
                      일시
                    </th>
                    <th className="py-3 px-3 text-left font-black text-slate-900">
                      결과
                    </th>
                    <th className="py-3 px-3 text-left font-black text-slate-900">
                      IP
                    </th>
                    <th className="py-3 px-3 text-left font-black text-slate-900">
                      유형
                    </th>
                    <th className="py-3 px-3 text-left font-black text-slate-900">
                      User-Agent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyItems.map((item, idx) => (
                    <tr
                      key={`${item.loginAt}-${idx}`}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="py-3 px-3 text-slate-900 font-bold whitespace-nowrap">
                        {item.loginAtFormatted}
                      </td>
                      <td
                        className={`py-3 px-3 font-black ${
                          item.success ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {item.successText}
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-bold whitespace-nowrap">
                        {item.loginIp || "-"}
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-bold whitespace-nowrap">
                        {item.loginType || "-"}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-bold max-w-[220px] truncate">
                        {item.userAgent || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              <Button
                type="button"
                className="h-10 w-10 rounded-2xl border-2 border-slate-900 bg-white text-slate-900 font-black hover:bg-slate-50"
                onClick={goHistoryFirst}
                disabled={historyPage <= 1}
              >
                {"<<"}
              </Button>
              <Button
                type="button"
                className="h-10 w-10 rounded-2xl border-2 border-slate-900 bg-white text-slate-900 font-black hover:bg-slate-50"
                onClick={goHistoryPrev}
                disabled={historyPage <= 1}
              >
                {"<"}
              </Button>

              {historyPages.map((p) => (
                <Button
                  key={p}
                  type="button"
                  className={`h-10 min-w-[2.5rem] rounded-2xl border-2 border-slate-900 font-black ${
                    p === historyPage
                      ? "bg-slate-900 text-white hover:bg-slate-900"
                      : "bg-white text-slate-900 hover:bg-slate-50"
                  }`}
                  onClick={() => goHistoryPage(p)}
                >
                  {p}
                </Button>
              ))}

              <Button
                type="button"
                className="h-10 w-10 rounded-2xl border-2 border-slate-900 bg-white text-slate-900 font-black hover:bg-slate-50"
                onClick={goHistoryNextBlock}
                disabled={historyPage >= historyPageCount}
              >
                {">"}
              </Button>
              <Button
                type="button"
                className="h-10 w-10 rounded-2xl border-2 border-slate-900 bg-white text-slate-900 font-black hover:bg-slate-50"
                onClick={goHistoryLast}
                disabled={historyPage >= historyPageCount}
              >
                {">>"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </OutlineCard>
  );
}
