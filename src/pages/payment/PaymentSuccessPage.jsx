import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { processLeaderDeposit, joinParty, createParty } from "../../api/partyApi";

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

        if (isProcessed.current) return; // 이미 처리되었으면 리턴
        isProcessed.current = true; // 처리 시작 표시

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

                    // ✨ 파티원은 월 구독료 자동 결제를 위해 빌링키 등록 필요
                    // 결제 성공 후 자동으로 빌링키 등록 페이지로 리다이렉트
                    localStorage.setItem("afterBillingRedirect", `/party/${partyId}`);
                    localStorage.setItem("billingRegistrationReason", "party_join");
                    navigate("/payment/billing/register");
                } else {
                    throw new Error("알 수 없는 결제 유형입니다.");
                }
            } catch (error) {
                console.error(error);

                // 이미 처리된 결제인 경우 성공으로 간주하고 진행
                if (error.response && error.response.data && error.response.data.code === "ALREADY_PROCESSED_PAYMENT") {
                    console.warn("Already processed payment, proceeding as success.");
                    localStorage.removeItem("pendingPayment");
                    const pendingPayment = JSON.parse(localStorage.getItem("pendingPayment")); // 다시 읽어서 확인 (위에서 지웠으므로 null일 것임, 하지만 로직 흐름상 필요하면 변수 사용)
                    // 위에서 pendingPayment 변수가 이미 있으므로 그것을 사용.
                    // 단, type과 partyId는 위에서 이미 구조분해 할당 했음.

                    // pendingPayment가 null이면 위에서 에러가 났을 것이므로 여기서는 type, partyId가 유효함.
                    // 하지만 catch 블록이므로 스코프 문제 확인 필요. 
                    // let { type, partyId } = pendingPayment; 는 try 블록 안에 있음.
                    // 따라서 catch 블록에서는 접근 불가할 수 있음.
                    // 해결책: try 블록 밖으로 변수 선언을 빼거나, catch 블록에서 다시 읽어야 함.
                    // 하지만 localStorage에서 이미 지웠다면? 아님. 지우기 전임.

                    // 코드를 재구성하여 try-catch 범위를 조정하거나, catch에서 로컬스토리지를 다시 읽어서 처리.

                    const storedPayment = JSON.parse(localStorage.getItem("pendingPayment"));
                    if (storedPayment) {
                        const { type, partyId } = storedPayment;
                        localStorage.removeItem("pendingPayment");
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
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
            <div className="bg-white p-8 rounded-3xl shadow-lg text-center border border-stone-200">
                {status === "processing" && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea580c] mx-auto mb-4"></div>
                        <h2 className="text-xl font-extrabold text-gray-900">결제 확인 중입니다...</h2>
                        <p className="text-stone-600 mt-2 font-semibold">잠시만 기다려주세요.</p>
                    </>
                )}
                {status === "fail" && (
                    <>
                        <div className="text-red-600 text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-extrabold text-gray-900">결제 처리에 실패했습니다.</h2>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-2 rounded-2xl font-bold hover:shadow-lg transition-all duration-200 hover:translate-y-1"
                        >
                            메인으로 돌아가기
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
