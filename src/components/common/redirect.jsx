import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PassRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const impUid = params.get("imp_uid");
    const purpose = params.get("purpose");

    if (!impUid) {
      alert("본인인증 정보가 없습니다.");
      navigate(-1);
      return;
    }

    sessionStorage.setItem("PASS_IMP_UID", impUid);
    sessionStorage.setItem("PASS_PURPOSE", purpose || "");

    switch (purpose) {
      case "signup":
        navigate("/signup", { replace: true });
        break;

      case "login-unlock":
        navigate("/login", { replace: true });
        break;

      case "update-user":
        navigate("/mypage", { replace: true });
        break;

      default:
        navigate("/", { replace: true });
    }
  }, [navigate]);

  return <div>본인인증 처리 중입니다...</div>;
}
