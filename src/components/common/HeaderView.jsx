// src/components/common/HeaderView.jsx
import { Link } from "react-router-dom";
import {
  Bell,
  LogOut,
  LayoutDashboard,
  Users,
  CreditCard,
  Boxes,
  UserCircle,
  Trash2,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HeaderView({
  user,
  isAdmin,
  isAdminMode,
  profileImageUrl,
  userInitial,
  displayNickname,
  displayEmail,
  logout,
  handleAdminSwitch,
}) {
  const renderProviderBadge = (provider) => {
    if (isAdmin) {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 h-5 text-[10px] px-1.5">
          ADMINISTRATOR
        </Badge>
      );
    }
    switch (provider) {
      case "kakao":
        return (
          <Badge className="bg-[#FEE500] text-black h-5 text-[10px] px-1.5 border border-yellow-300">
            KAKAO
          </Badge>
        );
      case "google":
        return (
          <Badge
            variant="outline"
            className="bg-white text-slate-700 border-slate-300 h-5 text-[10px] px-1.5"
          >
            GOOGLE
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border border-slate-200 h-5 text-[10px] px-1.5">
            EMAIL
          </Badge>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm h-20">
      <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10 min-w-0">
          <Link
            to={isAdmin ? "/admin/users" : "/"}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-extrabold text-2xl tracking-tight">
                M
              </span>
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                MoA
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-[15px] font-semibold text-slate-600 mr-4">
            {isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>대시보드</span>
                </Link>

                <Link
                  to="/admin/users"
                  className="flex items-center gap-2 whitespace-nowrap transition-colors hover:text-indigo-600"
                >
                  <Users className="w-5 h-5" />
                  <span>회원 관리</span>
                </Link>

                <Link
                  to="/admin/sales"
                  className="flex items-center gap-2 hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>매출 조회</span>
                </Link>

                <Link
                  to="/product"
                  className="flex items-center gap-2 hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  <Boxes className="w-5 h-5" />
                  <span>구독상품</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/product"
                  className="hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  구독상품
                </Link>
                <Link
                  to="/subscription"
                  className="hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  구독목록
                </Link>
                <Link
                  to="/party"
                  className="hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  파티 찾기
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-5 w-[320px] justify-end shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              {user?.role === "ADMIN" && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 shadow-sm w-[120px] justify-center shrink-0">
                  <Switch
                    id="admin-mode"
                    checked={isAdminMode}
                    onCheckedChange={handleAdminSwitch}
                    className="data-[state=checked]:bg-slate-900"
                  />
                  <Label
                    htmlFor="admin-mode"
                    className="w-10 text-[11px] font-bold text-slate-800 cursor-pointer tracking-[0.18em] uppercase text-center shrink-0"
                  >
                    {isAdminMode ? "SUP" : "MGR"}
                  </Label>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full w-11 h-11 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
              </Button>

              <Separator orientation="vertical" className="h-8 bg-slate-200" />

              <Link
                to="/mypage"
                className="relative z-50 flex items-center gap-3 px-1 hover:opacity-80 transition cursor-pointer"
              >
                <Avatar className="h-11 w-11 border border-slate-200 bg-slate-50 shadow-sm">
                  <AvatarImage src={profileImageUrl} alt={displayNickname} />
                  <AvatarFallback className="bg-indigo-50 text-indigo-600 text-lg font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden lg:flex flex-col gap-0.5 w-28 overflow-hidden">
                  <span className="text-[15px] font-bold text-slate-900 leading-tight truncate">
                    {displayNickname}
                  </span>
                  {renderProviderBadge(user.provider)}
                </div>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-11 h-11 rounded-full border-slate-200 bg-white hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-colors"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-64 p-2 mt-2 bg-white/95 border border-slate-200 rounded-2xl shadow-xl"
                  align="end"
                >
                  <DropdownMenuLabel className="font-normal p-3 bg-slate-50 rounded-xl mb-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-slate-900">
                        {displayNickname}님
                      </p>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {displayEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  {!isAdmin && (
                    <DropdownMenuGroup className="md:hidden">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/product"
                          className="py-2.5 font-medium text-slate-700"
                        >
                          구독상품
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/subscription"
                          className="py-2.5 font-medium text-slate-700"
                        >
                          구독목록
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/party"
                          className="py-2.5 font-medium text-slate-700"
                        >
                          파티 찾기
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                    </DropdownMenuGroup>
                  )}

                  {isAdmin && (
                    <DropdownMenuGroup className="md:hidden">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/dashboard"
                          className="py-2.5 flex items-center font-medium text-slate-700"
                        >
                          <LayoutDashboard className="mr-2 w-4.5 h-4.5 text-slate-500" />
                          대시보드
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/users"
                          className="py-2.5 flex items-center font-medium text-slate-700"
                        >
                          <Users className="mr-2 w-4.5 h-4.5 text-slate-500" />
                          회원 관리
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/sales"
                          className="py-2.5 flex items-center font-medium text-slate-700"
                        >
                          <CreditCard className="mr-2 w-4.5 h-4.5 text-slate-500" />
                          매출 조회
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          to="/product"
                          className="py-2.5 flex items-center font-medium text-slate-700"
                        >
                          <Boxes className="mr-2 w-4.5 h-4.5 text-slate-500" />
                          구독상품
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="my-2" />
                    </DropdownMenuGroup>
                  )}

                  {isAdmin ? (
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={logout}
                        className="py-2.5 text-red-600 bg-red-50/60 font-medium cursor-pointer"
                      >
                        <LogOut className="mr-2 w-4.5 h-4.5" />
                        로그아웃
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  ) : (
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/mypage"
                          className="py-2.5 flex items-center font-medium text-slate-700"
                        >
                          <UserCircle className="mr-2 w-4.5 h-4.5 text-slate-500" />
                          마이페이지
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="md:hidden">
                        <Link
                          to="/subscription"
                          className="py-2.5 flex items-center font-medium text-slate-700"
                        >
                          <LayoutDashboard className="mr-2 w-4.5 h-4.5 text-slate-500" />
                          나의 구독
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="my-1" />

                      <DropdownMenuItem
                        onClick={logout}
                        className="py-2.5 font-medium text-slate-700 cursor-pointer"
                      >
                        <LogOut className="mr-2 w-4.5 h-4.5 text-slate-500" />
                        로그아웃
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          to="/mypage/delete"
                          className="py-2.5 flex items-center font-medium text-red-600"
                        >
                          <Trash2 className="mr-2 w-4.5 h-4.5" />
                          회원 탈퇴
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                asChild
                className="rounded-full text-[14px] font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 px-5 h-10"
              >
                <Link to="/signup">회원가입</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md px-6 h-10 text-[14px] font-bold"
              >
                <Link to="/login">로그인</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
