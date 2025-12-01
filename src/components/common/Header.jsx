import { useHeaderLogic } from "@/hooks/headerLogic";
import { Bell, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { user, logout } = useHeaderLogic();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // 외부 클릭 → 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          className="font-bold text-xl text-blue-600 cursor-pointer"
          role="link"
          data-href="/"
        >
          MoA
        </button>

        {/* 메뉴 */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-600">
          <button role="link" data-href="/product">
            구독상품
          </button>
          <button role="link" data-href="/subscription">
            구독목록
          </button>
          <button role="link" data-href="/party">
            파티 찾기
          </button>
        </nav>

        {/* 오른쪽 영역 */}
        {user ? (
          <div className="flex items-center gap-4 relative" ref={menuRef}>
            {/* 알림벨 */}
            <button
              role="link"
              data-href="/notification"
              className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {/* 알림 badge (옵션) */}
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>

            {/* 유저 닉네임 */}
            <span className="text-sm text-gray-700">{user.nickname}님</span>

            {/* 햄버거 버튼 */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            {/* 드롭다운 */}
            {openMenu && (
              <div className="absolute top-14 right-0 w-40 bg-white shadow-lg border rounded-lg overflow-hidden animate-fadeIn">
                <button
                  role="link"
                  data-href="/mypage"
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                >
                  마이페이지
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 text-red-600"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg"
              role="link"
              data-href="/signup"
            >
              회원가입
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              role="link"
              data-href="/login"
            >
              로그인
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
