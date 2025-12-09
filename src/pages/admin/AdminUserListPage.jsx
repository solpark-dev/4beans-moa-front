import { useAdminUserListLogic } from "@/hooks/admin/useAdminUserList";

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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  AlertTriangle,
  LayoutDashboard,
  Users,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const SortIcon = ({ currentSort, field }) => {
  if (!currentSort) {
    return <ArrowUpDown className="ml-2 h-3 w-3 text-slate-400" />;
  }

  const tokens = currentSort.split(",");
  let dir = null;

  for (let i = 0; i < tokens.length; i += 2) {
    if (tokens[i] === field) {
      dir = tokens[i + 1] || "desc";
      break;
    }
  }

  if (!dir) {
    return <ArrowUpDown className="ml-2 h-3 w-3 text-slate-400" />;
  }

  return dir === "asc" ? (
    <ArrowUp className="ml-2 h-3 w-3 text-indigo-600" />
  ) : (
    <ArrowDown className="ml-2 h-3 w-3 text-indigo-600" />
  );
};

const StatusBadge = ({ status, blacklisted }) => {
  if (blacklisted) {
    return (
      <Badge className="bg-red-500 hover:bg-red-600 text-xs font-semibold">
        블랙리스트
      </Badge>
    );
  }
  const styles = {
    BLOCK: "bg-orange-500 hover:bg-orange-600",
    WITHDRAW: "bg-slate-400 hover:bg-slate-500",
    PENDING: "bg-yellow-400 hover:bg-yellow-500 text-slate-900",
    ACTIVE: "bg-emerald-500 hover:bg-emerald-600",
  };
  const labels = {
    BLOCK: "이용제한",
    WITHDRAW: "탈퇴",
    PENDING: "미인증",
    ACTIVE: "정상",
  };
  const key = status === "ACTIVE" || !styles[status] ? "ACTIVE" : status;

  return (
    <Badge className={`${styles[key]} text-xs font-semibold`}>
      {labels[key]}
    </Badge>
  );
};

