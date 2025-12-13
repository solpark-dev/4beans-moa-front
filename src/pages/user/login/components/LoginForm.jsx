import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const FIELD_CLASS =
  "bg-white border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm text-slate-900";

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
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-2">
        <Label
          htmlFor="loginEmail"
          className="text-[13px] font-bold text-slate-500"
        >
          Email
        </Label>
        <Input
          id="loginEmail"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className={`${FIELD_CLASS} focus-visible:ring-indigo-500 focus-visible:border-indigo-500`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="loginPassword"
          className="text-[13px] font-bold text-slate-500"
        >
          Password
        </Label>
        <Input
          id="loginPassword"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className={`${FIELD_CLASS} focus-visible:ring-indigo-500 focus-visible:border-indigo-500`}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <div className="flex justify-between items-center text-[11px] md:text-xs font-semibold text-slate-500">
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => onRememberChange(e.target.checked)}
            className="h-4 w-4 rounded border-black text-indigo-600 focus:ring-0"
          />
          Remember me
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            className="text-[11px] md:text-xs font-black border-b border-black/40"
            role="link"
            data-href="/signup"
          >
            Sign up
          </button>
          <button
            type="button"
            className="text-[11px] md:text-xs font-black border-b border-black/40"
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
        className="w-full h-12 text-sm md:text-base font-black rounded-[18px] border-4 border-black bg-indigo-600 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        disabled={isLoginDisabled}
      >
        {loginLoading ? "Logging in..." : "Log in"}
      </Button>

      <button
        type="button"
        onClick={onUnlock}
        className="w-full text-[11px] font-black text-slate-500 text-right border-b border-transparent"
      >
        Trouble logging in?
      </button>
    </form>
  );
}
