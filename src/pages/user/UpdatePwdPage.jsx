// src/pages/user/UpdatePwdPage.jsx (View 전용)
import { useState, useEffect } from "react";
import PasswordVerificationModal from "../../components/modal/PasswordVerificationModal";
import { initPasswordUpdatePage } from "../../services/logic/updatePwdLogic";

export default function UpdatePwdPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const handleCloseAndBack = () => {
    setIsModalOpen(false);
    window.history.back();
  };

  useEffect(() => {
    initPasswordUpdatePage({ setIsModalOpen, setIsVerified });

    return () => {};
  }, []);

  return (
    <div className="flex flex-col items-center pt-28 pb-20 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">비밀번호 변경</h2>
      <p className="text-gray-500 mb-8 text-sm">
        안전한 계정 관리를 위해 비밀번호를 주기적으로 변경해 주세요.{" "}
      </p>{" "}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-8 space-y-6">
        {" "}
        {isVerified ? (
          <div id="passwordUpdateStep2" className="space-y-4">
            {" "}
            <p className="mb-4 text-sm text-gray-600">
              새로운 비밀번호를 입력해 주세요. (영문, 숫자, 특수문자 중
              2가지이상, 8~20자){" "}
            </p>{" "}
            <div className="space-y-2">
              <p className="text-sm font-semibold">새 비밀번호</p>{" "}
              <input
                id="newPassword"
                type="password"
                placeholder="새 비밀번호"
                className="w-full border rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
              />{" "}
              <p
                id="newPasswordRuleError"
                className="text-red-500 text-xs hidden"
              >
                비밀번호 형식이 올바르지 않습니다.{" "}
              </p>{" "}
            </div>{" "}
            <div className="space-y-2">
              {" "}
              <p className="text-sm font-semibold">새 비밀번호 확인</p>{" "}
              <input
                id="newPasswordConfirm"
                type="password"
                placeholder="새 비밀번호 확인"
                className="w-full border rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
              />{" "}
              <p
                id="newPasswordConfirmError"
                className="text-red-500 text-xs hidden"
              >
                비밀번호가 일치하지 않습니다.{" "}
              </p>{" "}
            </div>{" "}
            <button
              id="btnUpdatePassword"
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-150"
              type="button"
            >
              비밀번호 변경{" "}
            </button>{" "}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            현재 비밀번호 확인 중...{" "}
          </div>
        )}{" "}
      </div>{" "}
      <PasswordVerificationModal
        isOpen={isModalOpen}
        onClose={handleCloseAndBack}
      />{" "}
    </div>
  );
}