export default function AdminUserListPage() {
  const {
    users,
    page,
    sort,
    totalPages,
    totalCount,
    filters,
    searchValue,
    loading,
    error,
    pageNumbers,

    handlers: {
      handleSearchChange,
      handleSearchKeyDown,
      handleStatusChange,
      handleJoinStartChange,
      handleJoinEndChange,
      handleSearchSubmit,
      handlePageClick,
      handleSortToggle,
      changePageBlock,
      handleEmailClick,
      handleReset,
    },

    utils: { formatDate },
  } = useAdminUserListLogic();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
              MoA 관리자 · 회원 관리 센터
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
              모든 회원 정보를
              <br />
              <span className="text-indigo-100">한 화면에서 관리해요</span>
            </h1>
            <p className="text-sm sm:text-base text-indigo-50/90 leading-relaxed max-w-md mx-auto md:mx-0">
              회원 상태, 가입일, 로그인 이력을 기준으로 빠르게 조회하고
              블랙리스트/제한 계정도 한눈에 확인할 수 있습니다.
            </p>
          </div>

          <Card className="bg-white/95 border border-indigo-100 shadow-xl rounded-3xl w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
                    USER OVERVIEW
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    전체 회원{" "}
                    <span className="text-indigo-600">
                      {(totalCount ?? 0).toLocaleString()}명
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Table Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="mt-8">
          <Card className="shadow-md border-slate-200 rounded-2xl">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-100">
                  <Users className="w-4 h-4 text-indigo-600" />
                </span>
                전체 회원 목록
                <span className="ml-1 text-sm font-normal text-slate-500">
                  {(totalCount ?? 0).toLocaleString()}명
                </span>
              </CardTitle>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <Select
                    value={filters.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-32 h-9 text-sm">
                      <SelectValue placeholder="회원상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">전체</SelectItem>
                      <SelectItem value="ACTIVE">정상</SelectItem>
                      <SelectItem value="BLOCK">이용제한</SelectItem>
                      <SelectItem value="WITHDRAW">탈퇴</SelectItem>
                      <SelectItem value="PENDING">미인증</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="date"
                    className="h-9 w-36 text-xs"
                    value={filters.joinStart}
                    onChange={(e) => handleJoinStartChange(e.target.value)}
                  />
                  <span className="text-xs text-slate-400">~</span>
                  <Input
                    type="date"
                    className="h-9 w-36 text-xs"
                    value={filters.joinEnd}
                    onChange={(e) => handleJoinEndChange(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-56">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      className="pl-9 pr-3 h-9 text-sm rounded-full bg-slate-100 focus:bg-white"
                      placeholder="이메일 검색..."
                      value={searchValue}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                    />
                  </div>
                  <Button
                    className="h-9 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold"
                    onClick={handleSearchSubmit}
                  >
                    검색
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 px-3 rounded-full text-xs border-slate-200 text-slate-600"
                    onClick={handleReset}
                  >
                    초기화
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {error && (
                <div className="px-6 py-3 flex items-center gap-2 bg-red-50 border-b border-red-100 text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="w-72 text-left text-slate-700 text-sm font-semibold">
                        이메일(아이디)
                      </TableHead>
                      <TableHead className="w-32 text-center text-slate-700 text-sm font-semibold">
                        회원상태
                      </TableHead>
                      <TableHead className="w-40 text-center p-0">
                        <Button
                          variant="ghost"
                          onClick={() => handleSortToggle("lastLoginDate")}
                          className="w-full h-full rounded-none hover:bg-slate-100 text-slate-700 text-sm font-semibold flex items-center justify-center gap-1"
                        >
                          최근 로그인 일자
                          <SortIcon currentSort={sort} field="lastLoginDate" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-40 text-center p-0">
                        <Button
                          variant="ghost"
                          onClick={() => handleSortToggle("regDate")}
                          className="w-full h-full rounded-none hover:bg-slate-100 text-slate-700 text-sm font-semibold flex items-center justify-center gap-1"
                        >
                          가입일자
                          <SortIcon currentSort={sort} field="regDate" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {loading &&
                      Array.from({ length: 5 }).map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="py-4">
                            <Skeleton className="h-4 w-48" />
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Skeleton className="h-4 w-16 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </TableCell>
                        </TableRow>
                      ))}

                    {!loading && users.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="py-10 text-center text-sm text-slate-500"
                        >
                          조회된 회원이 없습니다.
                        </TableCell>
                      </TableRow>
                    )}

                    {!loading &&
                      users.map((user) => (
                        <TableRow
                          key={user.userId}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <TableCell className="py-3 text-sm">
                            <button
                              type="button"
                              className={`text-left font-medium ${
                                user.blacklisted
                                  ? "text-red-500 hover:underline"
                                  : "text-slate-900 hover:text-indigo-600 hover:underline"
                              }`}
                              onClick={() => handleEmailClick(user.userId)}
                            >
                              {user.userId}
                            </button>
                          </TableCell>
                          <TableCell className="py-3 text-center">
                            <StatusBadge
                              status={user.status}
                              blacklisted={user.blacklisted}
                            />
                          </TableCell>
                          <TableCell className="py-3 text-center text-sm text-slate-600">
                            {formatDate(user.lastLoginDate)}
                          </TableCell>
                          <TableCell className="py-3 text-center text-sm text-slate-600">
                            {formatDate(user.regDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/70 rounded-b-2xl">
                <div className="text-xs text-slate-500">
                  페이지 {page} / {totalPages || 1}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-xs"
                    disabled={page <= 1}
                    onClick={() => changePageBlock("first")}
                  >
                    {"<<"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-xs"
                    disabled={page <= 1}
                    onClick={() => changePageBlock("prevBlock")}
                  >
                    {"<"}
                  </Button>

                  {pageNumbers.map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="icon"
                      className={`h-8 w-8 text-xs ${
                        p === page
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "text-slate-700"
                      }`}
                      onClick={() => handlePageClick(p)}
                    >
                      {p}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-xs"
                    disabled={page >= (totalPages || 1)}
                    onClick={() => changePageBlock("nextBlock")}
                  >
                    {">"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-xs"
                    disabled={page >= (totalPages || 1)}
                    onClick={() => changePageBlock("last")}
                  >
                    {">>"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
