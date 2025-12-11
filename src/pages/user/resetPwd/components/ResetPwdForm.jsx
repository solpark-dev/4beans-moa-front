export function ResetPwdForm() {
  return (
    <div id="resetFormArea" className="space-y-4 pt-4 hidden">
      <div>
        <label className="font-medium text-sm">새 비밀번호</label>
        <input
          id="resetNewPassword"
          type="password"
          className="w-full border rounded-lg p-3 mt-1"
          placeholder="8~20자 / 영문·숫자·특수문자 조합"
        />
      </div>

      <div>
        <label className="font-medium text-sm">새 비밀번호 확인</label>
        <input
          id="resetNewPasswordCheck"
          type="password"
          className="w-full border rounded-lg p-3 mt-1"
          placeholder="다시 한 번 입력해주세요."
        />
      </div>

      <button
        id="btnResetPwd"
        className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold cursor-pointer"
      >
        비밀번호 변경
      </button>
    </div>
  );
}
