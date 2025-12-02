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
        userId: email.value,
        password: pw.value,
      };

      try {
        const res = await login(data);
        const { success, error } = res;

        if (success) {
          window.location.href = "/";
          return;
        }

        if (!success && error?.code === "U410") {
          const ok = window.confirm(
            "탈퇴한 계정입니다.\n복구하시겠습니까? (본인인증 필요)"
          );

          if (ok) {
            try {
              const result = await startRestoreVerify(email.value);

              if (result.success) {
                // PASS 인증 URL로 이동
                window.location.href = result.data.passAuthUrl;
                return;
              } else {
                alert(
                  result.error?.message || "복구 인증을 시작할 수 없습니다."
                );
              }
            } catch (err) {
              console.log(err);
              alert(
                err.response?.data?.error?.message ||
                  "복구 요청 중 오류가 발생했습니다."
              );
            }
          }

          return;
        }

        alert(error?.message || "로그인 실패");
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
      window.location.href = "/api/oauth/kakao/auth";
    };
  }

  if (google) {
    google.onclick = () => {
      window.location.href = "/api/oauth/google/auth";
    };
  }
}
