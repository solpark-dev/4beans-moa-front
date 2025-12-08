// src/pages/user/ResetPwdPage.jsx
import { useEffect } from "react";
import { initResetPwdPage } from "@/hooks/auth/useResetPassword";

export default function ResetPwdPage() {
  useEffect(() => {
    initResetPwdPage();
  }, []);

  return (
    <div className="flex flex-col items-center pt-28 pb-20 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">비밀번호 재설정</h2>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10 space-y-8">
        <div className="flex items-center justify-center gap-6 text-sm font-medium">
          <div
            id="resetStep1"
            className="flex items-center gap-2 text-blue-600"
          >
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
              1
            </span>
            <span>본인 인증</span>
          </div>

          <div className="w-8 h-px bg-gray-300" />

          <div
            id="resetStep2"
            className="flex items-center gap-2 text-gray-400"
          >
            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">
              2
            </span>
            <span>새 비밀번호 설정</span>
          </div>
        </div>

        <div className="border rounded-xl p-8 bg-gray-50 space-y-6">
          <div className="space-y-4">
            <p
              id="resetGuide"
              className="text-gray-700 text-center leading-relaxed"
            >
              PASS 버튼을 눌러 본인 인증을 먼저 진행해 주세요.
              <br />
              인증이 완료되면 새 비밀번호를 입력할 수 있습니다.
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

          <div id="resetFormArea" className="space-y-4 pt-4 hidden">
            <div>
              <label className="font-medium text-sm">새 비밀번호</label>
              <input
                id="resetNewPassword"
                type="password"
                className="w-full border rounded-lg p-3 mt-1"
                placeholder="8~20자 / 영문+숫자 또는 특수문자 조합"
              />
            </div>

            <div>
              <label className="font-medium text-sm">새 비밀번호 확인</label>
              <input
                id="resetNewPasswordCheck"
                type="password"
                className="w-full border rounded-lg p-3 mt-1"
                placeholder="다시 입력해주세요."
              />
            </div>

            <button
              id="btnResetPwd"
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold cursor-pointer"
            >
              비밀번호 변경
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">
          휴대폰 명의자와 회원 정보가 다를 경우 비밀번호 재설정이 제한될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
