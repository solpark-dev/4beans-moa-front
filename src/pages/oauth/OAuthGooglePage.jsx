import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";

export default function OAuthGooglePage() {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state") || "login";

        if (!code) {
          alert("Google 인증 코드가 존재하지 않습니다.");
          navigate("/login", { replace: true });
          return;
        }

        const res = await httpClient.get("/oauth/google/callback", {
          params: { code, mode: state },
        });

        if (!res.success) {
          alert(res.error?.message || "구글 로그인 실패");
          navigate("/login", { replace: true });
          return;
        }

        const data = res.data;

        if (data.status === "NEED_REGISTER") {
          navigate("/register/social", {
            state: {
              provider: "google",
              providerUserId: data.providerUserId,
            },
          });
          return;
        }

        if (data.status === "CONNECT") {
          alert("구글 계정이 정상적으로 연결되었습니다.");
          navigate("/mypage", { replace: true });
          return;
        }

        if (data.status === "LOGIN") {
          const { accessToken, refreshToken, accessTokenExpiresIn } = data;

          setTokens({ accessToken, refreshToken, accessTokenExpiresIn });

          const me = await httpClient.get("/users/me");
          if (me.success) {
            setUser(me.data);
          }

          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error(err);
        alert("Google 인증 처리 중 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [navigate, setTokens, setUser]);

  return (
    <div className="w-full h-screen flex items-center justify-center text-lg">
      Google 로그인 처리 중...
    </div>
  );
}
