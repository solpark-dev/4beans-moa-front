// src/components/layout/HeaderView.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  CreditCard,
  Boxes,
  UserCircle,
  Menu,
  Home,
  ChevronRight,
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
import NotificationPopover from "@/components/push/NotificationPopover";

function Sticker({ children, color = "bg-white", className = "" }) {
  return (
    <div
      className={`${color} border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-150 ${className}`}
    >
      {children}
    </div>
  );
}

function NavPill({ to, icon: Icon, children, active }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 px-4 py-2 font-black text-[15px] rounded-2xl border-2 border-black whitespace-nowrap transition-colors
      ${
        active
          ? "bg-black text-white"
          : "bg-white text-black hover:bg-black hover:text-white"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-xl border-2 border-black transition-colors
        ${
          active
            ? "bg-white text-black"
            : "bg-slate-50 text-black group-hover:bg-white group-hover:text-black"
        }`}
      >
        <Icon className="w-4 h-4" />
      </span>
      <span>{children}</span>
    </Link>
  );
}

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
  const location = useLocation();

  const isActive = (to) => {
    const p = location.pathname || "/";
    if (to === "/") return p === "/";
    return p === to || p.startsWith(to + "/");
  };

  const renderProviderBadge = () => {
    if (isAdmin) {
      return (
        <Badge className="bg-lime-400 text-black border-2 border-black h-6 px-1.5 text-[10px] font-black rounded-md leading-none">
          ADMIN
        </Badge>
      );
    }

    const raw =
      user?.loginProvider ||
      user?.provider ||
      user?.lastLoginType ||
      (user?.oauthConnections || []).find((c) => c.provider && !c.releaseDate)
        ?.provider;

    const p = (raw || "").toString().toLowerCase();

    let provider = "email";
    if (p === "kakao") provider = "kakao";
    else if (p === "google") provider = "google";
    else if (p === "password" || p === "local" || p === "email")
      provider = "email";

    switch (provider) {
      case "kakao":
        return (
          <Badge className="bg-[#FEE500] text-black border-2 border-black h-6 text-[11px] px-2 font-black rounded-lg">
            KAKAO
          </Badge>
        );
      case "google":
        return (
          <Badge className="bg-white text-black border-2 border-black h-6 text-[11px] px-2 font-black rounded-lg">
            GOOGLE
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-black border-2 border-black h-6 text-[11px] px-2 font-black rounded-lg">
            EMAIL
          </Badge>
        );
    }
  };

  const renderMobileNavItems = (withSeparator = true) => {
    const separator = withSeparator ? (
      <DropdownMenuSeparator className="my-3 bg-black/20" />
    ) : null;

    if (isAdmin) {
      return (
        <>
          <DropdownMenuGroup className="md:hidden">
            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-transparent"
            >
              <Link
                to="/admin/dashboard"
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border-2 border-black bg-white px-3 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  대시보드
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-transparent"
            >
              <Link
                to="/admin/users"
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border-2 border-black bg-white px-3 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  회원 관리
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-transparent"
            >
              <Link
                to="/admin/sales"
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border-2 border-black bg-white px-3 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  매출 조회
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-transparent"
            >
              <Link
                to="/product"
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border-2 border-black bg-white px-3 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Boxes className="w-5 h-5" />
                  구독상품
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {separator}
        </>
      );
    }

    return (
      <>
        <DropdownMenuGroup className="md:hidden">
          <DropdownMenuItem
            asChild
            className="cursor-pointer focus:bg-transparent"
          >
            <Link
              to="/product"
              className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border-2 border-black bg-white px-3 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Boxes className="w-5 h-5" />
                구독상품
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="cursor-pointer focus:bg-transparent"
          >
            <Link
              to="/subscription"
              className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border-2 border-black bg-white px-3 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                구독목록
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="cursor-pointer focus:bg-transparent"
          >
            <Link
              to="/party"
              className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border-2 border-black bg-white px-3 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                파티 찾기
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {separator}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-[200] isolate w-full bg-slate-50 border-b-4 border-black">
      <div className="w-full max-w-7xl mx-auto h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 min-w-0">
          <Link to="/" className="shrink-0">
            <Sticker color="bg-white" className="px-4 py-2 rounded-2xl">
              <span className="text-2xl font-black tracking-tight">MoA!</span>
            </Sticker>
          </Link>

          <nav className="hidden md:flex items-center gap-3 min-w-0">
            {isAdmin ? (
              <>
                <NavPill
                  to="/admin/dashboard"
                  icon={LayoutDashboard}
                  active={isActive("/admin/dashboard")}
                >
                  대시보드
                </NavPill>
                <NavPill
                  to="/admin/users"
                  icon={Users}
                  active={isActive("/admin/users")}
                >
                  회원 관리
                </NavPill>
                <NavPill
                  to="/admin/sales"
                  icon={CreditCard}
                  active={isActive("/admin/sales")}
                >
                  매출 조회
                </NavPill>
                <NavPill
                  to="/product"
                  icon={Boxes}
                  active={isActive("/product")}
                >
                  구독상품
                </NavPill>
              </>
            ) : (
              <>
                <NavPill
                  to="/product"
                  icon={Boxes}
                  active={isActive("/product")}
                >
                  구독상품
                </NavPill>
                <NavPill
                  to="/subscription"
                  icon={Home}
                  active={isActive("/subscription")}
                >
                  구독목록
                </NavPill>
                <NavPill to="/party" icon={Users} active={isActive("/party")}>
                  파티 찾기
                </NavPill>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3 justify-end shrink-0">
          {user ? (
            <>
              {/* 관리자 스위치: lg 이상에서만 헤더에 노출 (겹침 방지) */}
              {user?.role === "ADMIN" && (
                <Sticker
                  color="bg-white"
                  className="hidden lg:flex items-center gap-2 rounded-2xl px-3 py-2"
                >
                  <Switch
                    id="admin-mode"
                    checked={isAdminMode}
                    onCheckedChange={handleAdminSwitch}
                    className="data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300"
                  />
                  <Label
                    htmlFor="admin-mode"
                    className="text-[11px] font-black text-black cursor-pointer tracking-[0.18em] uppercase"
                  >
                    {isAdminMode ? "SUP" : "MGR"}
                  </Label>
                </Sticker>
              )}

              <Sticker color="bg-white" className="rounded-2xl p-1.5">
                <NotificationPopover />
              </Sticker>

              <Separator
                orientation="vertical"
                className="h-9 bg-black/20 hidden sm:block"
              />

              <Link to="/mypage" className="hidden sm:flex items-center gap-3">
                <Sticker color="bg-white" className="rounded-2xl p-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-black bg-slate-50">
                      <AvatarImage
                        src={profileImageUrl}
                        alt={displayNickname}
                      />
                      <AvatarFallback className="bg-cyan-400 text-black text-lg font-black">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>

                    <div className="hidden xl:flex flex-col gap-1 w-32 overflow-hidden">
                      <span className="text-[15px] font-black text-black leading-tight truncate">
                        {displayNickname}
                      </span>
                      {renderProviderBadge()}
                    </div>
                  </div>
                </Sticker>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="p-0 border-0 bg-transparent hover:bg-transparent"
                  >
                    <Sticker
                      color="bg-pink-500"
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    >
                      <Menu className="w-6 h-6 text-white" />
                    </Sticker>
                  </Button>
                </DropdownMenuTrigger>

                {/* 드랍다운: 폭 키우고(360), 내부를 2열 퀵액션으로 구성해서 “길쭉함” 제거 */}
                <DropdownMenuContent
                  align="end"
                  className="w-[520px] max-w-[calc(100vw-24px)] p-3 mt-3 bg-white border-4 border-black rounded-3xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <DropdownMenuLabel className="font-normal p-0 mb-3">
                    <Sticker color="bg-slate-100" className="rounded-2xl p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border-2 border-black bg-white">
                          <AvatarImage
                            src={profileImageUrl}
                            alt={displayNickname}
                          />
                          <AvatarFallback className="bg-cyan-400 text-black text-lg font-black">
                            {userInitial}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-black truncate">
                            {displayNickname}님
                          </p>
                          <p className="text-xs text-black/70 font-bold truncate">
                            {displayEmail}
                          </p>
                          <div className="mt-1">{renderProviderBadge()}</div>
                        </div>
                      </div>
                    </Sticker>
                  </DropdownMenuLabel>

                  {/* 관리자 스위치: lg 미만에서는 드랍다운 안에서 조작 */}
                  {user?.role === "ADMIN" && (
                    <div className="lg:hidden mb-3">
                      <Sticker
                        color="bg-white"
                        className="rounded-2xl px-3 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-black tracking-[0.18em] uppercase">
                              ADMIN MODE
                            </span>
                            <span className="text-[11px] font-bold text-black/70">
                              {isAdminMode ? "SUP" : "MGR"}
                            </span>
                          </div>
                          <Switch
                            id="admin-mode-dd"
                            checked={isAdminMode}
                            onCheckedChange={handleAdminSwitch}
                            className="data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300"
                          />
                        </div>
                      </Sticker>
                    </div>
                  )}

                  {renderMobileNavItems()}

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer focus:bg-transparent p-0"
                    >
                      <div className="w-full">
                        <Sticker
                          color="bg-black"
                          className="w-full rounded-2xl px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-2 text-white font-black">
                            <span className="flex items-center gap-2">
                              <LogOut className="w-5 h-5" />
                              로그아웃
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Sticker>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="p-0 border-0 bg-transparent hover:bg-transparent md:hidden"
                  >
                    <Sticker
                      color="bg-white"
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    >
                      <Menu className="w-6 h-6 text-black" />
                    </Sticker>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[520px] max-w-[calc(100vw-24px)] p-3 mt-3 bg-white border-4 border-black rounded-3xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"

                >
                  {renderMobileNavItems(false)}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/signup" className="hidden sm:block">
                <Sticker color="bg-white" className="px-4 py-2 rounded-2xl">
                  <span className="font-black text-black">회원가입</span>
                </Sticker>
              </Link>

              <Link to="/login">
                <Sticker color="bg-pink-500" className="px-5 py-2 rounded-2xl">
                  <span className="font-black text-white">로그인</span>
                </Sticker>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
