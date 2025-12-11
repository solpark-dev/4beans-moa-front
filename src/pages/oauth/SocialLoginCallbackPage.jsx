import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";

export default function SocialLoginCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await httpClient.get("/users/me");

        if (res.success) {
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    }

    checkSession();
  }, [navigate]);

  return <div>소셜 로그인 처리중...</div>;
}
