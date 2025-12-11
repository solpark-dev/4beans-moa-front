import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm({
  email,
  password,
  remember,
  errors,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  onUnlock,
  isLoginDisabled,
  loginLoading,
}) {
  return (
    <div className="space-y-6 px-6 pb-4">
      <div className="space-y-1">
        <Label htmlFor="loginEmail" className="text-xs md:text-sm text-gray-800">
          이메일
        </Label>
        <Input
          id="loginEmail"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="loginPassword"
          className="text-xs md:text-sm text-gray-800"
        >
          비밀번호
        </Label>
        <Input
          id="loginPassword"
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <div className="flex justify-between items-center text-xs md:text-sm mt-1">
        <label className="flex gap-2 items-center text-gray-700">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => onRememberChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
          />
          <span>아이디 기억하기</span>
        </label>

        <div className="flex gap-3 text-indigo-600">
          <button
            className="text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline text-xs md:text-sm font-medium"
            role="link"
            data-href="/signup"
          >
            회원가입
          </button>
          <button
            className="text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline text-xs md:text-sm font-medium"
            role="link"
            data-href="/find-email"
          >
            이메일 찾기
          </button>
        </div>
      </div>

      <Button
        id="btnLogin"
        onClick={onSubmit}
        className="w-full h-11 text-sm md:text-base font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={isLoginDisabled}
      >
        {loginLoading ? "로그인 중..." : "로그인"}
      </Button>

      <button
        type="button"
        onClick={onUnlock}
        className="w-full text-[11px] text-indigo-600 hover:text-indigo-700 text-right mt-1 underline-offset-2 hover:underline font-medium"
      >
        본인인증으로 계정 잠금 해제
      </button>

      <div className="flex items-center gap-3 pt-2">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-[11px] text-gray-400">다른 계정으로 계속하기</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>
    </div>
  );
}
