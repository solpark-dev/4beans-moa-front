import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useLoginStore } from "@/store/user/loginStore";
import { useAuthStore } from "@/store/authStore";
import {
  login as apiLogin,
  startPassAuth,
  verifyPassAuth,
} from "@/api/authApi";
import { purgeLoginPasswords } from "@/store/authStore";

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

export const PASSWORD_STORAGE_KEYS = [
  "login-password",
  "password",
  "pwd",
  "user-password",
  "pwd-remember",
];

export const purgeLoginPasswordKeys = (primaryStorage, secondaryStorage) => {
  const targets = PASSWORD_STORAGE_KEYS;
  const storages = [primaryStorage, secondaryStorage].filter(Boolean);
  storages.forEach((storage) => {
    targets.forEach((key) => {
      try {
        storage.removeItem(key);
      } catch (e) {
        // ignore
      }
    });
  });
};

export const applyRememberEmail = (storage, email, remember) => {
  try {
    if (remember) {
      storage.setItem("login-email", email);
    } else {
      storage.removeItem("login-email");
    }
  } catch (e) {
    console.warn("Remember email storage failed", e);
  }
};

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
  const [otpMode, setOtpMode] = useState("otp");
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleUnlockByCertification = useCallback(async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요." }));
      return;
    }

    try {
      const IMP = await loadIamport();
      if (!IMP) {
        alert("본인인증 모듈 로드 실패");
        return;
      }

      const startRes = await startPassAuth();
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
          const verifyRes = await verifyPassAuth({
            imp_uid: rsp.imp_uid,
            userId: trimmedEmail,
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
      alert("본인인증 진행 중 오류가 발생했습니다.");
    }
  }, [email, setErrors]);

  const handleEmailLogin = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const nextErrors = { email: "", password: "", otp: "" };

    if (!trimmedEmail) nextErrors.email = "이메일을 입력해주세요.";
    if (!trimmedPassword) nextErrors.password = "비밀번호를 입력해주세요.";

    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;
    if (loginLoading) return;

    try {
      setLoginLoading(true);
      const response = await apiLogin({
        userId: trimmedEmail,
        password: trimmedPassword,
      });

      if (!response.success) {
        alert(response.error?.message || "로그인에 실패했습니다.");
        return;
      }

      const data = response.data;
      if (data.otpRequired) {
        setField("otpRequired", true);
        setField("otpModalOpen", true);
        setField("otpToken", data.otpToken);
        setField("otpUserId", trimmedEmail);
        setField("otpCode", "");
        setOtpMode("otp");
        return;
      }

      const { accessToken, refreshToken, accessTokenExpiresIn } = data;

      setTokens({ accessToken, refreshToken, accessTokenExpiresIn });

      const me = await httpClient.get("/users/me");

      if (me?.success) {
        useAuthStore.getState().setUser(me.data);
      }

      applyRememberEmail(localStorage, trimmedEmail, remember);
      purgeLoginPasswordKeys(localStorage, sessionStorage);
      setField("password", "");
      setField("otpCode", "");
      resetOtp();
      localStorage.setItem("remember", remember ? "true" : "false");
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
    } finally {
      setLoginLoading(false);
    }
  }, [
    email,
    password,
    navigate,
    setTokens,
    setField,
    handleUnlockByCertification,
    remember,
    loginLoading,
    resetOtp,
  ]);

  const handleOtpChange = (value) => {
    setErrors((prev) => ({ ...prev, otp: "" }));
    if (otpMode === "otp") {
      const onlyNumber = value.replace(/\D/g, "").slice(0, 6);
      setField("otpCode", onlyNumber);
    } else {
      setField("otpCode", value.trim().toUpperCase());
    }
  };

  const handleOtpConfirm = useCallback(async () => {
    if (otpLoading) return;

    if (otpMode === "otp") {
      if (!otpCode || otpCode.length !== 6) {
        setErrors((prev) => ({
          ...prev,
          otp: "6자리 OTP 코드를 입력해주세요.",
        }));
        return;
      }
    } else {
      if (!otpCode) {
        setErrors((prev) => ({
          ...prev,
          otp: "백업 코드를 입력해주세요.",
        }));
        return;
      }
    }

    try {
      setOtpLoading(true);
      const url =
        otpMode === "otp"
          ? "/auth/login/otp-verify"
          : "/auth/login/backup-verify";

      const res = await httpClient.post(url, {
        code: otpCode,
        otpToken,
        userId: email.trim(),
      });

      if (!res.success) {
        const apiError = res.error;
        const code = apiError?.code;
        const defaultMessage =
          otpMode === "otp"
            ? "OTP 인증에 실패했습니다."
            : "백업 코드 인증에 실패했습니다.";
        const message = apiError?.message || defaultMessage;
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
      setOtpMode("otp");
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      const apiError = error?.response?.data?.error;
      const code = apiError?.code;
      const defaultMessage =
        otpMode === "otp"
          ? "OTP 인증 처리 중 오류가 발생했습니다."
          : "백업 코드 인증 처리 중 오류가 발생했습니다.";
      const message = apiError?.message || defaultMessage;
      alert(code ? `[${code}] ${message}` : message);
    } finally {
      setOtpLoading(false);
    }
  }, [
    otpCode,
    otpToken,
    otpMode,
    navigate,
    resetOtp,
    setTokens,
    setErrors,
    otpLoading,
    email,
  ]);

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
    const origin = window.location.origin;
    const redirectUri = `${origin}/oauth/kakao`;

    if (!window.Kakao) {
      alert("카카오 SDK 로드 실패");
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }

    window.Kakao.Auth.authorize({
      redirectUri,
      state: "login",
    });
  };

  const handleGoogleLogin = useCallback(async () => {
    if (googleLoading) return;
    try {
      setGoogleLoading(true);

      const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

      const res = await httpClient.get("/oauth/google/auth", {
        params: {
          mode: "login",
          redirectUri: redirectUri,
        },
      });

      if (!res.success) {
        alert(res.error?.message || "구글 로그인 요청에 실패했습니다.");
        return;
      }

      window.location.href = res.data.url;
    } catch (e) {
      console.error(e);
      alert("구글 로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setGoogleLoading(false);
    }
  }, [googleLoading]);

  const closeOtpModal = () => {
    resetOtp();
    setOtpMode("otp");
    setErrors((prev) => ({ ...prev, otp: "" }));
  };

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }
    // 초기 진입 시 민감 값 모두 초기화
    setField("password", "");
    setField("otpCode", "");
    resetOtp();
    setErrors({ email: "", password: "", otp: "" });
    purgeLoginPasswords();

    const savedRemember = localStorage.getItem("remember") === "true";
    const savedEmail = localStorage.getItem("login-email");

    if (savedRemember && savedEmail) {
      setField("email", savedEmail);
      setField("remember", true);
    } else {
      setField("email", "");
      setField("remember", false);
    }
    purgeLoginPasswordKeys(localStorage, sessionStorage);
  }, [setField]);

  const switchToOtpMode = () => {
    setOtpMode("otp");
    setField("otpCode", "");
    setErrors((prev) => ({ ...prev, otp: "" }));
  };

  const switchToBackupMode = () => {
    setOtpMode("backup");
    setField("otpCode", "");
    setErrors((prev) => ({ ...prev, otp: "" }));
  };

  const handleEmailChange = (value) => {
    setErrors((prev) => ({ ...prev, email: "" }));
    setField("email", value);
  };

  const handlePasswordChange = (value) => {
    setErrors((prev) => ({ ...prev, password: "" }));
    setField("password", value);
  };

  return {
    email,
    password,
    remember,
    otpRequired,
    otpModalOpen,
    otpCode,
    otpMode,
    setField,
    handleEmailLogin,
    handleKakaoLogin,
    handleGoogleLogin,
    handleOtpChange,
    handleOtpConfirm,
    closeOtpModal,
    handleUnlockByCertification,
    switchToOtpMode,
    switchToBackupMode,
    loginLoading,
    otpLoading,
    errors,
    handleEmailChange,
    handlePasswordChange,
  };
};
