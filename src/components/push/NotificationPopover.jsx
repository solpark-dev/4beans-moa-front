import { useState } from 'react'
import { Bell, Check, Trash2, ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { Accordion } from '@/components/ui/accordion'
import usePushNotification from '@/hooks/push/usePushNotification'
import AdminPushModal from '@/components/push/AdminPushModal'
import NotificationItem from '@/components/push/shared/NotificationItem'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

// 테마별 스타일
const popoverThemeStyles = {
    default: {
        readAllHover: 'hover:text-indigo-600',
    },
    christmas: {
        readAllHover: 'hover:text-red-700',
    },
}

export default function NotificationPopover({ children }) {
    const { user } = useAuthStore()
    const { theme } = useThemeStore()
    const themeStyle = popoverThemeStyles[theme] || popoverThemeStyles.default
    const isAdmin = user?.role === 'ADMIN'
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)

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
        handleOpenChange
    } = usePushNotification()

    const todayNotifications = notifications.filter((n) => {
        const date = new Date(n.sentAt)
        const today = new Date()
        return date.toDateString() === today.toDateString()
    })

    const previousNotifications = notifications.filter((n) => {
        const date = new Date(n.sentAt)
        const today = new Date()
        return date.toDateString() !== today.toDateString()
    })

    const bellButton = (onClick) => (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className="relative rounded-full w-11 h-11 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </Button>
    )

    if (isAdmin) {
        return (
            <>
                {bellButton(() => setIsAdminModalOpen(true))}
                <AdminPushModal
                    isOpen={isAdminModalOpen}
                    onClose={() => setIsAdminModalOpen(false)}
                />
            </>
        )
    }

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                {children || bellButton()}
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
                                className={`h-8 px-2 text-xs text-slate-600 ${themeStyle.readAllHover}`}
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
                                value={expandedId ? expandedId.toString() : ''}
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
                                                isExpanded={expandedId === notification.pushId}
                                                onToggle={handleToggleExpand}
                                                onDelete={handleDelete}
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
                                                isExpanded={expandedId === notification.pushId}
                                                onToggle={handleToggleExpand}
                                                onDelete={handleDelete}
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
    )
}