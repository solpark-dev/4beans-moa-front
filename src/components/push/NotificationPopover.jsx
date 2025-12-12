import { useState } from "react";
import { Bell, Check, Trash2, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import usePushNotification from "@/hooks/push/usePushNotification";
import AdminPushModal from "@/components/push/AdminPushModal";
import { useAuthStore } from "@/store/authStore";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
};

const getPushIcon = (pushCode) => {
  const iconMap = {
    PAYMENT_SUCCESS: "💳",
    PAYMENT_FAIL: "❌",
    PARTY_JOIN: "🎉",
    PARTY_WITHDRAW: "👋",
    PARTY_START: "🚀",
    PARTY_END: "🏁",
    DEPOSIT_PAID: "💰",
    DEPOSIT_REFUND: "💸",
    SETTLEMENT_MONTHLY: "📊",
    INQUIRY_ANSWER: "💬",
    PAY_SUCCESS: "💳",
    PAY_FAILED_RETRY: "⚠️",
    PAY_FAILED_BALANCE: "💸",
    PAY_FAILED_LIMIT: "📊",
    PAY_FAILED_CARD: "💳",
    PAY_FINAL_FAILED: "❌",
    PAY_UPCOMING: "📅",
    PAY_RETRY_SUCCESS: "✅",
    PAY_MEMBER_FAILED_LEADER: "👤",
    PAY_TIMEOUT: "⏰",
    DEPOSIT_REFUNDED: "💰",
    DEPOSIT_FORFEITED: "🚫",
    REFUND_SUCCESS: "✅",
    SETTLE_COMPLETED: "💵",
    SETTLE_FAILED: "❌",
    ACCOUNT_REQUIRED: "🏦",
    VERIFY_REQUESTED: "🔢",
    ACCOUNT_VERIFIED: "✅",
    VERIFY_EXPIRED: "⏰",
    VERIFY_EXCEEDED: "🚫",
    PARTY_CLOSED: "🏁",
    PARTY_MEMBER_JOIN: "👋",
    PARTY_MEMBER_WITHDRAW: "👋",
  };
  return iconMap[pushCode] || "🔔";
};

export default function NotificationPopover({ children }) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";
  
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    isOpen,
    expandedId,
    hasMore,
    handleToggleExpand,
    handleReadAll,
    handleDelete,
    handleDeleteAll,
    handleLoadMore,
    handleOpenChange,
  } = usePushNotification();

  const todayNotifications = notifications.filter((n) => {
    const date = new Date(n.sentAt);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  });

  const previousNotifications = notifications.filter((n) => {
    const date = new Date(n.sentAt);
    const today = new Date();
    return date.toDateString() !== today.toDateString();
  });

  // 관리자일 경우: 큰 모달 띄우기
  if (isAdmin) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAdminModalOpen(true)}
          className="relative rounded-full w-11 h-11 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>

        <AdminPushModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
        />
      </>
    );
  }

  // 일반 유저: 기존 팝오버
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full w-11 h-11 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0 bg-white border border-slate-200 rounded-2xl shadow-xl"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">알림</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReadAll}
                className="h-8 px-2 text-xs text-slate-600 hover:text-indigo-600"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                전체 읽음
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteAll}
                className="h-8 px-2 text-xs text-slate-600 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                전체 삭제
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading && notifications.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">알림이 없습니다</p>
            </div>
          ) : (
            <div className="py-2">
              <Accordion
                type="single"
                collapsible
                value={expandedId?.toString()}
                onValueChange={(val) =>
                  handleToggleExpand(val ? parseInt(val) : null)
                }
              >
                {todayNotifications.length > 0 && (
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      오늘 받은 알림
                    </p>
                    {todayNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.pushId}
                        notification={notification}
                        onDelete={handleDelete}
                        onToggle={handleToggleExpand}
                        isExpanded={expandedId === notification.pushId}
                      />
                    ))}
                  </div>
                )}

                {previousNotifications.length > 0 && (
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      이전 알림
                    </p>
                    {previousNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.pushId}
                        notification={notification}
                        onDelete={handleDelete}
                        onToggle={handleToggleExpand}
                        isExpanded={expandedId === notification.pushId}
                      />
                    ))}
                  </div>
                )}
              </Accordion>

              {hasMore && (
                <div className="px-4 pb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="w-full h-9 text-xs text-slate-500 hover:text-slate-700"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    )}
                    더 보기
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

const NotificationItem = ({ notification, onDelete, onToggle, isExpanded }) => {
  const isUnread = notification.isRead === "N";

  return (
    <AccordionItem
      value={notification.pushId.toString()}
      className={`border rounded-lg mb-2 overflow-hidden transition-colors ${
        isUnread
          ? "bg-indigo-50/50 border-indigo-100"
          : "bg-white border-slate-100"
      }`}
    >
      <div 
        className="flex items-center w-full px-3 py-2.5 cursor-pointer group hover:bg-slate-50/50 transition-colors"
        onClick={() => onToggle(notification.pushId)}
      >
        <div className="flex items-start gap-3 flex-1">
          <span className="text-lg flex-shrink-0">
            {getPushIcon(notification.pushCode)}
          </span>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p
                className={`text-sm ${
                  isUnread
                    ? "font-semibold text-slate-900"
                    : "font-medium text-slate-700"
                }`}
              >
                {notification.title}
              </p>
              {isUnread && (
                <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {formatDate(notification.sentAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
          <ChevronDown 
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`} 
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.pushId, e);
            }}
            className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <AccordionContent className="px-3 pb-3 pt-0">
        <div className="pl-8 pr-2">
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {notification.content}
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};