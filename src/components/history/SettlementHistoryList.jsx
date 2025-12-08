import { useState, useEffect } from "react";
import { getMySettlements } from "../../api/settlementApi";
import SettlementDetailModal from "./SettlementDetailModal";

export default function SettlementHistoryList() {
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSettlement, setSelectedSettlement] = useState(null);

    useEffect(() => {
        loadSettlements();
    }, []);

    const loadSettlements = async () => {
        try {
            const data = await getMySettlements();
            setSettlements(data);
        } catch (error) {
            console.error("Failed to load settlements", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-700";
            case "FAILED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "COMPLETED":
                return "정산완료";
            case "PENDING":
                return "대기중";
            case "IN_PROGRESS":
                return "처리중";
            case "FAILED":
                return "실패";
            default:
                return "알수없음";
        }
    };

    if (loading) return <div className="p-4 text-center">로딩 중...</div>;

    if (settlements.length === 0) {
        return <div className="p-8 text-center text-gray-500">정산 내역이 없습니다.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                {settlements.map((settlement) => (
                    <div
                        key={settlement.settlementId}
                        onClick={() => setSelectedSettlement(settlement)}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">
                                {settlement.settlementDate ? new Date(settlement.settlementDate).toLocaleDateString() : "-"}
                            </span>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusStyle(settlement.settlementStatus)}`}>
                                {getStatusLabel(settlement.settlementStatus)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-900">{settlement.productName || `파티 #${settlement.partyId}`}</h3>
                                <p className="text-xs text-gray-500">{settlement.settlementMonth} 정산분</p>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-lg text-green-600">
                                    +{settlement.netAmount?.toLocaleString() || 0}원
                                </span>
                                <p className="text-xs text-gray-400">
                                    수수료: -{settlement.commissionAmount?.toLocaleString() || 0}원
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <SettlementDetailModal
                isOpen={!!selectedSettlement}
                onClose={() => setSelectedSettlement(null)}
                settlement={selectedSettlement}
            />
        </>
    );
}
