import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, ChevronRight, CreditCard, AlertCircle } from "lucide-react";

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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">내 구독 목록</h1>
      <p className="text-gray-500 mb-10">현재 이용 중인 구독 서비스입니다.</p>

      {subscriptions.length === 0 && (
        <div className="bg-white border rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">
            구독 중인 서비스가 없습니다.
          </h3>
          <p className="text-gray-500 mb-6">새로운 구독을 시작해보세요.</p>

          <Link
            to="/subscriptions"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            구독 상품 보러가기
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white border rounded-2xl p-6 hover:shadow-lg cursor-pointer transition"
            onClick={() => navigate(`/my/subscriptions/${sub.id}`)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={sub.product.iconUrl}
                  className="w-14 h-14 rounded-xl bg-gray-100"
                />

                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {sub.product.name}
                  </h3>

                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      sub.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {sub.status === "ACTIVE" ? "이용중" : "해지됨"}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                다음 결제일:{" "}
                <span className="font-semibold text-gray-800">
                  {sub.nextBillingDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />월{" "}
                <span className="font-bold text-gray-900">
                  ₩{sub.product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
