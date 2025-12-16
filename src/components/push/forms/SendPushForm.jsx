import { Send, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const sendFormThemeStyles = {
    default: {
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
        warningBg: 'bg-amber-50 border-amber-200',
        warningText: 'text-amber-700',
        sendAllButton: 'border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700',
    },
    christmas: {
        buttonBg: 'bg-red-800 hover:bg-red-900',
        warningBg: 'bg-green-50 border-green-200',
        warningText: 'text-green-800',
        sendAllButton: 'border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700',
    },
};

const SendPushForm = ({
    sendForm = { title: "", content: "" },
    selectedCount = 0,
    isLoading = false,
    onFormChange,
    onSend,
    onSendToAll,
}) => {
    const { theme } = useThemeStore();
    const themeStyle = sendFormThemeStyles[theme] || sendFormThemeStyles.default;

    const handleSend = () => {
        if (onSend && typeof onSend === "function") {
            onSend();
        }
    };

    const handleSendToAll = () => {
        if (onSendToAll && typeof onSendToAll === "function") {
            onSendToAll();
        }
    };

    return (
        <div className="h-full flex flex-col p-4">
            <div className="mb-3">
                <p className="text-sm font-medium text-slate-700">메시지 작성</p>
            </div>

            <div className="space-y-4 flex-1">
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                        제목
                    </label>
                    <Input
                        value={sendForm.title || ""}
                        onChange={(e) => onFormChange && onFormChange("title", e.target.value)}
                        placeholder="푸시 알림 제목"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                        내용
                    </label>
                    <Textarea
                        value={sendForm.content || ""}
                        onChange={(e) => onFormChange && onFormChange("content", e.target.value)}
                        placeholder="푸시 알림 내용을 입력하세요"
                        rows={4}
                    />
                </div>

                <div className={`p-3 rounded-lg border ${themeStyle.warningBg}`}>
                    <p className={`text-xs ${themeStyle.warningText}`}>
                        💡 선택한 모든 수신자에게 동일한 메시지가 발송됩니다.
                    </p>
                </div>

                <div className="space-y-2 pt-2">
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || selectedCount === 0}
                        className={`w-full ${themeStyle.buttonBg}`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4 mr-1" />
                        )}
                        {selectedCount}명에게 발송
                    </Button>

                    <Button
                        onClick={handleSendToAll}
                        disabled={isLoading || !sendForm.title || !sendForm.content}
                        variant="outline"
                        className={`w-full ${themeStyle.sendAllButton}`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                            <Users className="w-4 h-4 mr-1" />
                        )}
                        전체 발송 (관리자 제외)
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SendPushForm;