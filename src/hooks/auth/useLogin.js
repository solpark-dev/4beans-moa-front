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
      setErrors((prev) => ({ ...prev, email: "?´ë©”?¼ì„ ?…ë ¥?´ì£¼?¸ìš”." }));
      return;
    }

    try {
      const IMP = await loadIamport();
      if (!IMP) {
        alert("ë³¸ì¸?¸ì¦ ëª¨ë“ˆ ë¡œë“œ ?¤íŒ¨");
        return;
      }

      const startRes = await startPassAuth();
      if (!startRes.success) {
        alert(startRes.error?.message || "ë³¸ì¸?¸ì¦ ?œìž‘ ?¤íŒ¨");
        return;
      }

      const { impCode, merchantUid } = startRes.data;
      IMP.init(impCode);

      IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
        if (!rsp.success) {
          alert("ë³¸ì¸?¸ì¦??ì·¨ì†Œ?˜ì—ˆê±°ë‚˜ ?¤íŒ¨?ˆìŠµ?ˆë‹¤.");
          return;
        }

        try {
          const verifyRes = await verifyPassAuth({
            imp_uid: rsp.imp_uid,
            userId: trimmedEmail,
          });

          if (!verifyRes.success) {
            alert(verifyRes.error?.message || "ë³¸ì¸?¸ì¦ ê²€ì¦??¤íŒ¨");
            return;
          }

          alert("ë³¸ì¸?¸ì¦ ?„ë£Œ! ê³„ì • ? ê¸ˆ???´ì œ?˜ì—ˆ?µë‹ˆ??");
        } catch (e) {
          console.error(e);
          alert("ë³¸ì¸?¸ì¦ ê²€ì¦?ê³¼ì •?ì„œ ?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.");
        }
      });
    } catch (e) {
      console.error(e);
      alert("ë³¸ì¸?¸ì¦ ì§„í–‰ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.");
    }
  }, [email, setErrors]);

  const handleEmailLogin = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const nextErrors = { email: "", password: "", otp: "" };

    if (!trimmedEmail) nextErrors.email = "?´ë©”?¼ì„ ?…ë ¥?´ì£¼?¸ìš”.";
    if (!trimmedPassword) nextErrors.password = "ë¹„ë?ë²ˆí˜¸ë¥??…ë ¥?´ì£¼?¸ìš”.";

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
        alert(response.error?.message || "ë¡œê·¸?¸ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.");
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

      if (accessToken && refreshToken) {
        setTokens({ accessToken, refreshToken, accessTokenExpiresIn });
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
      const message = apiError?.message || "ë¡œê·¸??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.";

      if (code === "E403" && message.includes("ë¡œê·¸??5???¤íŒ¨")) {
        const start = window.confirm(
          "ë¡œê·¸??5???¤íŒ¨ë¡?ê³„ì •??? ê¸ˆ ì²˜ë¦¬?˜ì—ˆ?µë‹ˆ??\në³¸ì¸?¸ì¦?¼ë¡œ ì¦‰ì‹œ ? ê¸ˆ???´ì œ?˜ì‹œê² ìŠµ?ˆê¹Œ?"
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
          otp: "6?ë¦¬ OTP ì½”ë“œë¥??…ë ¥?´ì£¼?¸ìš”.",
        }));
        return;
      }
    } else {
      if (!otpCode) {
        setErrors((prev) => ({
          ...prev,
          otp: "ë°±ì—… ì½”ë“œë¥??…ë ¥?´ì£¼?¸ìš”.",
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
            ? "OTP ?¸ì¦???¤íŒ¨?ˆìŠµ?ˆë‹¤."
            : "ë°±ì—… ì½”ë“œ ?¸ì¦???¤íŒ¨?ˆìŠµ?ˆë‹¤.";
        const message = apiError?.message || defaultMessage;
        alert(code ? `[${code}] ${message}` : message);
        return;
      }

      const { accessToken, refreshToken, accessTokenExpiresIn } = res.data;

      if (accessToken && refreshToken) {
        setTokens({ accessToken, refreshToken, accessTokenExpiresIn });
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
          ? "OTP ?¸ì¦ ì²˜ë¦¬ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤."
          : "ë°±ì—… ì½”ë“œ ?¸ì¦ ì²˜ë¦¬ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.";
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
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    if (!window.Kakao) {
      alert("ì¹´ì¹´??SDK ë¡œë“œ ?¤íŒ¨");
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
        alert(res.error?.message || "êµ¬ê? ë¡œê·¸???”ì²­???¤íŒ¨?ˆìŠµ?ˆë‹¤.");
        return;
      }

      window.location.href = res.data.url;
    } catch (e) {
      console.error(e);
      alert("êµ¬ê? ë¡œê·¸??ì²˜ë¦¬ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.");
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
    // ì´ˆê¸° ì§„ìž… ??ë¯¼ê° ê°?ëª¨ë‘ ì´ˆê¸°??
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


