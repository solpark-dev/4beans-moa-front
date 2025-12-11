import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, CreditCard, AlertCircle, Sparkles } from "lucide-react";

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

const MOCK_USER = { id: "user-001", nickname: "테스트사용자" };

const MOCK_USER_SUBSCRIPTIONS = [
  {
    id: "sub-1",
    userId: "user-001",
    nextBillingDate: "2023-12-01",
    status: "ACTIVE",
    product: {
      name: "Netflix",
      price: 17000,
      iconUrl: "https://picsum.photos/50",
    },
  },
];

export default function UserSubscriptionList() {
  const navigate = useNavigate();
  const user = MOCK_USER;

  const subscriptions = MOCK_USER_SUBSCRIPTIONS.filter(
    (s) => s.userId === user?.id
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Hero Header - Variant T Style */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <AnimatedGradient />
        <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#635bff]/10 text-[#635bff] rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              구독 관리
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">내 구독 목록</h1>
            <p className="text-gray-500">현재 이용 중인 구독 서비스입니다.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {subscriptions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-10 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">
              구독 중인 서비스가 없습니다.
            </h3>
            <p className="text-gray-500 mb-6">새로운 구독을 시작해보세요.</p>

            <Link
              to="/subscriptions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#635bff] hover:bg-[#5851e8] text-white rounded-full font-semibold shadow-lg shadow-[#635bff]/25 transition-all"
            >
              구독 상품 보러가기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        <div className="space-y-4">
          {subscriptions.map((sub, index) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#635bff]/10 cursor-pointer transition-all"
              onClick={() => navigate(`/my/subscriptions/${sub.id}`)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={sub.product.iconUrl}
                    className="w-14 h-14 rounded-xl bg-gray-100"
                    alt={sub.product.name}
                  />

                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {sub.product.name}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        sub.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {sub.status === "ACTIVE" ? "이용중" : "해지됨"}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#635bff]" />
                  다음 결제일:{" "}
                  <span className="font-semibold text-gray-800">
                    {sub.nextBillingDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#00d4ff]" />월{" "}
                  <span className="font-bold text-[#635bff]">
                    ₩{sub.product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
