import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useLoginStore } from "@/store/user/loginStore";
import { useAuthStore } from "@/store/authStore";

export const useLoginPageLogic = () => {
  const navigate = useNavigate();
  const { email, password, remember, setField } = useLoginStore();
  const { setTokens } = useAuthStore();
  const [googleClient, setGoogleClient] = useState(null);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        const client = window.google.accounts.oauth2.initCodeClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          ux_mode: "popup",
          callback: (response) => {
            if (response.code) {
              onGoogleLoginSuccess(response.code);
            }
          },
        });
        setGoogleClient(client);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onGoogleLoginSuccess = async (code) => {
    try {
      const res = await httpClient.get("/oauth/google/callback", {
        params: { code },
      });

      if (res.success || res.status === "success") {

        const { status, accessToken, refreshToken, accessTokenExpiresIn, provider, providerUserId } = res.data;

        if (status === "LOGIN") {
          setTokens({ accessToken, refreshToken, accessTokenExpiresIn });
          navigate("/", { replace: true });
        } else if (status === "NEED_REGISTER" || status === "CONNECT") {
          navigate(
            `/signup?provider=${provider}&providerUserId=${providerUserId}`,
            { replace: true }
          );
        } else {
          navigate("/", { replace: true });
        }
      } else {
        alert(res.error?.message || "로그인 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error?.message || error.response?.data?.message || "구글 로그인 처리 중 오류가 발생했습니다.";
      alert(errorMsg);
    }
  };

  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      alert("카카오 SDK 로드 실패");
      return;
    }
    window.Kakao.Auth.authorize({
      redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
    });
  };

  const handleGoogleLogin = () => {
    if (googleClient) {
      googleClient.requestCode();
    } else {
      alert("Google 로그인 초기화 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await httpClient.post("/auth/login", { userId: email, password });
      if (response.success) {
        const { accessToken, refreshToken, accessTokenExpiresIn } = response.data;
        setTokens({ accessToken, refreshToken, accessTokenExpiresIn });
        window.location.href = "/";
      } else {
        alert("로그인 실패");
      }
    } catch (error) {
      console.error(error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return {
    email,
    password,
    remember,
    setField,
    handleEmailLogin,
    handleKakaoLogin,
    handleGoogleLogin,
  };
};