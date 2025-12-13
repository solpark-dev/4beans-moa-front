import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { useOtpStore } from "@/store/user/otpStore";
import { otpHandlers } from "@/hooks/user/useOtp";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 10);
}

export const useMyPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { enabled, modalOpen, qrUrl, code, loading, setEnabled } =
    useOtpStore();

  const otpActionHandlers = otpHandlers();

  const getLoginProviderLabel = (user) => {
    if (!user) return "EMAIL";

    const raw =
      user.loginProvider ||
      user.provider ||
      user.lastLoginType ||
      (user.oauthConnections || []).find((c) => c.provider && !c.releaseDate)
        ?.provider;

    const p = (raw || "").toString().toLowerCase();

    if (p === "kakao") return "KAKAO";
    if (p === "google") return "GOOGLE";
    if (p === "password" || p === "local" || p === "email") return "EMAIL";

    return "EMAIL";
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await httpClient.get("/users/me");
        const { success, data } = res;

        if (!success || !data) {
          alert("Login required. Please sign in again.");
          navigate("/login", { replace: true });
          return;
        }

        setUser(data);
        setEnabled(!!data.otpEnabled);
      } catch (e) {
        console.error(e);
        alert("Login required. Please sign in again.");
        navigate("/login", { replace: true });
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [user, setUser, setEnabled, navigate]);

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

  const loginProviderLabel = getLoginProviderLabel(user);

  const isAdmin = user?.role === "ADMIN";

  const handlers = {
    goSubscription: () => navigate("/subscription/list"),
    goMyParties: () => navigate("/my-parties"),
    goChangePwd: () => navigate("/mypage/password"),
    goWallet: () => navigate("/user/wallet"),
    goPayment: () => navigate("/payment/method/list"),
    goFinancialHistory: () => navigate("/user/financial-history"),
    goEditUser: () => navigate("/mypage/edit"),
    goAdminUserList: () => navigate("/admin/users"),
    goAdminBlacklist: () => navigate("/admin/blacklist"),
    goAdminHome: () => navigate("/admin"),
    goBlacklistAdd: (userId) => navigate(`/admin/blacklist/add?user=${userId}`),
    goDeleteUser: () => navigate("/mypage/delete"),

    oauthConnect: async (provider) => {
      window.location.href =
        `https://moamoa.cloud:8443/api/oauth/${provider}/auth?mode=connect`;
    },

        oauthRelease: async (oauthId) => {
      try {
        const res = await httpClient.post("/oauth/release", { oauthId });

        if (res.success) {
          alert("Social account has been unlinked.");
          window.location.reload();
        } else {
          alert(res.error?.message || "Failed to unlink social account.");
        }
      } catch (e) {
        console.error(e);
        alert("An error occurred while unlinking the social account.");
      }
    },

    formatDate,
  };

  const handleGoogleClick = () => {
    if (googleConn) handlers.oauthRelease(googleConn.oauthId);
    else handlers.oauthConnect("google");
  };

  const handleKakaoClick = () => {
    if (kakaoConn) handlers.oauthRelease(kakaoConn.oauthId);
    else handlers.oauthConnect("kakao");
  };

  const handleOtpModalChange = (isOpen) => {
    if (!isOpen) {
      otpActionHandlers.closeModal();
    }
  };

  return {
    state: {
      user,
      isAdmin,
      shortId,
      marketingAgreed,
      googleConn,
      kakaoConn,
      loginProvider: loginProviderLabel,
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




