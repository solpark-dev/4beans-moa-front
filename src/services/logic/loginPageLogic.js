// src/services/logic/loginPageLogic.js
import { login } from "@/api/authApi";

export function initLoginPage() {
  const email = document.getElementById("loginEmail");
  const pw = document.getElementById("loginPassword");
  const btn = document.getElementById("btnLogin");

  const kakao = document.getElementById("btnKakaoLogin");
  const google = document.getElementById("btnGoogleLogin");

  if (btn) {
    btn.onclick = async () => {
      const data = {
        email: email.value,
        password: pw.value,
      };

      try {
        const res = await login(data);
        const { success, error } = res;

        if (success) {
          window.location.href = "/";
        } else {
          alert(error?.message || "로그인 실패");
        }
      } catch (error) {
        const msg =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "서버 오류로 로그인에 실패했습니다.";
        alert(msg);
      }
    };
  }

  if (kakao) {
    kakao.onclick = () => {
      window.location.href = "/api/auth/oauth/kakao";
    };
  }

  if (google) {
    google.onclick = () => {
      window.location.href = "/api/auth/oauth/google";
    };
  }
}
