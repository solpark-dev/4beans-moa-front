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
    <form
      className="space-y-6 px-6 pb-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="loginEmail" className="text-xs md:text-sm text-gray-800">
          Email
        </Label>
        <Input
          id="loginEmail"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="loginPassword" className="text-xs md:text-sm text-gray-800">
          Password
        </Label>
        <Input
          id="loginPassword"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
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
          <span>Remember me</span>
        </label>

        <div className="flex gap-3 text-indigo-600">
          <button
            className="text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline text-xs md:text-sm font-medium"
            role="link"
            data-href="/signup"
          >
            Sign up
          </button>
          <button
            className="text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline text-xs md:text-sm font-medium"
            role="link"
            data-href="/find-email"
          >
            Find Email
          </button>
        </div>
      </div>

      <Button
        id="btnLogin"
        type="submit"
        className="w-full h-11 text-sm md:text-base font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={isLoginDisabled}
      >
        {loginLoading ? "Logging in..." : "Log in"}
      </Button>

      <button
        type="button"
        onClick={onUnlock}
        className="w-full text-[11px] text-indigo-600 hover:text-indigo-700 text-right mt-1 underline-offset-2 hover:underline font-medium"
      >
        Trouble logging in?
      </button>

      <div className="flex items-center gap-3 pt-2">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-[11px] text-gray-400">Discover secure login options</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>
    </form>
  );
}
