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
  const storages = [primaryStorage, secondaryStorage].filter(Boolean);
  storages.forEach((storage) => {
    PASSWORD_STORAGE_KEYS.forEach((key) => {
      try {
        storage.removeItem(key);
      } catch {
        /* ignore */
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
    console.warn("Failed to save login email", e);
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
      setErrors((prev) => ({
        ...prev,
        email: "Please enter your email.",
      }));
      return;
    }

    try {
      const IMP = await loadIamport();
      if (!IMP) {
        alert("Failed to load identity verification module.");
        return;
      }

      const startRes = await startPassAuth();
      if (!startRes.success) {
        alert(startRes.error?.message || "Identity verification start failed.");
        return;
      }

      const { impCode, merchantUid } = startRes.data;
      IMP.init(impCode);

      IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
        if (!rsp.success) {
          alert("Identity verification was canceled.");
          return;
        }

        try {
          const verifyRes = await verifyPassAuth({
            imp_uid: rsp.imp_uid,
            userId: trimmedEmail,
          });

          if (!verifyRes.success) {
            alert(
              verifyRes.error?.message || "Identity verification check failed."
            );
            return;
          }

          alert(
            "Identity verification complete. Your account has been unlocked."
          );
        } catch (e) {
          console.error(e);
          alert("Error during identity verification check.");
        }
      });
    } catch (e) {
      console.error(e);
      alert("Error during identity verification.");
    }
  }, [email]);

  const handleEmailLogin = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const nextErrors = { email: "", password: "", otp: "" };

    if (!trimmedEmail) nextErrors.email = "Please enter your email.";
    if (!trimmedPassword) nextErrors.password = "Please enter your password.";

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
        alert(response.error?.message || "Login failed.");
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
      resetOtp();
      localStorage.setItem("remember", remember ? "true" : "false");

      navigate("/", { replace: true });
    } catch (error) {
      const apiError = error?.response?.data?.error;
      const code = apiError?.code;
      const message = apiError?.message || "Login processing error.";

      if (code === "E403" && message.includes("Login failed 5 times")) {
        const start = window.confirm(
          "Login failed 5 times and your account may be locked. Verify your identity now?"
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
    remember,
    loginLoading,
    navigate,
    setField,
    setTokens,
    resetOtp,
    handleUnlockByCertification,
  ]);

  const handleOtpConfirm = useCallback(async () => {
    if (otpLoading) return;

    if (otpMode === "otp" && (!otpCode || otpCode.length !== 6)) {
      setErrors((prev) => ({
        ...prev,
        otp: "Please enter the 6-digit OTP code.",
      }));
      return;
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
        alert(res.error?.message || "OTP verification failed.");
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
    } catch (e) {
      console.error(e);
      alert("An error occurred while processing OTP verification.");
    } finally {
      setOtpLoading(false);
    }
  }, [
    otpCode,
    otpToken,
    otpMode,
    otpLoading,
    email,
    resetOtp,
    setTokens,
    navigate,
  ]);

  useEffect(() => {
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
  }, [setField, resetOtp]);

  return {
    email,
    password,
    remember,
    otpRequired,
    otpModalOpen,
    otpCode,
    otpMode,
    loginLoading,
    otpLoading,
    errors,

    setField,

    handleEmailLogin,
    handleOtpConfirm,
    handleUnlockByCertification,

    handleEmailChange: (value) => {
      setErrors((prev) => ({ ...prev, email: "" }));
      setField("email", value);
    },

    handlePasswordChange: (value) => {
      setErrors((prev) => ({ ...prev, password: "" }));
      setField("password", value);
    },

    handleKakaoLogin: async () => {
      try {
        const res = await httpClient.get("/oauth/kakao/auth", {
          params: { mode: "login" },
        });

        if (!res?.success) {
          alert(res?.error?.message || "Kakao login failed.");
          return;
        }

        const kakaoUrl = res.data.url;
        window.location.href = kakaoUrl;
      } catch (e) {
        console.error(e);
        alert("Failed to start Kakao login.");
      }
    },

    handleGoogleLogin: async () => {
      try {
        const res = await httpClient.get("/oauth/google/auth", {
          params: { mode: "login" },
        });

        if (!res?.success) {
          alert(res?.error?.message || "Google login failed.");
          return;
        }

        window.location.href = res.data.url;
      } catch (e) {
        console.error(e);
        alert("Failed to start Google login.");
      }
    },

    handleOtpChange: (value) => {
      setErrors((prev) => ({ ...prev, otp: "" }));
      if (otpMode === "otp") {
        setField("otpCode", value.replace(/\D/g, "").slice(0, 6));
      } else {
        setField("otpCode", value.trim().toUpperCase());
      }
    },

    closeOtpModal: () => {
      resetOtp();
      setErrors((prev) => ({ ...prev, otp: "" }));
    },

    switchToOtpMode: () => {
      setField("otpCode", "");
      setErrors((prev) => ({ ...prev, otp: "" }));
    },

    switchToBackupMode: () => {
      setField("otpCode", "");
      setErrors((prev) => ({ ...prev, otp: "" }));
    },
  };
};
