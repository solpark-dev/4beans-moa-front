import { useThemeStore } from '@/store/themeStore';

// 테마별 스타일
const passwordModalThemeStyles = {
  default: {
    buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
    focusRing: 'focus:ring-indigo-500 focus:border-indigo-500',
    border: 'border',
    shadow: 'shadow-2xl',
    hoverBg: 'hover:bg-slate-50',
  },
  christmas: {
    buttonBg: 'bg-red-800 hover:bg-red-900',
    focusRing: 'focus:ring-red-800 focus:border-red-800',
    border: 'border border-gray-200',
    shadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
    hoverBg: 'hover:bg-red-50',
  },
};

export default function PasswordVerificationModal({ isOpen, onClose }) {
  const { theme } = useThemeStore();
  const themeStyle = passwordModalThemeStyles[theme] || passwordModalThemeStyles.default;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg ${themeStyle.shadow} w-full max-w-sm p-6 relative`}>
        <h3 className="text-xl font-bold mb-4">현재 비밀번호 확인</h3>

        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl ${themeStyle.hoverBg} rounded-full w-8 h-8 flex items-center justify-center transition-colors`}
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
              className={`w-full ${themeStyle.border} border-gray-200 rounded-lg p-3 text-sm ${themeStyle.focusRing} outline-none transition-all`}
            />

            <p
              id="currentPasswordError"
              className="text-red-500 text-xs hidden"
            >
              비밀번호가 일치하지 않습니다.
            </p>

            <button
              id="btnVerifyCurrentPassword"
              className={`w-full ${themeStyle.buttonBg} text-white py-3 rounded-lg text-sm font-semibold transition duration-150`}
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
