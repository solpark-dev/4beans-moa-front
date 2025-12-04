import { useHeaderLogic } from "@/hooks/headerLogic";
import {
  Bell,
  Search,
  LogOut,
  Menu,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, logout, isAdmin } = useHeaderLogic();

  const profileImageUrl = user?.profileImage
    ? user.profileImage.startsWith("/")
      ? `https://localhost:8443${user.profileImage}`
      : user.profileImage
    : "https://static.thenounproject.com/png/363633-200.png";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow">
            <span className="text-white font-extrabold text-lg">M</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900">MoA</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                대시보드
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Users className="w-4 h-4" />
                회원 리스트
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/product"
                className="hover:text-blue-600 transition-colors"
              >
                구독상품
              </Link>
              <Link
                to="/subscription"
                className="hover:text-blue-600 transition-colors"
              >
                구독목록
              </Link>
              <Link
                to="/party"
                className="hover:text-blue-600 transition-colors"
              >
                파티 찾기
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex bg-slate-100 rounded-full px-4 py-1.5 w-64 items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isAdmin ? "회원 검색..." : "넷플릭스 파티 검색..."}
              className="bg-transparent text-sm focus:outline-none w-full placeholder:text-slate-400"
            />
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={profileImageUrl} alt={user.nickname} />
                      <AvatarFallback>
                        {user.nickname?.substring(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.nickname}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {isAdmin ? "슈퍼 관리자" : user.email || "사용자"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {isAdmin ? (
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage" className="cursor-pointer">
                          마이페이지
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/mypage/subscriptions"
                          className="cursor-pointer"
                        >
                          나의 구독목록
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/mypage/delete"
                          className="cursor-pointer text-red-500 focus:text-red-500"
                        >
                          회원 탈퇴
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>로그아웃</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                className="rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Link to="/signup">회원가입</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-blue-600 hover:bg-blue-700"
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
