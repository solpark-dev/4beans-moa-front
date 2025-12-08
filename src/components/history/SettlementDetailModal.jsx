import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function SettlementDetailModal({ isOpen, onClose, settlement }) {
    if (!settlement) return null;

    const getStatusLabel = (status) => {
        switch (status) {
            case "COMPLETED": return "정산완료";
            case "PENDING": return "대기중";
            case "IN_PROGRESS": return "처리중";
            case "FAILED": return "실패";
            default: return "알수없음";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "COMPLETED": return "text-green-600";
            case "PENDING": return "text-yellow-600";
            case "IN_PROGRESS": return "text-blue-600";
            case "FAILED": return "text-red-600";
            default: return "text-gray-600";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>정산 상세 정보</DialogTitle>
                    <DialogDescription>정산 내역의 상세 정보입니다.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                        <div className="text-sm text-gray-500">정산 금액</div>
                        <div className="text-xl font-bold text-green-600">
                            +{(settlement.netAmount || settlement.amount || 0).toLocaleString()}원
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">상품명</span>
                            <span className="font-medium">{settlement.productName || settlement.partyTitle || `파티 #${settlement.partyId}`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">정산 기간</span>
                            <span>{settlement.settlementMonth || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">정산일자</span>
                            <span>{settlement.settlementDate || settlement.transferDate || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">상태</span>
                            <span className={`font-bold ${getStatusColor(settlement.settlementStatus || settlement.status)}`}>
                                {getStatusLabel(settlement.settlementStatus || settlement.status)}
                            </span>
                        </div>
                        {settlement.totalAmount && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">총 결제금액</span>
                                <span>{settlement.totalAmount.toLocaleString()}원</span>
                            </div>
                        )}
                        {settlement.commissionAmount && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">수수료</span>
                                <span className="text-red-500">-{settlement.commissionAmount.toLocaleString()}원</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg text-xs text-purple-700">
                        <p>파티에서 발생한 정산 금액입니다. 등록된 정산 계좌로 입금됩니다.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
