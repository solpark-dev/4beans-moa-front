// src/pages/user/DeleteUserPage.jsx
import { useEffect } from "react";
import { initDeleteUserPage } from "../../hooks/user/useDeleteUser";

export default function DeleteUserPage() {
  useEffect(() => {
    initDeleteUserPage();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900">
      {/* 상단 HERO */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
            MoA 계정 · 회원 탈퇴
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3 drop-shadow-md">
            마지막까지
            <span className="block mt-1 text-indigo-100">
              솔직한 의견을 들려주세요
            </span>
          </h2>
          <p className="text-sm sm:text-base text-indigo-50/90 leading-relaxed max-w-lg mx-auto">
            탈퇴 사유를 남겨 주시면 서비스 개선에 소중한 자료로 사용됩니다. 계정
            삭제 전, 꼭 한 번 더 확인해 주세요.
          </p>
        </div>
      </section>

      {/* 탈퇴 카드 */}
      <section className="max-w-xl mx-auto px-4 -mt-10 pb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-7">
          <div id="deleteReasonGroup" className="space-y-3 text-sm">
            <p className="font-semibold text-slate-900">탈퇴 사유</p>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="radio"
                name="deleteReason"
                value="NOT_USED"
                className="h-4 w-4 accent-indigo-600 cursor-pointer"
              />
              서비스를 더 이상 사용하지 않음
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="radio"
                name="deleteReason"
                value="PRICE"
                className="h-4 w-4 accent-indigo-600 cursor-pointer"
              />
              가격이 부담됨
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="radio"
                name="deleteReason"
                value="FUNCTION"
                className="h-4 w-4 accent-indigo-600 cursor-pointer"
              />
              원하는 기능이 부족함
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="radio"
                name="deleteReason"
                value="OTHER"
                className="h-4 w-4 accent-indigo-600 cursor-pointer"
              />
              기타(상세내용 입력)
            </label>
          </div>

          <div id="deleteDetailWrapper" className="space-y-2 hidden">
            <p className="text-sm font-semibold text-slate-900">
              상세 사유 (선택)
            </p>
            <textarea
              id="deleteDetail"
              className="w-full border border-slate-200 rounded-2xl p-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="기타 사유 또는 추가 의견이 있다면 입력해 주세요."
            />
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500 leading-relaxed">
            <p>
              탈퇴 시 계정 정보 및 서비스 이용 이력은 관련 법령에 따라 일정 기간
              보관 후 안전하게 파기됩니다.
            </p>
            <p className="mt-2">
              탈퇴 후에는 동일 이메일로 재가입이 제한되거나, 일부 데이터는
              복구가 불가능할 수 있습니다.
            </p>
          </div>

          <button
            id="btnDeleteUser"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
          >
            정말 탈퇴할게요
          </button>
        </div>
      </section>
    </div>
  );
}
