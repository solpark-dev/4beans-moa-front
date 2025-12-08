import { useState, useEffect } from "react";
import { getMyPayments } from "../../api/paymentApi";
import PaymentDetailModal from "./PaymentDetailModal";

export default function PaymentHistoryList() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            const data = await getMyPayments();
            setPayments(data);
        } catch (error) {
            console.error("Failed to load payments", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4 text-center">로딩 중...</div>;

    if (payments.length === 0) {
        return <div className="p-8 text-center text-gray-500">결제 내역이 없습니다.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                {payments.map((payment) => (
                    <div
                        key={payment.paymentId}
                        onClick={() => setSelectedPayment(payment)}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="text-xs font-medium text-gray-500 block mb-1">
                                    {payment.paymentDate}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {payment.productName}
                                </h3>
                            </div>
                            <div className="text-right">
                                <span
                                    className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${payment.paymentStatus === "COMPLETED"
                                        ? "bg-green-100 text-green-700"
                                        : payment.paymentStatus === "FAILED"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {payment.paymentStatus === "COMPLETED" ? "결제완료"
                                        : payment.paymentStatus === "FAILED" ? "결제실패"
                                            : "처리중"}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="text-sm text-gray-600">
                                {payment.partyLeaderNickname} 파티장
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                                {payment.paymentAmount.toLocaleString()}원
                            </div>
                        </div>
                        {/* 재시도 로직이 있다면 여기에 표시 */}
                        {payment.retryStatus && (
                            <div className="mt-3 bg-red-50 p-2 rounded text-xs text-red-600">
                                ⚠️ 재시도 중 ({payment.attemptNumber}회차) - 다음 시도: {payment.nextRetryDate}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <PaymentDetailModal
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
                payment={selectedPayment}
            />
        </>
    );
}
