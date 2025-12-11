// src/pages/user/ResetPwdPage.jsx
import { useEffect } from "react";
import { initResetPwdPage } from "@/hooks/auth/useResetPassword";
import { ResetPwdGuide } from "./components/ResetPwdGuide";
import { ResetPwdForm } from "./components/ResetPwdForm";
import { PageTitle } from "../shared/PageTitle";
import { PageSteps } from "../shared/PageSteps";

export default function ResetPwdPage() {
  useEffect(() => {
    initResetPwdPage();
  }, []);

  const steps = [
    { number: 1, label: "본인 인증", active: true },
    { number: 2, label: "새 비밀번호 설정", active: false },
  ];

  return (
    <div className="flex flex-col items-center pt-28 pb-20 bg-gray-50">
      <PageTitle
        title="비밀번호 재설정"
        subtitle="PASS 본인 인증 후 새 비밀번호를 설정하세요."
      />

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10 space-y-8">
        <PageSteps steps={steps} />

        <div className="border rounded-xl p-8 bg-gray-50 space-y-6">
          <ResetPwdGuide />
          <ResetPwdForm />
        </div>

        <p className="text-xs text-gray-400 text-center">
          휴대폰 명의가 다른 경우 비밀번호 재설정이 제한될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
