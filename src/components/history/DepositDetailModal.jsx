import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function DepositDetailModal({ isOpen, onClose, deposit }) {
    if (!deposit) return null;

    const getStatusLabel = (status) => {
        switch (status) {
            case "PAID": return "보관중";
            case "REFUNDED": return "환불완료";
            case "FORFEITED": return "몰수";
            default: return "처리중";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PAID": return "text-blue-600";
            case "REFUNDED": return "text-gray-600";
            case "FORFEITED": return "text-red-600";
            default: return "text-yellow-600";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>보증금 상세 정보</DialogTitle>
                    <DialogDescription>보증금 내역의 상세 정보입니다.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                        <div className="text-sm text-gray-500">보증금 금액</div>
                        <div className="text-xl font-bold">
                            {(deposit.depositAmount || deposit.amount || 0).toLocaleString()}원
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">상품명</span>
                            <span className="font-medium">{deposit.productName || deposit.partyTitle || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">처리일자</span>
                            <span>{deposit.paymentDate || deposit.createdAt || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">상태</span>
                            <span className={`font-bold ${getStatusColor(deposit.depositStatus || deposit.status)}`}>
                                {getStatusLabel(deposit.depositStatus || deposit.status)}
                            </span>
                        </div>
                        {deposit.refundDate && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">환불일자</span>
                                <span>{deposit.refundDate}</span>
                            </div>
                        )}
                        {deposit.refundAmount && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">환불금액</span>
                                <span>{deposit.refundAmount.toLocaleString()}원</span>
                            </div>
                        )}
                    </div>

                    {(deposit.depositStatus === "REFUNDED" || deposit.status === "REFUNDED") && (
                        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                            <p>환불이 완료된 보증금입니다. 등록된 정산 계좌로 입금되었습니다.</p>
                        </div>
                    )}

                    {(deposit.depositStatus === "FORFEITED" || deposit.status === "FORFEITED") && (
                        <div className="bg-red-50 p-3 rounded-lg text-xs text-red-600">
                            <p>몰수된 보증금입니다. 파티 시작 후 탈퇴로 인해 방장에게 정산됩니다.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
