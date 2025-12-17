import React from "react";
import { useThemeStore } from "@/store/themeStore";

const BTN =
  "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-black font-black text-sm hover:bg-slate-50 active:translate-y-[1px]";

// 테마별 스타일
const loginHistoryThemeStyles = {
  pop: {
    titleBar: "h-[2px] bg-black",
    headerBorder: "border-b-2 border-black",
    rowBorder: "border-b border-black/10",
  },
  christmas: {
    titleBar: "h-[2px] bg-gray-200",
    headerBorder: "border-b border-gray-200",
    rowBorder: "border-b border-gray-200",
  },
};

export function LoginHistoryCard({ loginHistory, onBack }) {
  const { theme } = useThemeStore();
  const themeStyle = loginHistoryThemeStyles[theme] || loginHistoryThemeStyles.pop;
  const items =
    loginHistory?.items ||
    loginHistory?.data?.items ||
    loginHistory?.list ||
    loginHistory?.data ||
    [];

  const total =
    loginHistory?.total ||
    loginHistory?.data?.total ||
    loginHistory?.pagination?.total ||
    items.length;

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black tracking-widest text-sm">LOGIN HISTORY</p>
          <div className={`mt-4 ${themeStyle.titleBar} w-full`} />
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-700 font-bold">
        최근 로그인 이력 {total ?? 0}건
      </p>

      <div className="mt-4 border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white">
            <tr className={themeStyle.headerBorder}>
              <th className="text-left p-3 font-black">일시</th>
              <th className="text-left p-3 font-black">결과</th>
              <th className="text-left p-3 font-black">IP</th>
              <th className="text-left p-3 font-black">유형</th>
              <th className="text-left p-3 font-black">User-Agent</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(items) && items.length > 0 ? (
              items.map((row, idx) => (
                <tr key={idx} className={themeStyle.rowBorder}>
                  <td className="p-3 font-bold text-slate-800">
                    {row?.createdAt || row?.dateTime || row?.loginAt || "-"}
                  </td>
                  <td className="p-3 font-black">
                    {row?.success === false || row?.result === "FAIL"
                      ? "실패"
                      : "성공"}
                  </td>
                  <td className="p-3 font-bold">{row?.ip || "-"}</td>
                  <td className="p-3 font-bold">
                    {row?.provider || row?.type || "-"}
                  </td>
                  <td className="p-3 font-bold truncate max-w-[220px]">
                    {row?.userAgent || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 font-bold text-slate-700" colSpan={5}>
                  로그인 이력이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
