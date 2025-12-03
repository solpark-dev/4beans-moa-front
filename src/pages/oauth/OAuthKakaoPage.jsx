import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";

export default function OAuthKakaoPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get("code");

    if (!code) {
      alert("카카오 인증 코드가 없습니다.");
      navigate("/login");
      return;
    }

    async function sendCode() {
      try {
        const res = await httpClient.get(`/oauth/kakao/callback?code=${code}`);

        if (res.success) {
          navigate("/");
        } else {
          alert(res.error?.message || "소셜 로그인 실패");
          navigate("/login");
        }
      } catch (e) {
        alert("서버 오류로 소셜 로그인에 실패했습니다.");
        navigate("/login");
      }
    }

    sendCode();
  }, []);

  return <div className="pt-40 text-center">카카오 로그인 처리중...</div>;
}
