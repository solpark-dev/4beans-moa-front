// src/components/layout/HeaderView.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  CreditCard,
  Boxes,
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
import { useThemeStore } from "@/store/themeStore";
import {
  headerThemes,
  navPillStyles,
  getMobileNavItemStyle,
} from "@/config/themeConfig";

function Sticker({ children, color = "bg-transparent", className = "" }) {
  return (
    <div
      className={`${color} ${className}`}
    >
      {children}
    </div>
  );
}

function NavPill({ to, icon: Icon, children, active, theme = "classic" }) {
  const style = navPillStyles[theme] || navPillStyles.classic;

  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 px-4 py-2 font-black text-[15px] rounded-2xl border-0 whitespace-nowrap transition-colors
      ${active
          ? "bg-black text-white"
          : "bg-transparent text-black hover:bg-black hover:text-white"
        }`}
    >
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-xl border-0 transition-colors
        ${active
            ? "bg-white text-black"
            : "bg-transparent text-black group-hover:bg-white group-hover:text-black"
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

  // Theme state from Zustand Store
  const { theme: currentTheme } = useThemeStore();
  const themeStyle = headerThemes[currentTheme] || headerThemes.classic;

  const isActive = (to) => {
    const p = location.pathname || "/";
    if (to === "/") return p === "/";
    return p === to || p.startsWith(to + "/");
  };

  const renderProviderBadge = () => {
    if (isAdmin) {
      return (
        <Badge className="w-fit bg-lime-400 text-black border-0 px-1.5 py-0 text-[9px] font-black rounded-full">
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
          <Badge className="w-fit bg-[#FEE500] text-black border-0 px-1.5 py-0 text-[9px] font-black rounded-full">KAKAO</Badge>
        );
      case "google":
        return (
          <Badge className="w-fit bg-white text-black border border-gray-300 px-1.5 py-0 text-[9px] font-black rounded-full">GOOGLE</Badge>
        );
      default:
        return (
          <Badge className="w-fit bg-pink-100 text-pink-600 border-0 px-1.5 py-0 text-[9px] font-black rounded-full">EMAIL</Badge>
        );
    }
  };

  const renderMobileNavItems = (withSeparator = true) => {
    const separator = withSeparator ? (
      <DropdownMenuSeparator className={`my-3 ${themeStyle.separatorColor}`} />
    ) : null;

    const navItemStyle = getMobileNavItemStyle(currentTheme);

    if (isAdmin) {
      return (
        <>
          <DropdownMenuGroup className="md:hidden space-y-2">
            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-transparent"
            >
              <Link
                to="/admin/dashboard"
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
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
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
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
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
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
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
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
        <DropdownMenuGroup className="md:hidden space-y-2">
          <DropdownMenuItem
            asChild
            className="cursor-pointer focus:bg-transparent"
          >
            <Link
              to="/product"
              className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
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
              className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
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
              className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
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
    <header className="sticky top-0 z-[200] isolate w-full bg-transparent border-b border-transparent">
      <div className="w-full max-w-7xl mx-auto h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 min-w-0">
          <Link to="/" className="shrink-0">
            <Sticker className="px-4 py-2 rounded-2xl">
              <span className="text-2xl font-black tracking-tight">MoA!</span>
            </Sticker>
          </Link>

          <nav className="hidden md:flex items-center gap-3 min-w-0">
            {isAdmin ? (
              <>
                <NavPill theme={currentTheme}
                  to="/admin/dashboard"
                  icon={LayoutDashboard}
                  active={isActive("/admin/dashboard")}
                >
                  대시보드
                </NavPill>
                <NavPill theme={currentTheme}
                  to="/admin/users"
                  icon={Users}
                  active={isActive("/admin/users")}
                >
                  회원 관리
                </NavPill>
                <NavPill theme={currentTheme}
                  to="/admin/sales"
                  icon={CreditCard}
                  active={isActive("/admin/sales")}
                >
                  매출 조회
                </NavPill>
                <NavPill theme={currentTheme}
                  to="/product"
                  icon={Boxes}
                  active={isActive("/product")}
                >
                  구독상품
                </NavPill>
              </>
            ) : (
              <>
                <NavPill theme={currentTheme}
                  to="/product"
                  icon={Boxes}
                  active={isActive("/product")}
                >
                  구독상품
                </NavPill>
                <NavPill theme={currentTheme}
                  to="/subscription"
                  icon={Home}
                  active={isActive("/subscription")}
                >
                  구독목록
                </NavPill>
                <NavPill theme={currentTheme} to="/party" icon={Users} active={isActive("/party")}>
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

                  className="hidden lg:flex items-center gap-2 rounded-2xl px-3 py-2"
                >
                  <Switch
                    id="admin-mode"
                    checked={isAdminMode}
                    onCheckedChange={handleAdminSwitch}
                    className={`${currentTheme === "dark"
                      ? "data-[state=checked]:bg-[#635bff] data-[state=unchecked]:bg-gray-600"
                      : currentTheme === "portrait"
                        ? "data-[state=checked]:bg-pink-400 data-[state=unchecked]:bg-pink-200"
                        : currentTheme === "christmas"
                          ? "data-[state=checked]:bg-[#c41e3a] data-[state=unchecked]:bg-gray-300"
                          : "data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300"}`}
                  />
                  <Label
                    htmlFor="admin-mode"
                    className={`text-[11px] font-black cursor-pointer tracking-[0.18em] uppercase ${themeStyle.stickerText}`}
                  >
                    {isAdminMode ? "SUP" : "MGR"}
                  </Label>
                </Sticker>
              )}

              <Sticker className="rounded-2xl p-1.5">
                <NotificationPopover />
              </Sticker>

              <Separator
                orientation="vertical"
                className={`h-9 hidden sm:block ${themeStyle.separatorColor}`}
              />

              <Link to="/mypage" className="hidden sm:flex items-center gap-3">
                <Sticker className="rounded-2xl p-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-200 bg-slate-50">
                      <AvatarImage
                        src={profileImageUrl}
                        alt={displayNickname}
                      />
                      <AvatarFallback className={`text-lg font-black ${themeStyle.avatarFallback}`}>
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>

                    <div className="hidden xl:flex flex-col gap-1 w-32 overflow-hidden">
                      <span className={`text-[15px] font-black leading-tight truncate ${themeStyle.stickerText}`}>
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
                    <div className={`${themeStyle.menuBg} ${themeStyle.menuBorder} ${currentTheme === "pop" ? "" : "shadow-lg"} w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200`}>
                      <Menu className={`w-6 h-6 ${themeStyle.menuText}`} />
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                {/* 드랍다운: 테마에 맞는 스타일 적용 */}
                <DropdownMenuContent
                  align="end"
                  className="w-[520px] max-w-[calc(100vw-24px)] p-3 mt-3 bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
                >
                  <DropdownMenuLabel className="font-normal p-0 mb-3">
                    <div className={`rounded-2xl p-3 ${themeStyle.dropdownItemBg}`}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border border-gray-200 bg-white">
                          <AvatarImage
                            src={profileImageUrl}
                            alt={displayNickname}
                          />
                          <AvatarFallback className={`text-lg font-black ${themeStyle.avatarFallback}`}>
                            {userInitial}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-black truncate ${themeStyle.dropdownItemText}`}>
                            {displayNickname}님
                          </p>
                          <p className={`text-xs font-bold truncate ${themeStyle.dropdownItemSubtext}`}>
                            {displayEmail}
                          </p>
                          <div className="mt-1">{renderProviderBadge()}</div>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  {/* 관리자 스위치: lg 미만에서는 드랍다운 안에서 조작 */}
                  {user?.role === "ADMIN" && (
                    <div className="lg:hidden mb-3">
                      <Sticker

                        className="rounded-2xl px-3 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className={`text-xs font-black tracking-[0.18em] uppercase ${themeStyle.dropdownItemText}`}>
                              ADMIN MODE
                            </span>
                            <span className={`text-[11px] font-bold ${themeStyle.dropdownItemSubtext}`}>
                              {isAdminMode ? "SUP" : "MGR"}
                            </span>
                          </div>
                          <Switch
                            id="admin-mode-dd"
                            checked={isAdminMode}
                            onCheckedChange={handleAdminSwitch}
                            className={`${currentTheme === "dark"
                              ? "data-[state=checked]:bg-[#635bff] data-[state=unchecked]:bg-gray-600"
                              : currentTheme === "portrait"
                                ? "data-[state=checked]:bg-pink-400 data-[state=unchecked]:bg-pink-200"
                                : currentTheme === "christmas"
                                  ? "data-[state=checked]:bg-[#c41e3a] data-[state=unchecked]:bg-gray-300"
                                  : "data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300"}`}
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
                        <div className={`w-full rounded-2xl px-4 py-3 transition-all duration-200 ${themeStyle.accentBg} ${currentTheme === "pop" ? "border-2 border-black" : ""}`}>
                          <div className={`flex items-center justify-between gap-2 font-black ${themeStyle.accentText}`}>
                            <span className="flex items-center gap-2">
                              <LogOut className="w-5 h-5" />
                              로그아웃
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
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

                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    >
                      <Menu className={`w-6 h-6 ${themeStyle.stickerText}`} />
                    </Sticker>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[520px] max-w-[calc(100vw-24px)] p-3 mt-3 bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"

                >
                  {renderMobileNavItems(false)}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/signup" className="hidden sm:block">
                <Sticker className="px-4 py-2 rounded-2xl">
                  <span className="font-black text-black">회원가입</span>
                </Sticker>
              </Link>

              <Link to="/login">
                <div className={`${themeStyle.menuBg} ${themeStyle.menuBorder} ${currentTheme === "pop" ? "" : "shadow-lg"} px-5 py-2 rounded-2xl transition-all duration-200`}>
                  <span className={`font-black ${themeStyle.menuText}`}>로그인</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
