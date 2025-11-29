// src/pages/user/DeleteUserPage.jsx
import { useEffect } from "react";
import { initDeleteUserPage } from "../../services/logic/deleteUserLogic";

export default function DeleteUserPage() {
  useEffect(() => {
    initDeleteUserPage();
  }, []);

  return (
    <div className="flex flex-col items-center pt-28 pb-20 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">회원 탈퇴</h2>
      <p className="text-gray-500 mb-8 text-sm">
        탈퇴 사유를 선택해 주세요. 서비스 개선을 위해 소중한 의견으로 반영하겠습니다.
      </p>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-8 space-y-6">
        <div className="space-y-3 text-sm">
          <p className="font-semibold">탈퇴 사유</p>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deleteReason"
              value="NOT_USED"
              className="cursor-pointer"
            />
            서비스를 더 이상 사용하지 않음
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deleteReason"
              value="PRICE"
              className="cursor-pointer"
            />
            가격이 부담됨
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deleteReason"
              value="FUNCTION"
              className="cursor-pointer"
            />
            원하는 기능이 부족함
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deleteReason"
              value="OTHER"
              className="cursor-pointer"
            />
            기타
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">상세 사유 (선택)</p>
          <textarea
            id="deleteDetail"
            className="w-full border rounded-lg p-3 text-sm h-28"
            placeholder="기타 사유 또는 추가 의견이 있다면 입력해 주세요."
          />
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          탈퇴 시 계정 정보 및 서비스 이용 이력은 관련 법령에 따라 보관 후 파기됩니다.
          <br />
          탈퇴 후에는 동일 이메일로 재가입이 제한될 수 있습니다.
        </p>

        <button
          id="btnDeleteUser"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-semibold cursor-pointer"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
}
