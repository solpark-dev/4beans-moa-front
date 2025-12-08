import { useEffect } from "react";
import httpClient from "@/api/httpClient";
import { useMyPageStore } from "@/store/user/myPageStore";
import { useOtpStore } from "@/store/user/otpStore";
import { otpHandlers } from "@/hooks/user/useOtp";

// 날짜 포맷 헬퍼 함수
function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 10);
}

export const useMyPage = () => {
  // 1. Store State
  const { user, isAdmin, setUser } = useMyPageStore();
  const { enabled, modalOpen, qrUrl, code, loading, setEnabled } =
    useOtpStore();

  // OTP 관련 로직 핸들러 가져오기 (외부 Hook)
  const otpActionHandlers = otpHandlers();

  // 2. 초기 데이터 로드 (API 호출)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await httpClient.get("/users/me");
        const { success, data } = res;

        if (!success || !data) {
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
          return;
        }

        setUser(data);
        setEnabled(!!data.otpEnabled);
      } catch (e) {
        console.error(e);
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      }
    };

    fetchUserData();
  }, [setUser, setEnabled]);

  // 3. Derived State (데이터 가공)
  const marketingAgreed = user
    ? user.agreeMarketing ?? user.marketing ?? false
    : false;
  const shortId = user?.userId?.split("@")[0] || user?.userId || "";

  const googleConn = user?.oauthConnections?.find(
    (c) => c.provider === "google" && !c.releaseDate
  );
  const kakaoConn = user?.oauthConnections?.find(
    (c) => c.provider === "kakao" && !c.releaseDate
  );

  // 4. Event Handlers (Navigation & Logic)
  const handlers = {
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
    goDeleteUser: () => (window.location.href = "/mypage/delete"),

    // 소셜 연동 로직
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
        window.Kakao.Auth.authorize({ redirectUri });
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
        console.error(e);
        alert("연동 해제 중 오류 발생");
      }
    },

    formatDate,
  };

  // View 로직용 Wrapper Functions (UI에서 바로 호출하기 쉽게 가공)
  const handleGoogleClick = () => {
    if (googleConn) {
      handlers.oauthRelease(googleConn.oauthId);
    } else {
      handlers.oauthConnect("google");
    }
  };

  const handleKakaoClick = () => {
    if (kakaoConn) {
      handlers.oauthRelease(kakaoConn.oauthId);
    } else {
      handlers.oauthConnect("kakao");
    }
  };

  const handleOtpModalChange = (isOpen) => {
    if (!isOpen) {
      otpActionHandlers.closeModal();
    }
  };

  // 5. Return Logic Object
  return {
    state: {
      user,
      isAdmin,
      shortId,
      marketingAgreed,
      googleConn,
      kakaoConn,
      otp: {
        enabled,
        modalOpen,
        qrUrl,
        code,
        loading,
      },
    },
    actions: {
      ...handlers,
      otp: otpActionHandlers,
      handleGoogleClick,
      handleKakaoClick,
      handleOtpModalChange,
    },
  };
};
