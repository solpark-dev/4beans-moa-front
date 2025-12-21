import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PassRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const impUid = params.get("imp_uid") || "";
    const purpose = params.get("purpose") || "";
    const returnTo = params.get("return_to") || "";

    if (!impUid) {
      alert("본인인증 정보가 없습니다.");
      navigate(-1);
      return;
    }

    sessionStorage.setItem("PASS_IMP_UID", impUid);
    sessionStorage.setItem("PASS_PURPOSE", purpose);

    if (returnTo && returnTo.startsWith("/")) {
      navigate(returnTo, { replace: true });
      return;
    }

    switch (purpose) {
      case "signup":
        navigate("/signup", { replace: true });
        return;
      case "login-unlock":
      case "login-restore":
        navigate("/login", { replace: true });
        return;
      case "update-user-phone":
        navigate("/mypage/edit", { replace: true });
        return;
      case "reset-password":
        navigate("/reset-password", { replace: true });
        return;
      case "phone-connect":
        navigate("/oauth/phone-connect", { replace: true });
        return;
      default:
        navigate("/", { replace: true });
    }
  }, [navigate]);

  return <div>본인인증 처리 중입니다...</div>;
}
