import { Search, ChevronLeft, ChevronRight, History, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { formatDate } from '@/utils/pushUtils'
import { useThemeStore } from '@/store/themeStore'

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50, 100]

// 테마별 스타일
const historyThemeStyles = {
    default: {
        searchButton: 'bg-indigo-600 hover:bg-indigo-700',
        tableRowHover: 'hover:bg-slate-50',
    },
    christmas: {
        searchButton: 'bg-red-800 hover:bg-red-900',
        tableRowHover: 'hover:bg-red-50',
    },
}

const HistoryTab = ({
    history,
    isLoading,
    page,
    totalPages,
    totalCount,
    pageSize,
    filters,
    templates,
    onFilterChange,
    onSearch,
    onPageChange,
    onPageSizeChange
}) => {
    const { theme } = useThemeStore()
    const themeStyle = historyThemeStyles[theme] || historyThemeStyles.default

    return (
        <div className="h-full flex flex-col">
            <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3 flex-shrink-0">
                <Select
                    value={filters.pushCode || 'all'}
                    onValueChange={(v) => onFilterChange('pushCode', v === 'all' ? '' : v)}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="푸시 코드" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {templates.map((t) => (
                            <SelectItem key={t.pushCodeId} value={t.codeName}>
                                {t.codeName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    value={filters.receiverId}
                    onChange={(e) => onFilterChange('receiverId', e.target.value)}
                    placeholder="수신자 ID"
                    className="w-40"
                />

                <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => onFilterChange('startDate', e.target.value)}
                    className="w-36"
                />
                <span className="text-slate-400">~</span>
                <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onFilterChange('endDate', e.target.value)}
                    className="w-36"
                />

                <Button onClick={onSearch} size="sm" className={themeStyle.searchButton}>
                    <Search className="w-4 h-4 mr-1" />
                    검색
                </Button>
            </div>

            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <History className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm">발송 내역이 없습니다</p>
                    </div>
                ) : (
                    <div className="p-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-2 px-3 font-medium text-slate-600">수신자</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-600">푸시코드</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-600">제목</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-600">발송일시</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-600">읽음</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.pushId} className={`border-b border-slate-100 ${themeStyle.tableRowHover}`}>
                                        <td className="py-2.5 px-3 text-slate-700">{item.receiverId}</td>
                                        <td className="py-2.5 px-3">
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {item.pushCode}
                                            </Badge>
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                                            {item.title}
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-500 text-xs">
                                            {formatDate(item.sentAt)}
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                            {item.isRead === 'Y' ? (
                                                <Badge className="bg-green-100 text-green-700">읽음</Badge>
                                            ) : (
                                                <Badge variant="outline">안읽음</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </ScrollArea>

            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">표시 개수:</span>
                    <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
                        <SelectTrigger className="w-20 h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}개
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {totalCount !== undefined && (
                        <span className="text-sm text-slate-400 ml-2">
                            총 {totalCount}건
                        </span>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-slate-600 px-3">
                            {page} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HistoryTab