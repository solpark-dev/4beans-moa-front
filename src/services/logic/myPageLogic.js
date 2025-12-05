// src/services/logic/myPageLogic.js
import httpClient from "@/api/httpClient";
import { useMyPageStore } from "@/store/user/myPageStore";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 10);
}

export async function initMyPage() {
  try {
    const res = await httpClient.get("/users/me");
    const { success, data } = res;

    if (!success || !data) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    useMyPageStore.getState().setUser(data);
  } catch (e) {
    console.log(e);
    alert("로그인이 필요합니다.");
    window.location.href = "/login";
  }
}

export function myPageHandlers() {
  return {
    goSubscription: () => (window.location.href = "/subscription/list"),
    goMyParties: () => (window.location.href = "/my-parties"),
    goChangePwd: () => (window.location.href = "/mypage/password"),
    goWallet: () => (window.location.href = "/user/wallet"),
    goPayment: () => (window.location.href = "/payment/method/list"),
    goFinancialHistory: () =>
      (window.location.href = "/user/financial-history"),
    goEditUser: () => (window.location.href = "/mypage/edit"),

    goAdminUserList: () => (window.location.href = "/admin/users"),
    goAdminBlacklist: () => (window.location.href = "/admin/blacklist"),
    goAdminHome: () => (window.location.href = "/admin"),
    goBlacklistAdd: (userId) =>
      (window.location.href = `/admin/blacklist/add?user=${userId}`),

    // 🔹 여기 추가된 부분
    goDeleteUser: () => (window.location.href = "/mypage/delete"),

    oauthConnect: (provider) => {
      if (provider === "kakao") {
        if (!window.Kakao) {
          alert("카카오 인증을 사용할 수 없습니다.");
          return;
        }

        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
        }

        const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

        window.Kakao.Auth.authorize({
          redirectUri,
        });
        return;
      }

      if (provider === "google") {
        window.location.href = "/api/oauth/google/auth?mode=connect";
        return;
      }

      window.location.href = `/api/oauth/${provider}/auth`;
    },

    oauthRelease: async (oauthId) => {
      try {
        const res = await httpClient.post("/oauth/release", { oauthId });
        if (res.success) {
          alert("연동이 해제되었습니다.");
          window.location.reload();
        }
      } catch (e) {
        console.log(e);
        alert("연동 해제 중 오류 발생");
      }
    },

    formatDate,
  };
}
