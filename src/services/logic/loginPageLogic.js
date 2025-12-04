// src/services/logic/loginPageLogic.js
import { login, startRestoreVerify, fetchCurrentUser } from "@/api/authApi";
import { useLoginStore } from "@/store/user/loginStore";
import { useAuthStore } from "@/store/authStore";

export function initLoginPage() {
  const emailEl = document.getElementById("loginEmail");
  const pwEl = document.getElementById("loginPassword");
  const btn = document.getElementById("btnLogin");

  if (!emailEl || !pwEl || !btn) return;

  const enterHandler = (e) => {
    if (e.key === "Enter") {
      btn.click();
    }
  };

  emailEl.addEventListener("keyup", enterHandler);
  pwEl.addEventListener("keyup", enterHandler);
}

export const loginHandler = async () => {
  const { email, password } = useLoginStore.getState();
  const { setTokens, setUser, clearAuth } = useAuthStore.getState();

  try {
    const res = await login({ userId: email, password });

    if (res.success) {
      const tokenData = res.data;

      if (tokenData) {
        setTokens({
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          accessTokenExpiresIn: tokenData.accessTokenExpiresIn,
        });

        try {
          const meRes = await fetchCurrentUser();
          if (meRes.success) {
            setUser(meRes.data);
          }
        } catch (e) {
          console.log(e);
          clearAuth();
        }
      }

      window.location.href = "/";
      return;
    }

    if (!res.success && res.error?.code === "U410") {
      const ok = window.confirm("탈퇴한 계정입니다.\n복구하시겠습니까?");
      if (!ok) return;

      const result = await startRestoreVerify(email);
      if (result.success) {
        window.location.href = result.data.passAuthUrl;
        return;
      }

      alert(result.error?.message || "복구 인증을 시작할 수 없습니다.");
      return;
    }

    alert(res.error?.message || "로그인 실패");
  } catch (err) {
    const msg =
      err.response?.data?.error?.message ||
      err.response?.data?.message ||
      "서버 오류로 로그인에 실패했습니다.";

    alert(msg);
  }
};

export const googleLoginHandler = () => {
  window.location.href = "/api/oauth/google/auth";
};
