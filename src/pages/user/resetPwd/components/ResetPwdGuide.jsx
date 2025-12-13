const CARD_CLASS =
  "bg-white border-4 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
const BTN_CLASS =
  "bg-white text-black px-12 py-3 rounded-2xl text-lg font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";

export function ResetPwdGuide() {
  return (
    <div className={`${CARD_CLASS} space-y-4 p-5`}>
      <p id="resetGuide" className="text-gray-700 text-center leading-relaxed">
        PASS 버튼을 눌러 본인 인증을 진행해주세요
        <br />
        인증이 완료되면 비밀번호를 입력하실 수 있습니다.
      </p>

      <div className="flex justify-center">
        <button id="btnResetPassAuth" type="button" className={BTN_CLASS}>
          PASS 본인인증
        </button>
      </div>
    </div>
  );
}
