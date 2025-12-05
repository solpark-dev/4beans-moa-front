// 환경 변수에서 클라이언트 키 가져오기
const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;

if (!clientKey) {
    console.error("Toss Client Key is missing. Please check .env file.");
}

export const requestPayment = (orderName, amount, customerName) => {
    return new Promise((resolve, reject) => {
        if (!clientKey) {
            alert("결제 설정 오류: Toss Client Key가 없습니다. 관리자에게 문의하세요.");
            return reject(new Error("Toss Client Key is missing"));
        }
        const tossPayments = window.TossPayments(clientKey);

        tossPayments
            .requestPayment("카드", {
                amount: amount,
                orderId: "ORDER_" + new Date().getTime(),
                orderName: orderName,
                customerName: customerName,
                successUrl: window.location.origin + "/payment/success",
                failUrl: window.location.origin + "/payment/fail",
            })
            .catch((error) => {
                if (error.code === "USER_CANCEL") {
                    reject(new Error("사용자가 결제를 취소했습니다."));
                } else {
                    reject(error);
                }
            });
    });
};

export const requestBillingAuth = (customerKey) => {
    return new Promise((resolve, reject) => {
        const tossPayments = window.TossPayments(clientKey);

        tossPayments
            .requestBillingAuth("카드", {
                customerKey: customerKey,
                successUrl: window.location.origin + "/payment/billing/success",
                failUrl: window.location.origin + "/payment/billing/fail",
            })
            .catch((error) => {
                reject(error);
            });
    });
};
