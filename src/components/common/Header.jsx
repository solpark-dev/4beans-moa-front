import { useHeaderLogic } from "@/hooks/headerLogic";
import { Bell, LogOut, User as UserIcon, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, oauthProvider, logout } = useHeaderLogic();
  const [menuOpen, setMenuOpen] = useState(false);

  const onMenuToggle = () => setMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200 h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* ─────────────────── Logo ─────────────────── */}
        <button
          role="link"
          data-href="/"
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
            <span className="text-white font-extrabold text-lg">M</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
            MoA
          </span>
        </button>

        {/* ─────────────────── Navigation ─────────────────── */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            role="link"
            data-href="/party"
            className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            파티 찾기
          </button>

          {/* ⚠️ 마이페이지 버튼 제거됨 */}

          <button
            role="link"
            data-href="/community"
            className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            고객센터
          </button>
        </nav>

        {/* ─────────────────── Right Side ─────────────────── */}
        {user ? (
          <div className="flex items-center gap-4 relative">
            {/* 알림 */}
            <button className="p-2 hover:bg-slate-100 rounded-full relative group transition-colors">
              <Bell className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* 프로필 + 닉네임 */}
            <div className="hidden sm:flex items-center gap-2 pl-2">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="프로필"
                  className="w-8 h-8 rounded-full object-cover border border-slate-300"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-slate-300">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
              )}

              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-slate-800">
                  {user.nickname}님
                </span>
                {oauthProvider && (
                  <span className="text-xs text-gray-500">
                    (
                    {oauthProvider === "google"
                      ? "Google 로그인"
                      : "Kakao 로그인"}
                    )
                  </span>
                )}
              </div>
            </div>

            {/* 햄버거 메뉴 */}
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>

            {/* ────────────── 드롭다운 메뉴 ───────────── */}
            {menuOpen && (
              <div className="absolute right-0 top-14 w-52 bg-white shadow-xl rounded-lg border border-gray-100 py-2 z-50">
                {/* ⬇ 추가됨 — 마이페이지 */}
                <button
                  role="link"
                  data-href="/mypage"
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                >
                  마이페이지
                </button>

                <button
                  role="link"
                  data-href="/mypage/subscriptions"
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                >
                  나의 구독목록
                </button>

                <button
                  role="link"
                  data-href="/mypage/delete"
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                >
                  회원 탈퇴
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              role="link"
              data-href="/signup"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              회원가입
            </button>
            <button
              role="link"
              data-href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              로그인
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
