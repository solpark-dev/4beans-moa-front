import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { processLeaderDeposit, joinParty, createParty } from "../../services/partyService";

export default function PaymentSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("processing"); // processing, success, fail

    const isProcessed = useRef(false); // 중복 실행 방지 플래그 (useRef 사용)

    useEffect(() => {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = Number(searchParams.get("amount"));

        if (!paymentKey || !orderId || !amount) {
            setStatus("fail");
            alert("잘못된 접근입니다.");
            navigate("/");
            return;
        }

        // 세션 기반 중복 방지 (컴포넌트 재마운트 시에도 유효)
        const processId = `payment_${orderId}_${paymentKey}`;
        if (sessionStorage.getItem(processId)) {
            console.warn("Payment already processed in this session:", processId);
            return;
        }

        if (isProcessed.current) return; // 이미 처리되었으면 리턴
        isProcessed.current = true; // 처리 시작 표시
        sessionStorage.setItem(processId, 'true'); // 세션에 처리 완료 표시

        const processPayment = async () => {
            try {
                const pendingPayment = JSON.parse(localStorage.getItem("pendingPayment"));

                if (!pendingPayment) {
                    throw new Error("결제 정보를 찾을 수 없습니다.");
                }

                let { type, partyId, partyData } = pendingPayment;

                const paymentData = {
                    tossPaymentKey: paymentKey,
                    orderId: orderId,
                    amount: amount,
                    paymentMethod: "CARD",
                };

                if (type === "CREATE_PARTY") {
                    try {
                        await processLeaderDeposit(partyId, paymentData);
                    } catch (error) {
                        // 404 Party Not Found 발생 시 (서버 재시작 등으로 DB 초기화된 경우)
                        // 저장된 partyData로 파티를 다시 생성하고 결제 처리 시도
                        if (error.message && (error.message.includes("404") || error.message.includes("Not Found")) && partyData) {
                            console.warn("Party not found, re-creating...", partyId);
                            const newParty = await createParty(partyData);
                            partyId = newParty.partyId;
                            await processLeaderDeposit(partyId, paymentData);
                        } else {
                            throw error;
                        }
                    }

                    // 성공 시 로컬 스토리지 정리
                    localStorage.removeItem("pendingPayment");
                    // 파티 생성 4단계(계정 정보 입력)로 이동
                    navigate(`/party/create?step=4&partyId=${partyId}`);
                } else if (type === "JOIN_PARTY") {
                    await joinParty(partyId, paymentData);
                    localStorage.removeItem("pendingPayment");
                    navigate(`/party/${partyId}`);
                } else {
                    throw new Error("알 수 없는 결제 유형입니다.");
                }
            } catch (error) {
                console.error(error);

                // 이미 처리된 결제인 경우 성공으로 간주하고 진행
                // 먼저 localStorage에서 정보를 읽은 후 처리
                const storedPayment = JSON.parse(localStorage.getItem("pendingPayment"));

                if (error.response && error.response.data && error.response.data.code === "ALREADY_PROCESSED_PAYMENT") {
                    console.warn("Already processed payment, proceeding as success.");

                    if (storedPayment) {
                        const { type, partyId } = storedPayment;
                        localStorage.removeItem("pendingPayment"); // 정보를 읽은 후 삭제

                        if (type === "CREATE_PARTY") {
                            navigate(`/party/create?step=4&partyId=${partyId}`);
                        } else if (type === "JOIN_PARTY") {
                            navigate(`/party/${partyId}`);
                        }
                        return;
                    }
                }

                setStatus("fail");
                alert(error.message || "결제 처리에 실패했습니다.");
                navigate("/");
            }
        };

        processPayment();
    }, []); // 의존성 배열을 빈 배열로 변경 - 컴포넌트 마운트 시 1회만 실행

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                {status === "processing" && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-bold">결제 확인 중입니다...</h2>
                        <p className="text-gray-600 mt-2">잠시만 기다려주세요.</p>
                    </>
                )}
                {status === "fail" && (
                    <>
                        <div className="text-red-600 text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold">결제 처리에 실패했습니다.</h2>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            메인으로 돌아가기
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
