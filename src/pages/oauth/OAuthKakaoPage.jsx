import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { fetchCurrentUser } from "@/api/authApi";

export default function OAuthKakaoPage() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const mode = params.get("mode") || "login";
  const navigate = useNavigate();

  const { setTokens, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!code) {
      alert("카카오 인가 코드가 없습니다. 다시 로그인해 주세요.");
      navigate("/login", { replace: true });
      return;
    }

    const run = async () => {
      try {
        const res = await httpClient.get("/oauth/kakao/callback", {
          params: { code, mode },
        });

        if (!res.success) {
          alert(res.error?.message || "카카오 로그인에 실패했습니다.");
          navigate("/login", { replace: true });
          return;
        }

        const {
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          needSignup,
          provider,
          providerUserId,
        } = res.data || {};

        if (accessToken) {
          setTokens({
            accessToken,
            refreshToken,
            accessTokenExpiresIn,
          });

          // 토큰을 저장한 후, 최신 사용자 정보를 가져와 Zustand에 업데이트
          try {
            const meRes = await fetchCurrentUser();
            if (meRes.success) {
              setUser(meRes.data);
            }
          } catch (e) {
            console.error(e);
            clearAuth();
            // 사용자 정보 갱신 실패 시, 재로그인을 유도
            navigate("/login", { replace: true });
            return;
          }
        }

        if (needSignup && provider && providerUserId) {
          // 1. 가입이 필요할 경우, 가입 페이지로 이동
          navigate(
            `/signup?provider=${encodeURIComponent(
              provider
            )}&providerUserId=${encodeURIComponent(providerUserId)}`,
            { replace: true }
          );
        } else {
          // 2. 로그인 완료 또는 연동 완료 후 처리

          if (mode === "connect") {
            // 연동(마이페이지) 모드일 경우: 알림 없이 마이페이지로 이동
            navigate("/mypage", { replace: true });
          } else {
            // 일반 로그인 모드일 경우: 메인 페이지로 이동
            navigate("/", { replace: true });
          }
        }
      } catch (err) {
        console.error(err);
        alert(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "카카오 로그인 처리 중 오류가 발생했습니다."
        );
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [code, mode, navigate, setTokens, setUser, clearAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="rounded-2xl bg-slate-900/80 border border-slate-700 px-8 py-10 text-center space-y-4 shadow-xl">
        <div className="text-lg font-semibold text-slate-50">
          카카오 계정 확인 중...
        </div>
        <div className="text-sm text-slate-400">
          잠시만 기다려 주세요. MoA와 안전하게 연결하고 있습니다.
        </div>
      </div>
    </div>
  );
}
