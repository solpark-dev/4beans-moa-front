import { useEffect } from "react";
import { initLoginPage } from "../../services/logic/loginPageLogic";
import kakaoIcon from "../../assets/icons/kakao.png";
import googleIcon from "../../assets/icons/google.png";

export default function LoginPage() {
  useEffect(() => {
    initLoginPage();
  }, []);

  return (
    <div className="flex flex-col items-center pt-28 pb-20">
      <h2 className="text-3xl font-bold mb-10">로그인</h2>

      <div className="w-full max-w-md space-y-5">
        <input
          id="loginEmail"
          placeholder="이메일 입력"
          className="w-full border p-3 rounded-lg"
        />

        <input
          id="loginPassword"
          type="password"
          placeholder="비밀번호 입력"
          className="w-full border p-3 rounded-lg"
        />

        <div className="flex justify-between text-sm">
          <label className="flex gap-2">
            <input id="loginRemember" type="checkbox" />
            아이디 기억하기
          </label>

          <div className="flex gap-4">
            <button className="text-blue-600" role="link" data-href="/signup">
              회원가입
            </button>
            <button
              className="text-blue-600"
              role="link"
              data-href="/find-email"
            >
              이메일 찾기
            </button>
          </div>
        </div>

        <button
          id="btnLogin"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg"
        >
          로그인
        </button>
      </div>

      <div className="w-full max-w-md space-y-3 mt-10">
        <button
          id="btnKakaoLogin"
          className="w-full bg-yellow-400 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold"
        >
          <img src={kakaoIcon} alt="카카오" className="w-6 h-6" />
          카카오 로그인
        </button>

        <button
          id="btnGoogleLogin"
          className="w-full bg-white border py-3 rounded-lg flex items-center justify-center gap-2 font-semibold"
        >
          <img src={googleIcon} alt="구글" className="w-6 h-6" />
          Google 로그인
        </button>
      </div>
    </div>
  );
}
