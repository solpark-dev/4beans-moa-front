import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function OAuthGooglePage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const status = params.get("status");
  const provider = params.get("provider");
  const providerUserId = params.get("providerUserId");
  const userId = params.get("userId");

  useEffect(() => {
    if (!status) {
      alert("잘못된 접근입니다.");
      window.location.href = "/";
      return;
    }

    if (status === "LOGIN") {
      alert("구글 로그인 완료!");
      window.location.href = "/";
      return;
    }

    if (status === "CONNECT") {
      alert("구글 계정 연동이 완료되었습니다.");
      window.location.href = "/mypage";
      return;
    }

    if (status === "NEED_REGISTER") {
      alert("구글 계정으로 가입을 진행합니다.");
      window.location.href = `/signup?provider=${provider}&providerUserId=${providerUserId}`;
      return;
    }

    if (status === "ALREADY_CONNECTED") {
      alert("이미 다른 계정에 연동된 구글 계정입니다.");
      window.location.href = "/mypage";
      return;
    }
  }, [status, provider, providerUserId, userId]);

  return (
    <div className="pt-40 text-center">
      <h2 className="text-xl font-bold">구글 인증 처리 중...</h2>
    </div>
  );
}
