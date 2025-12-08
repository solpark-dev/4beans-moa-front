import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PaymentHistoryList from "../../components/history/PaymentHistoryList";
import DepositHistoryList from "../../components/history/DepositHistoryList";
import SettlementHistoryList from "../../components/history/SettlementHistoryList";

export default function FinancialHistoryPage() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("payment");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && ["payment", "deposit", "settlement"].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center pt-24 pb-20 bg-stone-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-10">금융 내역</h2>

            <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === "payment"
                            ? "text-[#ea580c] border-b-2 border-[#ea580c] bg-[#fff7ed]"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        onClick={() => setActiveTab("payment")}
                    >
                        결제 내역
                    </button>
                    <button
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === "deposit"
                            ? "text-[#ea580c] border-b-2 border-[#ea580c] bg-[#fff7ed]"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        onClick={() => setActiveTab("deposit")}
                    >
                        보증금 내역
                    </button>
                    <button
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === "settlement"
                            ? "text-[#ea580c] border-b-2 border-[#ea580c] bg-[#fff7ed]"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        onClick={() => setActiveTab("settlement")}
                    >
                        정산 내역
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 min-h-[400px]">
                    {activeTab === "payment" && <PaymentHistoryList />}
                    {activeTab === "deposit" && <DepositHistoryList />}
                    {activeTab === "settlement" && <SettlementHistoryList />}
                </div>
            </div>
        </div>
    );
}
