import { Trash2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AccordionItem,
    AccordionContent
} from '@/components/ui/accordion'
import { getPushIcon } from '@/utils/pushUtils'
import { useThemeStore } from '@/store/themeStore'

// 테마별 스타일
const notificationThemeStyles = {
    default: {
        unreadBg: 'bg-indigo-50/50 border-indigo-100',
        unreadDot: 'bg-indigo-500',
    },
    christmas: {
        unreadBg: 'bg-red-50/50 border-red-100',
        unreadDot: 'bg-red-600',
    },
}

const formatRelativeDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}

const NotificationItem = ({
    notification,
    isExpanded = false,
    onToggle,
    onDelete,
    onMarkAsRead
}) => {
    const { theme } = useThemeStore()
    const themeStyle = notificationThemeStyles[theme] || notificationThemeStyles.default
    const isUnread = notification.isRead === 'N'

    const handleClick = () => {
        if (onToggle) {
            onToggle(notification.pushId)
        }
        if (isUnread && onMarkAsRead) {
            onMarkAsRead(notification.pushId)
        }
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        if (onDelete) {
            onDelete(notification.pushId, e)
        }
    }

    return (
        <AccordionItem
            value={notification.pushId.toString()}
            className={`border rounded-lg mb-2 overflow-hidden transition-colors ${
                isUnread
                    ? themeStyle.unreadBg
                    : 'bg-white border-slate-100'
            }`}
        >
            <div 
                className="flex items-center w-full px-3 py-2.5 cursor-pointer group hover:bg-slate-50/50 transition-colors"
                onClick={handleClick}
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
                                        ? 'font-semibold text-slate-900'
                                        : 'font-medium text-slate-700'
                                }`}
                            >
                                {notification.title}
                            </p>
                            {isUnread && (
                                <span className={`w-2 h-2 ${themeStyle.unreadDot} rounded-full flex-shrink-0`} />
                            )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            {formatRelativeDate(notification.sentAt)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                    <ChevronDown 
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                        }`} 
                    />
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    )}
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
    )
}

export default NotificationItem