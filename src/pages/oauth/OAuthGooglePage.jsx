import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { fetchCurrentUser, connectSocial } from "@/api/authApi";

export default function OAuthGooglePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const {
    accessToken: storedToken,
    setTokens,
    setUser,
    clearAuth,
  } = useAuthStore();

  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const status = params.get("status");
    const mode = params.get("mode") || "login";
    const provider = params.get("provider");
    const providerUserId = params.get("providerUserId");
    const fromUserId = params.get("fromUserId");
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const accessTokenExpiresInParam = params.get("accessTokenExpiresIn");
    const accessTokenExpiresIn = accessTokenExpiresInParam
      ? Number(accessTokenExpiresInParam)
      : undefined;

    if (!status) {
      alert("잘못된 접근입니다.");
      navigate("/", { replace: true });
      return;
    }

    const run = async () => {
      if (
        status === "NEED_TRANSFER" &&
        provider &&
        providerUserId &&
        fromUserId
      ) {
        const ok = window.confirm(
          "이 구글 계정은 다른 계정에 연결되어 있습니다.\n현재 로그인한 계정으로 소셜 로그인을 이전하시겠습니까?"
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
            alert("소셜 계정 이전 중 오류가 발생했습니다.");
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
          refreshToken: refreshToken || "",
          accessTokenExpiresIn: accessTokenExpiresIn || 0,
        });

        try {
          const meRes = await fetchCurrentUser();
          if (meRes.success) {
            setUser(meRes.data);
          }
          if (mode === "connect") {
            navigate("/mypage", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } catch (e) {
          console.error(e);
          clearAuth();
          navigate("/login", { replace: true });
        }
        return;
      }

      if (status === "NEED_REGISTER" && provider && providerUserId) {
        if (storedToken) {
          try {
            await connectSocial(provider, providerUserId);
            alert("구글 계정이 성공적으로 연동되었습니다.");

            const meRes = await fetchCurrentUser();
            if (meRes.success) {
              setUser(meRes.data);
            }

            navigate("/mypage", { replace: true });
          } catch (err) {
            console.error(err);
            const msg =
              err.response?.data?.message || err.message || "계정 연동 실패";
            alert(msg);
            navigate("/mypage", { replace: true });
          }
          return;
        }

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

      if (status === "LOGIN") {
        navigate("/", { replace: true });
        return;
      }

      navigate("/", { replace: true });
    };

    run();
  }, [params, navigate, setTokens, setUser, clearAuth, storedToken]);

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
