import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function OAuthSocialLoginPage() {
  const [params] = useSearchParams();

  const provider = params.get("provider");
  const userId = params.get("userId");

  useEffect(() => {
    if (provider && userId) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="pt-40 text-center text-lg text-gray-600">
      소셜 로그인 중입니다...
    </div>
  );
}
