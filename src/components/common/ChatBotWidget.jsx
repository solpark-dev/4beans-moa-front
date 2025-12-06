import { useEffect, useRef } from "react";
import { useChatBot } from "@/hooks/common/useChatBot";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { MessageCircle, Send, X, Bot, User } from "lucide-react";

const ChatBotWidget = () => {
  const {
    isOpen,
    messages,
    input,
    loading,
    toggleChatBot,
    handleInputChange,
    handleKeyDown,
    sendMessage,
  } = useChatBot();

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* ================= Floating Panel ================= */}
      {isOpen && (
        <Card className="w-[360px] h-[520px] flex flex-col shadow-xl border border-slate-200 bg-white absolute bottom-20 right-0">
          <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3 bg-emerald-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <CardTitle className="text-sm font-semibold">
                MoA AI ChatBot
              </CardTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-white"
              onClick={toggleChatBot}
              aria-label="ChatBot 닫기"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 p-0">
            {/* Quick Menu */}
            <div className="px-4 py-2 flex gap-2 flex-wrap border-b bg-slate-50">
              <button
                onClick={() => sendMessage("구독상품 안내해줘")}
                className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs hover:bg-emerald-200"
              >
                구독상품
              </button>

              <button
                onClick={() => sendMessage("결제 관리 알려줘")}
                className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs hover:bg-emerald-200"
              >
                결제관리
              </button>

              <button
                onClick={() => sendMessage("회원 문의")}
                className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs hover:bg-emerald-200"
              >
                회원문의
              </button>

              <button
                onClick={() => sendMessage("기타 문의")}
                className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs hover:bg-emerald-200"
              >
                기타
              </button>
            </div>

            {/* 채팅 스크롤 영역 */}
            <ScrollArea className="px-4 py-3" style={{ height: "350px" }}>
              <div className="flex flex-col gap-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {m.role === "bot" && (
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-3 py-2 text-sm leading-snug ${
                          m.role === "user"
                            ? "bg-emerald-600 text-white rounded-br-sm"
                            : "bg-slate-100 text-slate-900 rounded-bl-sm"
                        }`}
                      >
                        {m.content}
                      </div>

                      {m.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* 입력창 */}
            <div className="border-t px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  disabled={loading}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="무엇이 궁금해?"
                  aria-label="ChatBot 입력"
                  className="text-sm"
                />
                <Button
                  type="button"
                  size="icon"
                  disabled={loading || !input.trim()}
                  onClick={() => sendMessage()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-[10px] text-slate-400">
                AI가 제공하는 자동 응답입니다.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= Floating Button ================= */}
      {!isOpen && (
        <Button
          type="button"
          size="icon"
          className="w-16 h-16 rounded-full shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={toggleChatBot}
          aria-label="MoA ChatBot 열기"
        >
          <MessageCircle className="w-7 h-7" />
        </Button>
      )}
    </div>
  );
};

export default ChatBotWidget;
