import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { requestBillingAuth } from "../../utils/paymentHandler";
import { handleApiError } from "../../utils/errorHandler";
import { toast } from "../../utils/toast";

export default function BillingRegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.warning("로그인이 필요합니다");
      navigate("/login");
      return;
    }

    // 자동으로 빌링키 등록 플로우 시작
    const startBillingAuth = async () => {
      try {
        // Toss Payments 빌링 인증 요청
        await requestBillingAuth(user.userId);
      } catch (error) {
        console.error("Billing auth failed:", error);
        const errorInfo = handleApiError(error);
        toast.error(errorInfo.message);

        // 에러 발생 시 원래 예정된 페이지로 이동
        const redirectPath =
          localStorage.getItem("afterBillingRedirect") || "/user/wallet";
        localStorage.removeItem("afterBillingRedirect");
        localStorage.removeItem("billingRegistrationReason");
        navigate(redirectPath);
      }
    };

    startBillingAuth();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-stone-200">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#ea580c] border-t-transparent mb-4"></div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              자동 결제 설정 중...
            </h2>
            <p className="text-stone-600 font-semibold mb-4">
              월 구독료 자동 결제를 위해 카드를 등록합니다
            </p>
            <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-4 text-left">
              <p className="text-sm text-[#c2410c] font-medium mb-2">
                📌 안내사항
              </p>
              <ul className="text-xs text-stone-700 space-y-1">
                <li>• 매월 자동으로 구독료가 결제됩니다</li>
                <li>• 결제일은 파티 설정에 따라 다릅니다</li>
                <li>• 언제든지 카드 변경이 가능합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
