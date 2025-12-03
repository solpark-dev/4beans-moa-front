import { useHeaderLogic } from "@/hooks/headerLogic";

export default function Header() {
  const { user, logout } = useHeaderLogic();

  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <button
          className="font-bold text-xl text-blue-600 cursor-pointer"
          role="link"
          data-href="/"
        >
          MoA
          
        </button>

        <nav className="hidden md:flex gap-6 text-sm text-gray-600">
          <button role="link" data-href="/party">파티 찾기</button>
          <button role="link" data-href="/mypage">마이페이지</button>
          <button role="link" data-href="/community">고객센터</button>
        </nav>

        {user ? (
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-700">{user.nickname}님</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
              onClick={logout}
            >
              로그아웃
            </button>
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
