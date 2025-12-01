import { useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";

export default function OAuthKakaoPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const status = params.get("status");
  const providerUserId = params.get("providerUserId");
  const userId = params.get("userId");
  const provider = params.get("provider");

  // ✔ useCallback 사용 → ESLint 경고 해결
  const connectKakao = useCallback(
    async (providerUserId, userId) => {
      try {
        await httpClient.post("/oauth/connect", {
          providerUserId,
          userId,
        });

        alert("카카오 계정이 정상적으로 연결되었습니다.");
        navigate("/mypage");
      } catch (err) {
        console.error(err);
        alert("카카오 계정 연결 실패");
        navigate("/mypage");
      }
    },
    [navigate] // navigate만 의존
  );

  useEffect(() => {
    if (!status) return;

    if (status === "LOGIN") {
      navigate("/login/social" + location.search);
      return;
    }

    if (status === "CONNECT") {
      connectKakao(providerUserId, userId);
      return;
    }

    if (status === "NEED_REGISTER") {
      alert("카카오로 가입된 사용자가 없습니다. 회원가입을 진행해주세요.");
      navigate("/signup", {
        state: { provider, providerUserId },
      });
      return;
    }

    if (status === "ALREADY_CONNECTED") {
      alert("이미 다른 계정과 연결된 카카오 계정입니다.");
      navigate("/mypage");
      return;
    }
  }, [
    status,
    providerUserId,
    userId,
    provider,
    navigate,
    location.search,
    connectKakao,
  ]);

  return <div>처리중…</div>;
}
