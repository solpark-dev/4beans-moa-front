import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function PaymentDetailModal({ isOpen, onClose, payment }) {
    if (!payment) return null;

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
                            {payment.paymentAmount.toLocaleString()}원
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
                                    <span>{payment.attemptNumber}회</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>다음 예정일</span>
                                    <span>{payment.nextRetryDate}</span>
                                </div>
                                <div className="mt-1 pt-1 border-t border-red-200">
                                    <span className="block mb-1">실패 사유:</span>
                                    <span>{payment.retryReason || payment.errorMessage}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
