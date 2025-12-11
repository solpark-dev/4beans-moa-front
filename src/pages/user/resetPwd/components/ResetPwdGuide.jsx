export function ResetPwdGuide() {
  return (
    <div className="space-y-4">
      <p id="resetGuide" className="text-gray-700 text-center leading-relaxed">
        PASS 버튼을 눌러 본인 인증을 진행해 주세요.
        <br />
        인증이 끝나면 새 비밀번호를 입력하실 수 있습니다.
      </p>

      <div className="flex justify-center">
        <button
          id="btnResetPassAuth"
          className="bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-xl text-lg font-bold cursor-pointer shadow-md transition"
        >
          PASS 본인인증
        </button>
      </div>
    </div>
  );
}
