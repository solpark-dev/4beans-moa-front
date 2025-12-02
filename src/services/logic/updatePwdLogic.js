// src/services/logic/updatePwdLogic.js
import httpClient from "@/api/httpClient";

function showToast(message, type) {
  alert(`[${type.toUpperCase()}] ${message}`);
}

export function initPasswordUpdatePage(props) {
  setupVerificationListener(props);
}

function setupVerificationListener({ setIsModalOpen, setIsVerified }) {
  const btnVerify = document.getElementById("btnVerifyCurrentPassword");

  if (!btnVerify) return;

  const handler = async () => {
    const currentPassword = document.getElementById("currentPassword").value;
    const errorElement = document.getElementById("currentPasswordError");

    errorElement.classList.add("hidden");

    if (!currentPassword) {
      showToast("현재 비밀번호를 입력해 주세요.", "error");
      return;
    }

    try {
      // ★ 반드시 앞에 "/" 붙여야 /api/users 요청됨
      await httpClient.post("/users/checkCurrentPassword", {
        currentPassword,
        newPassword: "",
        newPasswordConfirm: "",
      });

      setIsModalOpen(false);
      setIsVerified(true);

      setTimeout(() => {
        setupUpdatePasswordListener();
      }, 50);
    } catch (error) {
      errorElement.textContent =
        error.response?.data?.error?.message ||
        error.message ||
        "비밀번호가 일치하지 않습니다.";
      errorElement.classList.remove("hidden");
    }
  };

  btnVerify.addEventListener("click", handler);
}

function setupUpdatePasswordListener() {
  const btnUpdate = document.getElementById("btnUpdatePassword");
  if (!btnUpdate) return;

  const handler = async () => {
    const newPassword = document.getElementById("newPassword").value;
    const newPasswordConfirm =
      document.getElementById("newPasswordConfirm").value;

    const ruleErrorElement = document.getElementById("newPasswordRuleError");
    const confirmErrorElement = document.getElementById(
      "newPasswordConfirmError"
    );

    ruleErrorElement.classList.add("hidden");
    confirmErrorElement.classList.add("hidden");

    if (!newPassword || !newPasswordConfirm) {
      showToast("새 비밀번호와 확인을 모두 입력해 주세요.", "error");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      confirmErrorElement.textContent = "비밀번호가 일치하지 않습니다.";
      confirmErrorElement.classList.remove("hidden");
      return;
    }

    try {
      // ✔ 비밀번호 형식 검사
      await httpClient.post("/users/checkPasswordFormat", {
        password: newPassword,
        passwordConfirm: newPasswordConfirm,
      });

      // ✔ 서버 비밀번호 변경
      await httpClient.post("/users/updatePwd", {
        currentPassword: "",
        newPassword,
        newPasswordConfirm,
      });

      showToast(
        "비밀번호가 성공적으로 변경되었습니다. 다시 로그인해 주세요.",
        "success"
      );

      window.location.href = "/login";
    } catch (error) {
      const errMsg =
        error.response?.data?.error?.message ||
        error.message ||
        "비밀번호 변경 중 오류가 발생했습니다.";

      if (
        errMsg.includes("형식") ||
        errMsg.includes("8") ||
        errMsg.includes("특수문자") ||
        errMsg.includes("규칙")
      ) {
        ruleErrorElement.textContent = errMsg;
        ruleErrorElement.classList.remove("hidden");
        return;
      }

      showToast(errMsg, "error");
    }
  };

  btnUpdate.addEventListener("click", handler);
}
