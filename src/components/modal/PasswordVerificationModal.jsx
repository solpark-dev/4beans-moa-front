export default function PasswordVerificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 relative">
        <h3 className="text-xl font-bold mb-4">현재 비밀번호 확인</h3>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <div id="passwordUpdateStep1">
          <p className="mb-4 text-sm text-gray-600">
            비밀번호를 변경하려면 현재 로그인된 비밀번호를 입력해 주세요.
          </p>

          <div className="space-y-4">
            <input
              id="currentPassword"
              type="password"
              placeholder="현재 비밀번호"
              className="w-full border rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <p
              id="currentPasswordError"
              className="text-red-500 text-xs hidden"
            >
              비밀번호가 일치하지 않습니다.
            </p>

            <button
              id="btnVerifyCurrentPassword"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-150"
              type="button"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
