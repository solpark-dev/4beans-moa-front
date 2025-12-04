import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function SettlementDetailModal({ isOpen, onClose, settlement }) {
    if (!settlement) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>정산 상세 정보</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                        <div className="text-sm text-gray-500">정산 금액</div>
                        <div className="text-xl font-bold">
                            {settlement.amount.toLocaleString()}원
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">파티명</span>
                            <span className="font-medium">{settlement.partyTitle}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">정산일자</span>
                            <span>{settlement.settlementDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">상태</span>
                            <span className="text-purple-600 font-bold">정산완료</span>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg text-xs text-purple-700">
                        <p>
                            파티 모임 통장에서 발생한 정산 금액입니다. 등록된 정산 계좌로
                            입금되었습니다.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
