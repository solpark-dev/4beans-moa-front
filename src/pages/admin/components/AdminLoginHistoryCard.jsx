import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KeyRound } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const historyCardThemeStyles = {
  default: {
    iconBg: "bg-cyan-400",
    activePage: "bg-pink-500 text-white",
    hoverBg: "hover:bg-slate-100",
    headerBorder: "border-b-4 border-black",
    tableBorder: "border-b-4 border-black",
    rowBorder: "border-b border-black/10",
  },
  christmas: {
    iconBg: "bg-green-800",
    activePage: "bg-red-800 text-red-100",
    hoverBg: "hover:bg-red-50",
    headerBorder: "border-b border-gray-200",
    tableBorder: "border-b border-gray-200",
    rowBorder: "border-b border-gray-200",
  },
};

export default function AdminLoginHistoryCard({ loginHistory }) {
  const { theme } = useThemeStore();
  const themeStyle = historyCardThemeStyles[theme] || historyCardThemeStyles.default;
  const {
    state: { items, page, pages, pageCount, loading, totalCount },
    actions: { goFirst, goPrev, goPage, goNextBlock, goLast },
  } = loginHistory;

  return (
    <Card className="bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden">
      <CardHeader className={`pb-6 ${themeStyle.headerBorder} bg-slate-50`}>
        <CardTitle className="text-sm font-black uppercase tracking-[0.18em] flex items-center gap-3 text-black">
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${themeStyle.iconBg} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
            <KeyRound className={`w-4 h-4 ${theme === 'christmas' ? 'text-green-100' : 'text-black'}`} />
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
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
              <table className="w-full text-sm bg-white">
                <thead>
                  <tr className={`${themeStyle.tableBorder} bg-slate-100`}>
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
                      className={`${themeStyle.rowBorder} ${themeStyle.hoverBg} transition-colors`}
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
                className="h-10 w-10 text-xs font-black bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-xl hover:brightness-95"
                onClick={goFirst}
                disabled={page <= 1}
              >
                {"<<"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xs font-black bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-xl hover:brightness-95"
                onClick={goPrev}
                disabled={page <= 1}
              >
                {"<"}
              </Button>

              {pages.map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  className={`h-10 min-w-[2.5rem] text-xs font-black border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-xl hover:brightness-95 ${
                    p === page
                      ? themeStyle.activePage
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
                className="h-10 w-10 text-xs font-black bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-xl hover:brightness-95"
                onClick={goNextBlock}
                disabled={page >= pageCount}
              >
                {">"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xs font-black bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] rounded-xl hover:brightness-95"
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
