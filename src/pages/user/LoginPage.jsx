import { useEffect } from "react";
import { initLoginPage } from "@/services/logic/loginPageLogic";
import kakaoIcon from "@/assets/icons/kakao.png";
import googleIcon from "@/assets/icons/google.png";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  loginHandler,
  googleLoginHandler,
} from "@/services/logic/loginPageLogic";
import { useLoginStore } from "@/store/user/loginStore";

export default function LoginPage() {
  const { email, password, remember, setField } = useLoginStore();

  useEffect(() => {
    initLoginPage();

    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }
  }, []);

  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      alert("카카오 SDK 로드 실패");
      return;
    }

    window.Kakao.Auth.authorize({
      redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
    });
  };

  return (
    <div className="flex flex-col items-center pt-28 pb-20">
      <h2 className="text-3xl font-bold mb-10">로그인</h2>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">이메일 로그인</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="loginEmail">이메일</Label>
            <Input
              id="loginEmail"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="loginPassword">비밀번호</Label>
            <Input
              id="loginPassword"
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setField("password", e.target.value)}
            />
          </div>

          <div className="flex justify-between text-sm mt-2">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setField("remember", e.target.checked)}
              />
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

          <Button
            id="btnLogin"
            onClick={loginHandler}
            className="w-full text-lg"
          >
            로그인
          </Button>
        </CardContent>
      </Card>

      <div className="w-full max-w-md space-y-3 mt-10">
        {/* ⭐ 공식 SDK 방식 버튼 */}
        <Button
          id="btnKakaoLogin"
          onClick={handleKakaoLogin}
          className="w-full bg-[#FEE500] text-black hover:bg-[#F7D400] flex items-center justify-center gap-2 font-semibold"
        >
          <img src={kakaoIcon} alt="카카오" className="w-6 h-6" />
          카카오 로그인
        </Button>

        {/* Google */}
        <Button
          id="btnGoogleLogin"
          onClick={googleLoginHandler}
          variant="outline"
          className="w-full bg-white border flex items-center justify-center gap-2 font-semibold"
        >
          <img src={googleIcon} alt="구글" className="w-6 h-6" />
          Google 로그인
        </Button>
      </div>
    </div>
  );
}
