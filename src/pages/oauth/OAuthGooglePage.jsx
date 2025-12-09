import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { fetchCurrentUser } from "@/api/authApi";

export default function OAuthGooglePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { accessToken, setUser } = useAuthStore();

  const processedRef = useRef(false);

  useEffect(() => {
    if (!accessToken) return;
    if (processedRef.current) return;
    processedRef.current = true;

    const status = params.get("status");
    const providerUserId = params.get("providerUserId");
    const provider = params.get("provider") || "google";
    const userId = params.get("userId");
    const mode = params.get("mode");

    if (!providerUserId) {
      alert("잘못된 접근입니다.");
      navigate("/", { replace: true });
      return;
    }

    const run = async () => {
      if (mode === "connect") {
        try {
          await httpClient.post("/oauth/connect", { provider, providerUserId });

          const meRes = await fetchCurrentUser();
          if (meRes.success) setUser(meRes.data);

          alert("구글 계정이 성공적으로 연동되었습니다.");
          navigate("/mypage", { replace: true });
        } catch (e) {
          console.error(e);
          alert("계정 연동 실패");
          navigate("/mypage", { replace: true });
        }
        return;
      }

      if (status === "LOGIN" && userId) {
        navigate(`/login?oauth=google&providerUserId=${providerUserId}`, {
          replace: true,
        });
        return;
      }

      if (status === "NEED_REGISTER") {
        if (!accessToken) {
          navigate(
            `/signup?provider=${provider}&providerUserId=${providerUserId}`,
            { replace: true }
          );
          return;
        }

        try {
          await httpClient.post("/oauth/connect", { provider, providerUserId });

          const meRes = await fetchCurrentUser();
          if (meRes.success) setUser(meRes.data);

          alert("구글 계정이 성공적으로 연동되었습니다.");
          navigate("/mypage", { replace: true });
        } catch (e) {
          console.error(e);
          alert("계정 연동 실패");
          navigate("/mypage", { replace: true });
        }
        return;
      }

      navigate("/", { replace: true });
    };

    run();
  }, [accessToken, params, navigate, setUser]);

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
