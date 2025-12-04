// src/services/logic/updatePwdLogic.js
import httpClient from "@/api/httpClient";
import { useUpdatePwdStore } from "@/store/user/updatePwdStore";

export function useUpdatePwdLogic() {
  const {
    currentPassword,
    newPassword,
    newPasswordConfirm,
    setError,
    setVerified,
    setModal,
  } = useUpdatePwdStore();

  // 🔐 1단계: 현재 비밀번호 확인
  const verify = async () => {
    setError("current", "");

    if (!currentPassword) {
      setError("current", "현재 비밀번호를 입력해 주세요.");
      return false;
    }

    try {
      await httpClient.post("/users/checkCurrentPassword", {
        currentPassword,
        newPassword: "",
        newPasswordConfirm: "",
      });

      setVerified(true);
      setModal(false);
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.error?.message || "비밀번호가 일치하지 않습니다.";
      setError("current", msg);
      return false;
    }
  };

  // 🔐 2단계: 새로운 비밀번호 변경
  const update = async () => {
    setError("rule", "");
    setError("confirm", "");

    if (!newPassword || !newPasswordConfirm) {
      setError("rule", "새 비밀번호와 확인을 모두 입력해 주세요.");
      return false;
    }

    if (newPassword !== newPasswordConfirm) {
      setError("confirm", "비밀번호가 일치하지 않습니다.");
      return false;
    }

    // 형식 검사
    try {
      await httpClient.post("/users/checkPasswordFormat", {
        password: newPassword,
        passwordConfirm: newPasswordConfirm,
      });
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.message ||
        "비밀번호 형식 오류";
      setError("rule", msg);
      return false;
    }

    // 실제 변경 요청
    try {
      await httpClient.post("/users/updatePwd", {
        currentPassword: "",
        newPassword,
        newPasswordConfirm,
      });

      alert("비밀번호 변경 완료! 다시 로그인해 주세요.");
      window.location.href = "/login";
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.message ||
        "비밀번호 변경 중 오류 발생";
      alert(msg);
      return false;
    }
  };

  return { verify, update };
}
