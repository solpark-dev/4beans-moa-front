import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Theme-based field styles
const getFieldStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return {
        field: "bg-white border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(196,30,58,0.08)] text-sm text-slate-900",
        focus: "focus-visible:ring-[#c41e3a] focus-visible:border-[#c41e3a]",
        label: "text-gray-600",
        button: "bg-[#c41e3a] hover:bg-[#a51830] border-[#c41e3a]",
        link: "text-[#c41e3a] border-[#c41e3a]/40",
        checkbox: "text-[#c41e3a]",
      };
    case 'dark':
      return {
        field: "bg-[#0F172A] border border-gray-700 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.2)] text-sm text-white",
        focus: "focus-visible:ring-[#635bff] focus-visible:border-[#635bff]",
        label: "text-gray-400",
        button: "bg-[#635bff] hover:bg-[#5851e8] border-[#635bff]",
        link: "text-[#635bff] border-[#635bff]/40",
        checkbox: "text-[#635bff]",
      };
    case 'portrait':
      return {
        field: "bg-white/60 border border-pink-200 rounded-2xl shadow-[4px_4px_12px_rgba(255,181,197,0.15)] text-sm text-gray-900",
        focus: "focus-visible:ring-pink-400 focus-visible:border-pink-400",
        label: "text-gray-500",
        button: "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90 border-transparent",
        link: "text-pink-500 border-pink-300/40",
        checkbox: "text-pink-500",
      };
    case 'pop':
      return {
        field: "bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-sm text-black",
        focus: "focus-visible:ring-pink-500 focus-visible:border-black",
        label: "text-gray-600",
        button: "bg-pink-500 hover:bg-pink-600 border-2 border-black",
        link: "text-black border-black/40",
        checkbox: "text-pink-500",
      };
    case 'classic':
      return {
        field: "bg-white border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(99,91,255,0.08)] text-sm text-slate-900",
        focus: "focus-visible:ring-[#635bff] focus-visible:border-[#635bff]",
        label: "text-gray-500",
        button: "bg-[#635bff] hover:bg-[#5851e8] border-gray-200",
        link: "text-[#635bff] border-[#635bff]/40",
        checkbox: "text-[#635bff]",
      };
    default:
      return {
        field: "bg-white border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] text-sm text-slate-900",
        focus: "focus-visible:ring-indigo-500 focus-visible:border-indigo-500",
        label: "text-slate-500",
        button: "bg-indigo-600 hover:bg-indigo-700 border-gray-200",
        link: "text-slate-700 border-black/40",
        checkbox: "text-indigo-600",
      };
  }
};

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
  theme = 'default',
}) {
  const styles = getFieldStyles(theme);

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
          className={`text-[13px] font-bold ${styles.label}`}
        >
          Email
        </Label>
        <Input
          id="loginEmail"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className={`${styles.field} ${styles.focus}`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="loginPassword"
          className={`text-[13px] font-bold ${styles.label}`}
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
          className={`${styles.field} ${styles.focus}`}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <div className={`flex justify-between items-center text-[11px] md:text-xs font-semibold ${styles.label}`}>
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => onRememberChange(e.target.checked)}
            className={`h-4 w-4 rounded border-gray-300 ${styles.checkbox} focus:ring-0`}
          />
          Remember me
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            className={`text-[11px] md:text-xs font-black border-b ${styles.link}`}
            role="link"
            data-href="/signup"
          >
            Sign up
          </button>
          <button
            type="button"
            className={`text-[11px] md:text-xs font-black border-b ${styles.link}`}
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
        className={`w-full h-12 text-sm md:text-base font-black rounded-[18px] border text-white shadow-[4px_4px_12px_rgba(0,0,0,0.08)] ${styles.button}`}
        disabled={isLoginDisabled}
      >
        {loginLoading ? "Logging in..." : "Log in"}
      </Button>

      <button
        type="button"
        onClick={onUnlock}
        className={`w-full text-[11px] font-black ${styles.label} text-right border-b border-transparent`}
      >
        Trouble logging in?
      </button>
    </form>
  );
}
