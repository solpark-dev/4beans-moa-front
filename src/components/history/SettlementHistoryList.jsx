import { useState, useEffect } from "react";
import { getMySettlements } from "../../api/settlementApi";

export default function SettlementHistoryList() {
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-4 text-center">로딩 중...</div>;

    if (settlements.length === 0) {
        return <div className="p-8 text-center text-gray-500">정산 내역이 없습니다.</div>;
    }

    return (
        <div className="space-y-4">
            {settlements.map((settlement) => (
                <div
                    key={settlement.settlementId}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">
                            {settlement.settlementDate ? new Date(settlement.settlementDate).toLocaleDateString() : "-"}
                        </span>
                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700">
                            {settlement.settlementStatus === "COMPLETED" ? "정산완료" : "처리중"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-900">파티 ID: {settlement.partyId}</h3>
                            <p className="text-xs text-gray-500">{settlement.settlementMonth}</p>
                        </div>
                        <span className="font-bold text-lg">
                            {settlement.netAmount?.toLocaleString() || 0}원
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
