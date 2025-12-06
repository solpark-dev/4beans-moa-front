import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, CreditCard, Building2, Wallet, Plus } from "lucide-react";
import { getMyAccount, getMyCard } from "../../api/userApi";
import { getMyDeposits } from "../../api/depositApi";
import { useAuthStore } from "../../store/authStore";

export default function MyWalletPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuthStore();

    const [deposits, setDeposits] = useState([]);
    const [account, setAccount] = useState(null);
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);

    // 로그인 체크
    useEffect(() => {
        if (!authLoading && !user) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    // 데이터 로드
    useEffect(() => {
        if (user) {
            loadWalletData();
        }
    }, [user]);

    const loadWalletData = async () => {
        setLoading(true);
        try {
            const [depositsRes, accountRes, cardRes] = await Promise.all([
                getMyDeposits().catch(() => ({ data: [] })),
                getMyAccount().catch(() => ({ data: null })),
                getMyCard().catch(() => ({ data: null })),
            ]);

            // Extract data from ApiResponse format: { success, data, error }
            setDeposits(depositsRes?.data || []);
            setAccount(accountRes?.data || null);
            setCard(cardRes?.data || null);
        } catch (error) {
            console.error("Failed to load wallet data:", error);
        } finally {
            setLoading(false);
        }
    };

    // 보증금 합계 계산
    const totalDeposit = Array.isArray(deposits)
        ? deposits
            .filter((d) => d.depositStatus === "HELD")
            .reduce((sum, d) => sum + (d.depositAmount || 0), 0)
        : 0;

    const goHistory = (tab) => {
        navigate(`/user/financial-history?tab=${tab}`);
    };

    const handleViewAccountHistory = (e) => {
        e.stopPropagation();
        navigate("/user/financial-history?tab=settlement");
    };

    const handleViewPaymentHistory = (e) => {
        e.stopPropagation();
        navigate("/user/financial-history?tab=payment");
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-md mx-auto px-6 py-5">
                    <h1 className="text-2xl font-bold text-gray-900">내 지갑</h1>
                </div>
            </div>

            <div className="max-w-md mx-auto px-6 py-6 space-y-5">
                {/* 보증금 카드 */}
                <div
                    onClick={() => goHistory("deposit")}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-100 text-sm font-medium mb-1">
                            <Wallet className="w-4 h-4" />
                            보유 보증금
                        </div>
                        <div className="text-4xl font-bold mb-4">
                            {totalDeposit.toLocaleString()}원
                        </div>
                        <div className="flex items-center gap-1 text-sm text-blue-100">
                            상세 내역 보기 <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                    {/* Background Decoration */}
                    <div className="absolute -right-6 -bottom-10 w-32 h-32 bg-blue-400 rounded-full opacity-30 blur-2xl"></div>
                    <div className="absolute -right-2 top-2 w-16 h-16 bg-blue-300 rounded-full opacity-20 blur-xl"></div>
                </div>

                {/* 정산 계좌 */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="font-bold text-gray-900">정산 계좌</h3>
                        <button
                            onClick={handleViewAccountHistory}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            내역보기
                        </button>
                    </div>
                    <div
                        onClick={() => navigate("/user/account-register")}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all"
                    >
                        {account ? (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900">
                                        {account.bankName}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {account.accountNumber?.replace(/(\d{4})(\d{2})(.*)/, "$1-$2-******")}
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-4 text-gray-400">
                                <Plus className="w-8 h-8 mb-2" />
                                <span className="text-sm">등록된 계좌가 없습니다</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 결제 정보 */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="font-bold text-gray-900">결제 정보</h3>
                        <button
                            onClick={handleViewPaymentHistory}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            내역보기
                        </button>
                    </div>
                    <div
                        onClick={() => alert("결제 수단 변경 기능은 추후 구현 예정입니다.")}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all"
                    >
                        {card ? (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900">
                                        {card.cardCompany}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        **** **** **** {card.cardNumber?.slice(-4) || "****"}
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-4 text-gray-400">
                                <Plus className="w-8 h-8 mb-2" />
                                <span className="text-sm">등록된 결제 수단이 없습니다</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
