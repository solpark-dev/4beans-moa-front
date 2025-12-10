import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { fetchCurrentUser } from "@/api/authApi";

export default function OAuthGooglePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();
  const processedRef = useRef(false);

  useEffect(() => {
    const code = params.get("code");
    const mode = params.get("state") || params.get("mode") || "login";

    if (!code) {
      alert("잘못된 접근입니다.");
      navigate("/", { replace: true });
      return;
    }
    if (processedRef.current) return;
    processedRef.current = true;

    const run = async () => {
      try {
        const res = await httpClient.get("/oauth/google/callback", {
          params: { code, mode },
        });

        if (!res?.success || !res.data) {
          alert("구글 인증 처리에 실패했습니다.");
          navigate("/login", { replace: true });
          return;
        }

        const {
          status,
          providerUserId,
          userId,
          provider,
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          fromUserId,
        } = res.data;

        if (mode === "connect") {
          if (status === "NEED_TRANSFER") {
            const ok = window.confirm(
              "다른 계정에 연결된 구글 계정입니다. 현재 계정으로 연결을 이전하시겠습니까?"
            );
            if (!ok) {
              navigate("/mypage", { replace: true });
              return;
            }

            await httpClient.post("/oauth/transfer", {
              provider,
              providerUserId,
              fromUserId,
            });

            const meRes = await fetchCurrentUser();
            if (meRes.success) setUser(meRes.data);

            alert("구글 계정 연결이 이전되었습니다.");
            navigate("/mypage", { replace: true });
            return;
          }

          if (status === "CONNECT") {
            const meRes = await fetchCurrentUser();
            if (meRes.success) setUser(meRes.data);
            alert("구글 계정이 연동되었습니다.");
            navigate("/mypage", { replace: true });
            return;
          }
        }

        if (status === "LOGIN" && userId && accessToken) {
          setTokens({
            accessToken,
            refreshToken,
            accessTokenExpiresIn,
          });

          const meRes = await fetchCurrentUser();
          if (meRes.success) setUser(meRes.data);

          navigate("/", { replace: true });
          return;
        }

        if (status === "NEED_REGISTER") {
          navigate(
            `/signup/social?provider=google&providerUserId=${encodeURIComponent(
              providerUserId
            )}`,
            { replace: true }
          );
          return;
        }

        navigate("/", { replace: true });
      } catch (e) {
        console.error(e);
        alert("구글 인증 처리 중 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [params, navigate, setUser, setTokens]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="rounded-2xl bg-slate-900/80 border border-slate-700 px-8 py-10 text-center space-y-4 shadow-xl">
        <div className="text-lg font-semibold text-slate-50">
          구글 계정 확인 중...
        </div>
        <div className="text-sm text-slate-400">
          잠시만 기다려 주세요. MoA와 안전하게 연결하고 있습니다.
        </div>
      </div>
    </div>
  );
}
