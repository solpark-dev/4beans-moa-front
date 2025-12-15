import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setTokens } = useAuthStore();

  useEffect(() => {
    const status = params.get("status");

    if (status === "LOGIN") {
      setTokens({
        accessToken: params.get("accessToken"),
        refreshToken: params.get("refreshToken"),
        accessTokenExpiresIn: Number(params.get("expiresIn")),
      });
      navigate("/", { replace: true });
      return;
    }

    if (status === "NEED_REGISTER") {
      navigate("/register/social", {
        replace: true,
        state: {
          provider: params.get("provider"),
          providerUserId: params.get("providerUserId"),
          email: params.get("email"),
        },
      });
      return;
    }

    if (status === "NEED_PHONE_CONNECT") {
      navigate("/oauth/phone-connect", {
        replace: true,
        state: {
          provider: params.get("provider"),
          providerUserId: params.get("providerUserId"),
          phone: params.get("phone"),
        },
      });
      return;
    }

    navigate("/login", { replace: true });
  }, []);

  return null;
}
