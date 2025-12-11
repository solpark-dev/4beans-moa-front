import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CreditCard, Info } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { requestBillingAuth } from "../../utils/paymentHandler";
import { handleApiError } from "../../utils/errorHandler";
import { toast } from "../../utils/toast";

// Animated gradient background component for Variant T
function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(99,91,255,0.15) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center relative">
      <AnimatedGradient />
      <div className="max-w-md w-full mx-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg shadow-[#635bff]/10 p-10 border border-gray-100"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-6 w-16 h-16 flex items-center justify-center"
            >
              <Loader2 className="w-12 h-12 text-[#635bff]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              자동 결제 설정 중...
            </h2>
            <p className="text-gray-500 font-medium mb-6">
              월 구독료 자동 결제를 위해 카드를 등록합니다
            </p>
            <div className="bg-[#635bff]/5 border border-[#635bff]/10 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 text-[#635bff] font-semibold mb-3">
                <Info className="w-4 h-4" />
                안내사항
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-[#00d4ff] mt-0.5 flex-shrink-0" />
                  매월 자동으로 구독료가 결제됩니다
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-[#00d4ff] mt-0.5 flex-shrink-0" />
                  결제일은 파티 설정에 따라 다릅니다
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-[#00d4ff] mt-0.5 flex-shrink-0" />
                  언제든지 카드 변경이 가능합니다
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
