import { useFindIdStore } from "@/store/user/findIdStore";
import { useFindIdLogic } from "@/hooks/auth/useFindId";

export default function FindIdPage() {
  const { step, foundEmail, isLoading } = useFindIdStore();
  const { handlePassAuth } = useFindIdLogic();

  return (
    <div className="flex flex-col items-center pt-28 pb-20 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">아이디 찾기</h2>
      <p className="text-gray-500 mb-10 text-sm">
        가입 시 등록한 휴대폰 번호로 본인 인증 후 이메일을 확인하세요.
      </p>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10 space-y-8">
        {/* STEP 표시 */}
        <div className="flex items-center justify-center gap-6 text-sm font-medium">
          <div
            className={`flex items-center gap-2 ${
              step === 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </span>
            <span>본인 인증</span>
          </div>

          <div className="w-8 h-px bg-gray-300" />

          <div
            className={`flex items-center gap-2 ${
              step === 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </span>
            <span>이메일 확인</span>
          </div>
        </div>

        <div className="border rounded-xl p-8 bg-gray-50">
          {step === 1 && (
            <>
              <p className="text-gray-700 mb-8 text-center leading-relaxed">
                PASS 버튼을 눌러 본인 인증을 진행해 주세요.
                <br />
                인증이 완료되면 이메일이 자동으로 표시됩니다.
              </p>

              <div className="flex justify-center mb-6">
                <button
                  onClick={handlePassAuth}
                  disabled={isLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 rounded-xl text-lg font-bold cursor-pointer shadow-md transition disabled:opacity-50"
                >
                  {isLoading ? "처리중..." : "PASS"}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-3 pt-4 animate-in fade-in duration-300">
              <p className="text-gray-600 text-sm text-center">
                회원가입된 이메일
              </p>

              <div className="w-full border p-3 rounded-lg text-center font-semibold bg-white text-lg">
                {foundEmail}
              </div>

              <a
                href="/login"
                className="block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full text-center text-sm font-semibold cursor-pointer transition"
              >
                로그인하러가기
              </a>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center">
          명의자 정보와 가입자 정보가 다를 경우 아이디 찾기가 제한될 수
          있습니다.
        </p>
      </div>
    </div>
  );
}
