import { useState, useEffect } from "react";
import { getMyDeposits } from "../../api/depositApi";

export default function DepositHistoryList() {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDeposits();
    }, []);

    const loadDeposits = async () => {
        try {
            const data = await getMyDeposits();
            setDeposits(data);
        } catch (error) {
            console.error("Failed to load deposits", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4 text-center">로딩 중...</div>;

    if (deposits.length === 0) {
        return <div className="p-8 text-center text-gray-500">보증금 내역이 없습니다.</div>;
    }

    return (
        <div className="space-y-4">
            {deposits.map((deposit) => (
                <div
                    key={deposit.depositId}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">
                            {deposit.paymentDate ? new Date(deposit.paymentDate).toLocaleDateString() : "-"}
                        </span>
                        <span
                            className={`px-2 py-1 text-xs font-bold rounded-full ${deposit.depositStatus === "HELD"
                                    ? "bg-blue-100 text-blue-700"
                                    : deposit.depositStatus === "REFUNDED"
                                        ? "bg-gray-100 text-gray-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {deposit.depositStatus === "HELD"
                                ? "보관중"
                                : deposit.depositStatus === "REFUNDED"
                                    ? "환급완료"
                                    : "처리중"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">{deposit.productName || "파티"}</h3>
                        <span className="font-bold text-lg">
                            {deposit.depositAmount?.toLocaleString() || 0}원
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
