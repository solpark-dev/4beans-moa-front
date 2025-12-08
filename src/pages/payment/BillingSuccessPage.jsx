import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import httpClient from "../../api/httpClient";
import { handlePaymentError, handleNetworkError } from "../../utils/errorHandler";
import { toast } from "../../utils/toast";

export default function BillingSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("processing");
    const [message, setMessage] = useState("카드 등록 중...");

    useEffect(() => {
        registerBillingKey();
    }, []);

    const registerBillingKey = async () => {
        // Show warning toast if processing takes too long
        const timeoutId = setTimeout(() => {
            toast.warning('처리가 지연되고 있습니다. 잠시만 기다려주세요...');
        }, 5000);

        try {
            // Toss Payments에서 전달하는 파라미터
            const authKey = searchParams.get("authKey");

            if (!authKey) {
                throw new Error("빌링키 정보가 없습니다.");
            }

            // 백엔드를 통해 안전하게 빌링키 발급
            const billingResponse = await httpClient.post("/users/me/billing-key/issue", {
                authKey
            });

            // billingResponse.data에는 Toss Payments API 응답이 들어있음
            const billingData = billingResponse.data;

            // 백엔드에 빌링키 저장
            await httpClient.post("/users/me/card", {
                billingKey: billingData.billingKey,
                cardCompany: billingData.card?.company || "",
                cardNumber: billingData.card?.number || "",
            });

            clearTimeout(timeoutId);
            setStatus("success");

            // 파티 가입 후 빌링키 등록인지 확인
            const reason = localStorage.getItem("billingRegistrationReason");
            const redirectPath = localStorage.getItem("afterBillingRedirect");

            if (reason === "party_join") {
                setMessage("월 구독료 자동 결제가 설정되었습니다!");
                toast.success("자동 결제 설정 완료! 파티에 참여했습니다.");
            } else {
                setMessage("카드가 성공적으로 등록되었습니다!");
                toast.success("카드가 성공적으로 등록되었습니다!");
            }

            // 저장된 리다이렉트 경로로 이동 (없으면 지갑 페이지)
            localStorage.removeItem("billingRegistrationReason");
            localStorage.removeItem("afterBillingRedirect");

            setTimeout(() => {
                navigate(redirectPath || "/user/wallet");
            }, 2000);
        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Billing key registration failed:", error);

            // Handle different error types
            const errorInfo = error.response
                ? handlePaymentError(error)
                : handleNetworkError(error);

            setStatus("error");
            setMessage(errorInfo.message);

            // Show error toast with action if available
            if (errorInfo.canRetry) {
                toast.errorWithAction(
                    errorInfo.message,
                    '다시 시도',
                    () => {
                        setStatus("processing");
                        setMessage("카드 등록 중...");
                        registerBillingKey();
                    }
                );
            } else if (errorInfo.actionUrl) {
                toast.errorWithAction(
                    errorInfo.message,
                    errorInfo.action,
                    () => navigate(errorInfo.actionUrl)
                );
            } else {
                toast.error(errorInfo.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-stone-200">
                    {status === "processing" && (
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#ea580c] border-t-transparent mb-4"></div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                                {message}
                            </h2>
                            <p className="text-stone-600 font-semibold">잠시만 기다려주세요...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                                {message}
                            </h2>
                            <p className="text-stone-600 font-semibold">지갑 페이지로 이동합니다...</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                                카드 등록 실패
                            </h2>
                            <p className="text-stone-600 font-semibold mb-6">{message}</p>
                            <button
                                onClick={() => navigate("/user/wallet")}
                                className="px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-200 hover:translate-y-1"
                            >
                                지갑으로 돌아가기
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
