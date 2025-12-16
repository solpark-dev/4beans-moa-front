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

  useEffect(() => {
    setEnabled(!!user?.otpEnabled);
  }, [user, setEnabled]);

  const marketingAgreed = user
    ? user.agreeMarketing ?? user.marketing ?? false
    : false;
  const shortId = user?.userId?.split("@")[0] || user?.userId || "";

  const googleConn = Boolean(
    (user?.loginProvider || "").toLowerCase() === "google" ||
    (user?.oauthConnections || []).find(
      (c) => c.provider?.toLowerCase() === "google" && !c.releaseDate
    )
  );
  const kakaoConn = Boolean(
    (user?.loginProvider || "").toLowerCase() === "kakao" ||
    (user?.oauthConnections || []).find(
      (c) => c.provider?.toLowerCase() === "kakao" && !c.releaseDate
    )
  );

  const loginProviderLabel = getLoginProviderLabel(user);

  const isAdmin = user?.role === "ADMIN";

  const handlers = {
    goSubscription: () => navigate("/subscription"),
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
      try {
        const res = await httpClient.get(`/oauth/${provider}/auth`, {
          params: { mode: "connect" },
        });
        const body = res?.data;
        let url =
          typeof body === "string"
            ? body
            : body?.url || body?.data?.url || body?.redirectUrl;

        if (!url) {
          alert("연동을 시작할 수 없습니다. 다시 시도해 주세요.");
          return;
        }

        try {
          const u = new URL(url);
          u.searchParams.set("prompt", "login");
          url = u.toString();
        } catch {
          // URL 파싱 실패 시 원본 URL 사용
        }

        window.location.assign(url);
      } catch (e) {
        console.error(e);
        alert(
          e?.response?.data?.error?.message ||
          "소셜 연동을 시작하는 중 오류가 발생했습니다."
        );
      }
    },

    oauthRelease: async (oauthId, provider) => {
      try {
        let targetId = oauthId;

        if (!targetId && provider) {
          const conn = (user?.oauthConnections || []).find(
            (c) =>
              c.provider?.toLowerCase() === provider.toLowerCase() &&
              !c.releaseDate
          );
          targetId = conn?.oauthId;
        }

        if (!targetId) {
          alert("연동 해제 정보가 올바르지 않습니다.");
          return;
        }

        const res = await httpClient.post("/oauth/release", {
          oauthId: targetId,
        });

        if (res.success) {
          alert(`${provider.toUpperCase()} 계정 연동이 해제되었습니다.`);
          await useAuthStore.getState().fetchSession();
        } else {
          alert(res.error?.message || "소셜 계정 연동 해제에 실패했습니다.");
        }
      } catch (e) {
        console.error(e);
        alert(
          e?.response?.data?.error?.message ||
            "소셜 계정 연동 해제 중 오류가 발생했습니다."
        );
      }
    },

    formatDate,
  };

  const handleGoogleClick = () => {
    if (googleConn) return handlers.oauthRelease(googleConn.oauthId, "google");
    return handlers.oauthConnect("google");
  };

  const handleKakaoClick = () => {
    if (kakaoConn) return handlers.oauthRelease(kakaoConn.oauthId, "kakao");
    return handlers.oauthConnect("kakao");
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
        enabled: !!(user?.otpEnabled ?? enabled),
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
