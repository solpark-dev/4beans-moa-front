import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useLoginStore } from "@/store/user/loginStore";
import { useAuthStore } from "@/store/authStore";

const loadIamport = () =>
  new Promise((resolve, reject) => {
    if (window.IMP) {
      resolve(window.IMP);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.IMP);
    script.onerror = reject;
    document.body.appendChild(script);
  });

export const useLoginPageLogic = () => {
  const navigate = useNavigate();
  const {
    email,
    password,
    remember,
    otpRequired,
    otpModalOpen,
    otpCode,
    otpToken,
    setField,
    resetOtp,
  } = useLoginStore();
  const { setTokens } = useAuthStore();

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleUnlockByCertification = useCallback(async () => {
    if (!email) {
      alert("먼저 이메일을 입력해주세요.");
      return;
    }

    try {
      const IMP = await loadIamport();
      if (!IMP) {
        alert("본인인증 모듈 로드 실패");
        return;
      }

      const startRes = await httpClient.get("/users/pass/start");
      if (!startRes.success) {
        alert(startRes.error?.message || "본인인증 시작 실패");
        return;
      }

      const { impCode, merchantUid } = startRes.data;
      IMP.init(impCode);

      IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
        if (!rsp.success) {
          alert("본인인증이 취소되었거나 실패했습니다.");
          return;
        }

        try {
          const verifyRes = await httpClient.post("/users/pass/verify", {
            imp_uid: rsp.imp_uid,
            userId: email,
          });

          if (!verifyRes.success) {
            alert(verifyRes.error?.message || "본인인증 검증 실패");
            return;
          }

          alert("본인인증 완료! 계정 잠금이 해제되었습니다.");
        } catch (e) {
          console.error(e);
          alert("본인인증 검증 과정에서 오류가 발생했습니다.");
        }
      });
    } catch (e) {
      console.error(e);
      alert("본인인증 도중 오류가 발생했습니다.");
    }
  }, [email]);

  const handleEmailLogin = useCallback(async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await httpClient.post("/auth/login", {
        userId: email,
        password,
      });

      if (!response.success) {
        alert("로그인 실패");
        return;
      }

      const data = response.data;

      if (data.otpRequired) {
        setField("otpRequired", true);
        setField("otpModalOpen", true);
        setField("otpToken", data.otpToken);
        setField("otpCode", "");
        return;
      }

      const { accessToken, refreshToken, accessTokenExpiresIn } = data;

      setTokens({ accessToken, refreshToken, accessTokenExpiresIn });

      const me = await httpClient.get("/users/me");

      if (me?.success) {
        useAuthStore.getState().setUser(me.data);
      }

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);

      const apiError = error?.response?.data?.error;
      const code = apiError?.code;
      const message = apiError?.message || "로그인 중 오류가 발생했습니다.";

      if (code === "E403" && message.includes("로그인 5회 실패")) {
        const start = window.confirm(
          "로그인 5회 실패로 계정이 잠금 처리되었습니다.\n본인인증으로 즉시 잠금을 해제하시겠습니까?"
        );
        if (start) {
          await handleUnlockByCertification();
        }
        return;
      }

      alert(code ? `[${code}] ${message}` : message);
    }
  }, [
    email,
    password,
    navigate,
    setTokens,
    setField,
    handleUnlockByCertification,
  ]);

  const handleOtpChange = (value) => {
    const onlyNumber = value.replace(/\D/g, "").slice(0, 6);
    setField("otpCode", onlyNumber);
  };

  const handleOtpConfirm = useCallback(async () => {
    if (!otpCode || otpCode.length !== 6) {
      alert("6자리 OTP 코드를 입력해주세요.");
      return;
    }

    try {
      const res = await httpClient.post("/auth/login/otp-verify", {
        code: otpCode,
        otpToken,
      });

      if (!res.success) {
        const apiError = res.error;
        const code = apiError?.code;
        const message = apiError?.message || "OTP 인증에 실패했습니다.";
        alert(code ? `[${code}] ${message}` : message);
        return;
      }

      const { accessToken, refreshToken, accessTokenExpiresIn } = res.data;

      setTokens({ accessToken, refreshToken, accessTokenExpiresIn });

      const me = await httpClient.get("/users/me");

      if (me?.success) {
        useAuthStore.getState().setUser(me.data);
      }

      resetOtp();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      const apiError = error?.response?.data?.error;
      const code = apiError?.code;
      const message = apiError?.message || "OTP 인증 중 오류가 발생했습니다.";
      alert(code ? `[${code}] ${message}` : message);
    }
  }, [otpCode, otpToken, navigate, resetOtp, setTokens]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "Enter") return;

      const state = useLoginStore.getState();
      if (state.otpModalOpen) {
        handleOtpConfirm();
      } else {
        handleEmailLogin();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleEmailLogin, handleOtpConfirm]);

  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      alert("카카오 SDK 로드 실패");
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }

    window.Kakao.Auth.authorize({
      redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
    });
  };

  const handleGoogleLogin = useCallback(async () => {
    if (googleLoading) return;
    try {
      setGoogleLoading(true);
      window.location.href = "/api/oauth/google/auth?mode=login";
    } finally {
      setGoogleLoading(false);
    }
  }, [googleLoading]);

  const closeOtpModal = () => {
    resetOtp();
  };

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }
  }, []);

  return {
    email,
    password,
    remember,
    otpRequired,
    otpModalOpen,
    otpCode,
    setField,
    handleEmailLogin,
    handleKakaoLogin,
    handleGoogleLogin,
    handleOtpChange,
    handleOtpConfirm,
    closeOtpModal,
    handleUnlockByCertification,
  };
};
