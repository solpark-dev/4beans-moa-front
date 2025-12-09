import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { retryPayment } from "@/api/paymentApi";
import { RefreshCw, Phone, AlertCircle } from "lucide-react";

export default function PaymentDetailModal({ isOpen, onClose, payment, onRetrySuccess }) {
    const [isRetrying, setIsRetrying] = useState(false);

    if (!payment) return null;

    const handleRetry = async () => {
        if (!payment.paymentId) return;
        
        setIsRetrying(true);
        try {
            await retryPayment(payment.paymentId);
            alert("결제가 성공적으로 완료되었습니다!");
            if (onRetrySuccess) {
                onRetrySuccess();
            }
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "결제 재시도에 실패했습니다.";
            alert(errorMessage);
        } finally {
            setIsRetrying(false);
        }
    };

    // 재시도 가능 여부 확인
    const canRetry = payment.paymentStatus === "FAILED" && 
                     (payment.canRetry === true || 
                      (payment.attemptNumber === undefined || payment.attemptNumber < 4));
    
    // 최대 재시도 횟수 초과 여부
    const maxRetryExceeded = payment.paymentStatus === "FAILED" && 
                             payment.attemptNumber >= 4;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>결제 상세 정보</DialogTitle>
                    <DialogDescription>결제 내역의 상세 정보입니다.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                        <div className="text-sm text-gray-500">결제 금액</div>
                        <div className="text-xl font-bold">
                            {payment.paymentAmount?.toLocaleString()}원
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">상품명</span>
                            <span className="font-medium">{payment.productName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">결제일시</span>
                            <span>{payment.paymentDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">결제수단</span>
                            <span>{payment.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">카드정보</span>
                            <span>
                                {payment.cardCompany} {payment.cardNumber}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">상태</span>
                            <span
                                className={
                                    payment.paymentStatus === "COMPLETED"
                                        ? "text-green-600 font-bold"
                                        : payment.paymentStatus === "FAILED"
                                            ? "text-red-600 font-bold"
                                            : "text-yellow-600 font-bold"
                                }
                            >
                                {payment.paymentStatus === "COMPLETED" ? "결제완료"
                                    : payment.paymentStatus === "FAILED" ? "결제실패"
                                        : "처리중"}
                            </span>
                        </div>
                    </div>

                    {/* 재시도 정보가 있다면 표시 */}
                    {payment.retryStatus && (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 mt-4">
                            <h4 className="text-red-700 font-bold mb-2 text-sm">
                                재시도 정보
                            </h4>
                            <div className="space-y-1 text-xs text-red-600">
                                <div className="flex justify-between">
                                    <span>시도 횟수</span>
                                    <span>{payment.attemptNumber}회 / 4회</span>
                                </div>
                                {payment.nextRetryDate && (
                                    <div className="flex justify-between">
                                        <span>다음 예정일</span>
                                        <span>{payment.nextRetryDate}</span>
                                    </div>
                                )}
                                <div className="mt-1 pt-1 border-t border-red-200">
                                    <span className="block mb-1">실패 사유:</span>
                                    <span>{payment.retryReason || payment.errorMessage}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 결제 재시도 버튼 (FAILED 상태이고 재시도 가능한 경우) */}
                    {canRetry && (
                        <button
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                            {isRetrying ? "결제 처리 중..." : "결제 재시도"}
                        </button>
                    )}

                    {/* 최대 재시도 횟수 초과 시 고객센터 안내 */}
                    {maxRetryExceeded && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-amber-800 mb-1">
                                        최대 재시도 횟수를 초과했습니다
                                    </p>
                                    <p className="text-xs text-amber-700 mb-3">
                                        결제 문제가 지속되면 고객센터로 문의해주세요.
                                    </p>
                                    <a
                                        href="tel:1588-0000"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
                                    >
                                        <Phone className="w-4 h-4" />
                                        고객센터 연결
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
