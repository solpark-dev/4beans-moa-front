import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function DepositDetailModal({ isOpen, onClose, deposit }) {
    if (!deposit) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>보증금 상세 정보</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                        <div className="text-sm text-gray-500">보증금 금액</div>
                        <div className="text-xl font-bold">
                            {deposit.amount.toLocaleString()}원
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">파티명</span>
                            <span className="font-medium">{deposit.partyTitle}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">처리일자</span>
                            <span>{deposit.createdAt}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">상태</span>
                            <span
                                className={`font-bold ${deposit.status === "PAID"
                                        ? "text-blue-600"
                                        : deposit.status === "REFUNDED"
                                            ? "text-gray-600"
                                            : "text-yellow-600"
                                    }`}
                            >
                                {deposit.status === "PAID"
                                    ? "보관중"
                                    : deposit.status === "REFUNDED"
                                        ? "환급완료"
                                        : "처리중"}
                            </span>
                        </div>
                    </div>

                    {deposit.status === "REFUNDED" && (
                        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                            <p>
                                환급이 완료된 보증금입니다. 등록된 정산 계좌로 입금되었습니다.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
