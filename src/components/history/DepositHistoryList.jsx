import { useState, useEffect } from "react";
import { getMyDeposits } from "../../api/depositApi";
import DepositDetailModal from "./DepositDetailModal";

export default function DepositHistoryList() {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDeposit, setSelectedDeposit] = useState(null);

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

    const getStatusStyle = (status) => {
        switch (status) {
            case "PAID":
                return "bg-blue-100 text-blue-700";
            case "REFUNDED":
                return "bg-gray-100 text-gray-700";
            case "FORFEITED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "PAID":
                return "보관중";
            case "REFUNDED":
                return "환불완료";
            case "FORFEITED":
                return "몰수";
            default:
                return "처리중";
        }
    };

    if (loading) return <div className="p-4 text-center">로딩 중...</div>;

    if (deposits.length === 0) {
        return <div className="p-8 text-center text-gray-500">보증금 내역이 없습니다.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                {deposits.map((deposit) => (
                    <div
                        key={deposit.depositId}
                        onClick={() => setSelectedDeposit(deposit)}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">
                                {deposit.paymentDate ? new Date(deposit.paymentDate).toLocaleDateString() : "-"}
                            </span>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusStyle(deposit.depositStatus)}`}>
                                {getStatusLabel(deposit.depositStatus)}
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

            <DepositDetailModal
                isOpen={!!selectedDeposit}
                onClose={() => setSelectedDeposit(null)}
                deposit={selectedDeposit}
            />
        </>
    );
}
