import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { fetchCurrentUser } from "@/api/authApi";

export default function OAuthGooglePage() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const mode = params.get("mode") || "login";
  const navigate = useNavigate();

  const { setTokens, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!code) {
      alert("구글 인가 코드가 없습니다. 다시 로그인해 주세요.");
      navigate("/login", { replace: true });
      return;
    }

    const run = async () => {
      try {
        const res = await httpClient.get("/oauth/google/callback", {
          params: { code, mode },
        });

        if (!res.success) {
          alert(res.error?.message || "구글 로그인에 실패했습니다.");
          navigate("/login", { replace: true });
          return;
        }

        const {
          status,
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          provider,
          providerUserId,
          fromUserId,
        } = res.data || {};

        if (
          status === "NEED_TRANSFER" &&
          provider &&
          providerUserId &&
          fromUserId
        ) {
          const ok = window.confirm(
            "이 구글 계정은 다른 간편가입 계정에 연결되어 있습니다.\n현재 로그인한 계정으로 소셜 로그인을 이전하시겠습니까?"
          );

          if (ok) {
            try {
              const transferRes = await httpClient.post("/oauth/transfer", {
                provider,
                providerUserId,
                fromUserId,
              });

              if (!transferRes.success) {
                alert(
                  transferRes.error?.message || "소셜 계정 이전에 실패했습니다."
                );
                navigate("/mypage", { replace: true });
                return;
              }

              try {
                const meRes = await fetchCurrentUser();
                if (meRes.success) {
                  setUser(meRes.data);
                }
              } catch (e) {
                console.error(e);
                clearAuth();
              }

              alert("구글 계정이 현재 계정으로 이전되었습니다.");
              navigate("/mypage", { replace: true });
              return;
            } catch (e) {
              console.error(e);
              alert(
                e.response?.data?.error?.message ||
                  e.response?.data?.message ||
                  "소셜 계정 이전 중 오류가 발생했습니다."
              );
              navigate("/mypage", { replace: true });
              return;
            }
          } else {
            navigate("/mypage", { replace: true });
            return;
          }
        }

        if (accessToken) {
          setTokens({
            accessToken,
            refreshToken,
            accessTokenExpiresIn,
          });

          try {
            const meRes = await fetchCurrentUser();
            if (meRes.success) {
              setUser(meRes.data);
            }
          } catch (e) {
            console.error(e);
            clearAuth();
            navigate("/login", { replace: true });
            return;
          }
        }

        if (status === "NEED_REGISTER" && provider && providerUserId) {
          navigate(
            `/signup?provider=${encodeURIComponent(
              provider
            )}&providerUserId=${encodeURIComponent(providerUserId)}`,
            { replace: true }
          );
          return;
        }

        if (mode === "connect") {
          navigate("/mypage", { replace: true });
          return;
        }

        navigate("/", { replace: true });
      } catch (err) {
        console.error(err);
        alert(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "구글 로그인 처리 중 오류가 발생했습니다."
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
          구글 계정 확인 중...
        </div>
        <div className="text-sm text-slate-400">
          잠시만 기다려 주세요. MoA와 안전하게 연결하고 있습니다.
        </div>
      </div>
    </div>
  );
}
