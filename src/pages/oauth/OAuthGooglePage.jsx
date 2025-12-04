import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import httpClient from "@/api/httpClient";

export default function OAuthGooglePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const { setUser, clearAuth, setTokens } = useAuthStore();

  useEffect(() => {
    const status = params.get("status");
    const providerUserId = params.get("providerUserId");
    const provider = params.get("provider");
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!status) {
      alert("잘못된 접근입니다.");
      navigate("/", { replace: true });
      return;
    }

    if (status === "CONNECT") {
      alert("구글 계정 연동 완료!");
      navigate("/mypage", { replace: true });
      return;
    }

    if (status === "ALREADY_CONNECTED") {
      alert("이미 다른 계정에 연결된 구글 계정입니다.");
      navigate("/mypage", { replace: true });
      return;
    }

    if (status === "NEED_REGISTER") {
      alert("구글 계정으로 가입을 진행합니다.");
      navigate(
        `/signup?provider=${provider}&providerUserId=${providerUserId}`,
        { replace: true }
      );
      return;
    }

    if (status === "LOGIN") {
      alert("구글 로그인 완료!");

      setTokens({
        accessToken,
        refreshToken,
      });

      httpClient
        .get("/users/me")
        .then((userRes) => {
          if (userRes.success) setUser(userRes.data);
        })
        .catch(clearAuth);

      navigate("/", { replace: true });
      return;
    }

    alert("OAuth 처리 중 오류 발생");
    navigate("/", { replace: true });
  }, []);

  return (
    <div className="pt-40 text-center">
      <h2 className="text-xl font-bold">구글 인증 처리 중...</h2>
    </div>
  );
}
