// src/pages/user/ResetPwdPage.jsx
import { useEffect } from "react";
import { initResetPwdPage } from "@/hooks/auth/useResetPassword";
import { ResetPwdGuide } from "./components/ResetPwdGuide";
import { ResetPwdForm } from "./components/ResetPwdForm";
import { PageTitle } from "../shared/PageTitle";
import { PageSteps } from "../shared/PageSteps";

const PAGE_BG = "min-h-screen bg-white text-slate-900";
const CARD_CLASS =
  "bg-white border-4 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

export default function ResetPwdPage() {
  useEffect(() => {
    initResetPwdPage();
  }, []);

  const steps = [
    { number: 1, label: "본인 인증", active: true },
    { number: 2, label: "새 비밀번호 설정", active: false },
  ];

  return (
    <div className={PAGE_BG}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-20 space-y-8">
        <div className="text-center">
          <PageTitle
            title="비밀번호 재설정"
            subtitle="PASS 본인 인증 후 새 비밀번호를 설정해 주세요"
          />
        </div>

        <div className={`${CARD_CLASS} p-10 space-y-8`}>
          <PageSteps steps={steps} />

          <div className="grid md:grid-cols-2 gap-6">
            <ResetPwdGuide />
            <ResetPwdForm />
          </div>

          <p className="text-xs text-gray-500 text-center">
            본인 확인이 완료된 경우 비밀번호 재설정이 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
