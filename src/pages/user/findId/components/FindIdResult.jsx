export function FindIdResult({ email }) {
  return (
    <div className="border rounded-xl p-8 bg-gray-50">
      <div className="space-y-3 pt-4 animate-in fade-in duration-300">
        <p className="text-gray-600 text-sm text-center">회원가입된 이메일</p>

        <div className="w-full border p-3 rounded-lg text-center font-semibold bg-white text-lg">
          {email}
        </div>

        <a
          href="/login"
          className="block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full text-center text-sm font-semibold cursor-pointer transition"
        >
          로그인하러 가기
        </a>
      </div>
    </div>
  );
}
