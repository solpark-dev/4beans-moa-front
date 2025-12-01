// src/services/logic/loginPageLogic.js
import { login } from "@/api/authApi";

export function initLoginPage() {
  const email = document.getElementById("loginEmail");
  const pw = document.getElementById("loginPassword");
  const btn = document.getElementById("btnLogin");
  const remember = document.getElementById("loginRemember");

  const kakao = document.getElementById("btnKakaoLogin");
  const google = document.getElementById("btnGoogleLogin");

  if (!email || !pw) return;

  // ---------- 아이디 기억하기: 저장된 값 불러오기 ----------
  const savedId = localStorage.getItem("rememberId");
  if (savedId) {
    email.value = savedId;
    remember.checked = true;
  }

  // ---------- 아이디 기억하기 체크 시 처리 ----------
  if (remember) {
    remember.onchange = () => {
      if (remember.checked) {
        localStorage.setItem("rememberId", email.value);
      } else {
        localStorage.removeItem("rememberId");
      }
    };
  }

  // ---------- 이메일 입력이 바뀌면 저장된 값 업데이트 ----------
  email.oninput = () => {
    if (remember.checked) {
      localStorage.setItem("rememberId", email.value);
    }
  };

  // ---------- Enter 키로 로그인 처리 ----------
  const handleLogin = async () => {
    const data = {
      userId: email.value,
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

  // 버튼 클릭
  if (btn) {
    btn.onclick = handleLogin;
  }

  // Enter 입력: 이메일/비밀번호에서 Enter 누르면 로그인
  email.onkeydown = (e) => {
    if (e.key === "Enter") handleLogin();
  };
  pw.onkeydown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  // ---------- 소셜 로그인 ----------
  if (kakao) {
    kakao.onclick = () => {
      window.location.href = "https://localhost:8443/api/oauth/kakao/auth";
    };
  }

  if (google) {
    google.onclick = () => {
      window.location.href = "/api/auth/oauth/google";
    };
  }
}
