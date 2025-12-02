import { useEffect } from "react";
import { initMyPage } from "../../services/logic/myPageLogic";

export default function MyPage() {
  useEffect(() => {
    initMyPage();
  }, []);

  return (
    <div className="flex flex-col items-center pt-24 pb-20 bg-gray-50">
      <h2 className="text-3xl font-bold mb-10">마이페이지</h2>

      <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-xl shadow-sm flex overflow-hidden">
        <aside className="w-48 border-r border-gray-200 bg-gray-50 p-4 space-y-2">
          <button
            id="btnSubscription"
            className="w-full py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white"
          >
            구독·약정
          </button>
          <button
            id="btnChangePwd"
            className="w-full py-2 rounded-lg text-sm border border-gray-300"
          >
            비밀번호 변경
          </button>
          <button
            id="btnPaymentMethod"
            className="w-full py-2 rounded-lg text-sm border border-gray-300"
          >
            결제수단 관리
          </button>
        </aside>

        <section className="flex-1 p-8">
          <div className="grid grid-cols-[140px_1fr] gap-y-4 gap-x-4 items-center">
            <div className="text-sm text-gray-500">이메일(아이디)</div>
            <div id="myEmail" className="text-sm text-gray-900" />

            <div className="text-sm text-gray-500">닉네임</div>
            <div id="myNickname" className="text-sm text-gray-900" />

            <div className="text-sm text-gray-500">가입일자</div>
            <div id="myJoinDate" className="text-sm text-gray-900" />

            <div className="text-sm text-gray-500">마케팅 수신여부</div>
            <div id="myMarketing" className="text-sm text-gray-900" />

            <div className="text-sm text-gray-500">로그인 방식</div>
            <div id="myLoginProvider" className="text-sm text-gray-900"></div>

            <div className="text-sm text-gray-500">연동</div>
            <div className="flex gap-3">
              <button
                id="btnGoogleConnect"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                Google로 시작하기
              </button>
              <button
                id="btnKakaoConnect"
                className="px-4 py-2 rounded-lg text-sm bg-yellow-300"
              >
                Kakao로 시작하기
              </button>
            </div>

            <div className="text-sm text-gray-500">휴대폰 번호</div>
            <div id="myPhone" className="text-sm text-gray-900" />

            <div className="text-sm text-gray-500">프로필 이미지</div>
            <div className="flex items-center">
              <img
                id="myProfileImage"
                src={null}
                alt="프로필"
                className="w-20 h-20 rounded-full border border-gray-300 object-cover bg-gray-100"
              />
            </div>
          </div>

          <div className="mt-10">
            <button
              id="btnUpdateUser"
              className="w-full h-12 bg-red-400 text-white rounded-lg text-lg"
            >
              내정보 수정
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
