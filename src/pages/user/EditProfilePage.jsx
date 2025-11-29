// src/pages/user/EditProfilePage.jsx
import { useEffect } from "react";
import { initUpdateUserPage } from "../../services/logic/updateUserLogic";

export default function EditProfilePage() {
  useEffect(() => {
    initUpdateUserPage();
  }, []);

  return (
    <div className="flex flex-col items-center pt-28 pb-20 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">회원정보 수정</h2>
      <p className="text-gray-500 mb-8 text-sm">
        닉네임, 휴대폰 번호, 프로필 이미지를 수정할 수 있습니다.
      </p>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold">이메일(아이디)</p>
          <input
            id="editEmail"
            readOnly
            className="w-full border rounded-lg p-3 bg-gray-100 text-sm"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">닉네임</p>
          <input
            id="editNickname"
            className="w-full border rounded-lg p-3 text-sm"
            placeholder="닉네임을 입력해 주세요."
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">휴대폰 번호</p>
          <div className="flex items-end gap-2">
            <input
              id="editPhone"
              className="flex-1 border rounded-lg p-3 text-sm"
              placeholder="숫자만 입력"
            />
            <button
              id="btnEditPhonePass"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
              type="button"
            >
              PASS 본인인증
            </button>
          </div>
          <p className="text-xs text-gray-400">
            휴대폰 번호 변경 시 반드시 PASS 본인인증을 진행해 주세요.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">프로필 이미지</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 border rounded-lg bg-gray-100 overflow-hidden">
              <img
                id="editProfilePreview"
                className="hidden w-full h-full object-cover"
              />
            </div>
            <input
              id="editProfileImage"
              type="file"
              accept="image/*"
              className="text-sm"
            />
          </div>
        </div>

        <button
          id="btnUpdateUser"
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold cursor-pointer"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
