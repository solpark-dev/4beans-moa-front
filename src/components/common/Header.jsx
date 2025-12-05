import { useHeaderLogic } from "@/hooks/headerLogic";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  LogOut,
  LayoutDashboard,
  Users,
  CreditCard,
  UserCircle,
  Trash2,
  RefreshCw,
  Menu, // 햄버거 아이콘
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
import { Separator } from "@/components/ui/separator"; // 세로 구분선용

export default function Header() {
  const { user, logout, isAdmin, handleAdminSwitch, isAdminMode } = useHeaderLogic();

  // 1. 프로필 이미지 경로 처리
  const profileImageUrl = user?.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : `https://localhost:8443${user.profileImage}`
    : "";

  // 2. 닉네임 & 이메일
  const userInitial = user?.nickname ? user.nickname.substring(0, 1).toUpperCase() : "U";
  const displayNickname = user?.nickname || "사용자";
  const displayEmail = user?.email || "";

  // 3. 소셜 뱃지 렌더링
  const renderProviderBadge = (provider) => {
    // 관리자면 ADMIN 뱃지 리턴
    if (isAdmin) {
      return <Badge className="bg-slate-900 hover:bg-slate-800 h-5 text-[10px] px-1.5">ADMIN</Badge>;
    }
    switch (provider) {
      case "kakao":
        return <Badge className="bg-[#FEE500] text-black hover:bg-[#FDD835] h-5 text-[10px] px-1.5 border-none">KAKAO</Badge>;
      case "google":
        return <Badge variant="outline" className="bg-white text-slate-600 border-slate-300 h-5 text-[10px] px-1.5">GOOGLE</Badge>;
      default:
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600 h-5 text-[10px] px-1.5">EMAIL</Badge>;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* ======================= */}
        {/* 1. 로고 영역 */}
        {/* ======================= */}
        <Link to={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-blue-700 transition-colors">
            <span className="text-white font-extrabold text-2xl">M</span>
          </div>
          <span className="text-3xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
            MoA
          </span>
        </Link>

        {/* ======================= */}
        {/* 2. 네비게이션 (데스크탑) */}
        {/* ======================= */}
        <nav className="hidden md:flex items-center gap-10 text-[16px] font-semibold text-slate-600">
          {isAdmin ? (
            <>
              <Link to="/admin/users" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Users className="w-5 h-5" /> 회원 관리
              </Link>
              <Link to="/admin/sales" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <CreditCard className="w-5 h-5" /> 매출 조회
              </Link>
            </>
          ) : (
            <>
              <Link to="/product" className="hover:text-blue-600 transition-colors">구독상품</Link>
              <Link to="/subscription" className="hover:text-blue-600 transition-colors">구독목록</Link>
              <Link to="/party" className="hover:text-blue-600 transition-colors">파티 찾기</Link>
            </>
          )}
        </nav>

        {/* ======================= */}
        {/* 3. 우측 컨트롤 영역 */}
        {/* ======================= */}
        <div className="flex items-center gap-5">
          
          {/* 검색바 */}
          <div className="hidden xl:flex items-center relative w-80">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={isAdmin ? "회원 검색..." : "넷플릭스, 디즈니+ 검색..."}
              className="w-full bg-slate-100 text-[15px] rounded-full pl-12 pr-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              
              {/* 관리자 스위치 */}
              {user.email === "admin@admin.com" && (
                <div className="hidden 2xl:flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-full border border-slate-100 shadow-sm mr-2">
                  <Switch 
                    id="admin-mode" 
                    checked={isAdminMode} 
                    onCheckedChange={handleAdminSwitch} 
                    className="data-[state=checked]:bg-slate-900"
                  />
                  <Label htmlFor="admin-mode" className="text-xs font-bold text-slate-700 cursor-pointer w-10 text-center">
                    {isAdminMode ? "SUP" : "MGR"}
                  </Label>
                </div>
              )}

              {/* 🔔 알림 버튼 */}
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100 text-slate-500 w-11 h-11">
                <Bell className="w-7 h-7" />
                <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
              </Button>

              {/* 구분선 */}
              <Separator orientation="vertical" className="h-8 bg-slate-200" />

              {/* 👤 프로필 정보 표시 영역 (클릭X, 순수 정보용) */}
              <div className="flex items-center gap-3 px-1">
                <Avatar className="h-11 w-11 border border-slate-200 shadow-sm">
                  <AvatarImage src={profileImageUrl} alt={displayNickname} className="object-cover" />
                  <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-lg">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                
                <div className="hidden lg:flex flex-col items-start gap-0.5">
                  <span className="text-[15px] font-bold text-slate-800 leading-none">
                    {displayNickname}
                  </span>
                  {renderProviderBadge(user.provider)}
                </div>
              </div>

              {/* 🍔 햄버거 메뉴 버튼 (드롭다운 트리거) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="w-11 h-11 rounded-full border-slate-200 hover:bg-slate-100 hover:text-blue-600 transition-colors shadow-sm ml-1">
                    <Menu className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64 p-2 mt-2" align="end" forceMount>
                  
                  {/* 드롭다운 내부 헤더 */}
                  <DropdownMenuLabel className="font-normal p-3 bg-slate-50 rounded-md mb-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-slate-900">{displayNickname}님</p>
                      <p className="text-xs text-slate-500 font-medium truncate">{displayEmail}</p>
                    </div>
                  </DropdownMenuLabel>

                  {isAdmin ? (
                    // 관리자 메뉴
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={handleAdminSwitch} className="cursor-pointer py-2.5 font-medium">
                        <RefreshCw className="mr-2 h-4.5 w-4.5 text-slate-500" />
                        <span>관리자 권한 전환</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 bg-red-50/50 cursor-pointer py-2.5 font-medium">
                        <LogOut className="mr-2 h-4.5 w-4.5" />
                        <span>로그아웃</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  ) : (
                    // 사용자 메뉴
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage" className="cursor-pointer py-2.5 flex items-center font-medium text-slate-700">
                          <UserCircle className="mr-2 h-4.5 w-4.5 text-slate-500" />
                          <span>마이페이지</span>
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild className="md:hidden">
                        <Link to="/subscription" className="cursor-pointer py-2.5 font-medium text-slate-700">
                           <LayoutDashboard className="mr-2 h-4.5 w-4.5 text-slate-500" /> 나의 구독
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="my-1" />
                      
                      <DropdownMenuItem onClick={logout} className="cursor-pointer py-2.5 text-slate-600 font-medium">
                        <LogOut className="mr-2 h-4.5 w-4.5 text-slate-500" />
                        <span>로그아웃</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link to="/mypage/delete" className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2.5 flex items-center font-medium">
                          <Trash2 className="mr-2 h-4.5 w-4.5" />
                          <span>회원 탈퇴</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          ) : (
            /* 비로그인 상태 */
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="rounded-full text-[15px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-6 h-11">
                <Link to="/signup">회원가입</Link>
              </Button>
              <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md px-7 h-11 text-[15px] font-bold tracking-wide transition-transform hover:scale-105">
                <Link to="/login">로그인</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}