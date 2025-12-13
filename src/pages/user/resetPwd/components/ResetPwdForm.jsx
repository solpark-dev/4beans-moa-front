const CARD_CLASS =
  "bg-white border-4 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
const INPUT_CLASS =
  "w-full border-4 border-black rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-3 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus:outline-none";
const BTN_CLASS =
  "w-full bg-white text-black border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black py-3 text-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";

export function ResetPwdForm() {
  return (
    <div
      id="resetFormArea"
      className={`${CARD_CLASS} space-y-4 pt-4 hidden p-5`}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="space-y-1">
          <label className="font-black text-sm text-slate-900">새 비밀번호</label>
          <input
            id="resetNewPassword"
            type="password"
            autoComplete="new-password"
            className={INPUT_CLASS}
            placeholder="8~20자/ 영문·숫자·특수문자 조합"
          />
        </div>

        <div className="space-y-1">
          <label className="font-black text-sm text-slate-900">
            새 비밀번호 확인
          </label>
          <input
            id="resetNewPasswordCheck"
            type="password"
            autoComplete="new-password"
            className={INPUT_CLASS}
            placeholder="같은 비밀번호를 입력해 주세요"
          />
        </div>

        <button id="btnResetPwd" type="submit" className={BTN_CLASS}>
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}
