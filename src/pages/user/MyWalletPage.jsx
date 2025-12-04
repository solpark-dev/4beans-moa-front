import { useNavigate } from "react-router-dom";
import { ChevronRight, CreditCard, Wallet, Building2 } from "lucide-react";

export default function MyWalletPage() {
    const navigate = useNavigate();

    const goHistory = (tab) => {
        navigate(`/user/financial-history?tab=${tab}`);
    };

    return (
        <div className="flex flex-col items-center pt-24 pb-20 bg-gray-50 min-h-screen">
            <div className="w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center mb-8">내 지갑</h2>

                {/* 보증금 카드 */}
                <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-blue-100 text-sm font-medium mb-1">
                            보유 보증금
                        </div>
                        <div className="text-4xl font-bold mb-6">14,000원</div>
                        <button
                            onClick={() => goHistory("deposit")}
                            className="flex items-center gap-1 text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
                        >
                            보증금 상세 내역 <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Background Decoration */}
                    <div className="absolute -right-4 -bottom-12 w-40 h-40 bg-blue-500 rounded-full opacity-50 blur-2xl"></div>
                </div>

                {/* 정산 계좌 */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                        <h3 className="font-bold text-gray-900">정산 계좌</h3>
                        <button className="text-xs text-gray-500 underline">변경하기</button>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-yellow-900 font-bold">
                                K
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">카카오뱅크</div>
                                <div className="text-sm text-gray-400">3333-01-******</div>
                            </div>
                        </div>
                        <button
                            onClick={() => goHistory("settlement")}
                            className="w-full py-3 flex items-center justify-center gap-1 text-sm text-gray-500 border-t border-gray-100 mt-2 hover:text-gray-700"
                        >
                            최근 정산 내역 보기 <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* 결제 정보 */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                        <h3 className="font-bold text-gray-900">결제 정보</h3>
                        <button className="text-xs text-gray-500 underline">수정하기</button>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-white">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">현대카드</div>
                                <div className="text-sm text-gray-400">**** **** **** 1234</div>
                            </div>
                        </div>
                        <button
                            onClick={() => goHistory("payment")}
                            className="w-full py-3 flex items-center justify-center gap-1 text-sm text-gray-500 border-t border-gray-100 mt-2 hover:text-gray-700"
                        >
                            결제 영수증 / 내역 <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
