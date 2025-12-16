import { useState } from 'react'
import { Plus, Pencil, Trash2, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Accordion,
    AccordionItem,
    AccordionContent
} from '@/components/ui/accordion'
import { useThemeStore } from '@/store/themeStore'

// 테마별 스타일
const templatesThemeStyles = {
    default: {
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
        editHover: 'hover:text-indigo-600 hover:bg-indigo-100',
        cardBorder: 'border-slate-200',
        cardBg: 'bg-white hover:bg-slate-50',
        cardExpanded: 'bg-slate-50',
        contentBorder: 'border-slate-200',
    },
    christmas: {
        buttonBg: 'bg-red-800 hover:bg-red-900',
        editHover: 'hover:text-red-800 hover:bg-red-100',
        cardBorder: 'border-gray-200',
        cardBg: 'bg-white hover:bg-red-50',
        cardExpanded: 'bg-red-50',
        contentBorder: 'border-gray-200',
    },
}

const TemplatesTab = ({ templates, isLoading, onAdd, onEdit, onDelete }) => {
    const { theme } = useThemeStore()
    const themeStyle = templatesThemeStyles[theme] || templatesThemeStyles.default
    const [expandedId, setExpandedId] = useState('')

    return (
        <div className="h-full flex flex-col">
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <p className="text-sm text-slate-500">
                    총 <span className="font-semibold text-slate-700">{templates.length}</span>개의 템플릿
                </p>
                <Button onClick={onAdd} size="sm" className={themeStyle.buttonBg}>
                    <Plus className="w-4 h-4 mr-1" />
                    새 템플릿
                </Button>
            </div>

            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                ) : templates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <FileText className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm">등록된 템플릿이 없습니다</p>
                    </div>
                ) : (
                    <Accordion
                        type="single"
                        collapsible
                        value={expandedId}
                        onValueChange={(val) => setExpandedId(val || '')}
                        className="p-4 space-y-2"
                    >
                        {templates.map((template) => {
                            const isExpanded = expandedId === template.pushCodeId.toString()
                            return (
                                <AccordionItem
                                    key={template.pushCodeId}
                                    value={template.pushCodeId.toString()}
                                    className={`border ${themeStyle.cardBorder} rounded-xl overflow-hidden transition-colors ${
                                        isExpanded ? themeStyle.cardExpanded : themeStyle.cardBg
                                    }`}
                                >
                                    <div
                                        className="flex items-center w-full px-4 py-3 cursor-pointer"
                                        onClick={() => setExpandedId(isExpanded ? '' : template.pushCodeId.toString())}
                                    >
                                        <Badge variant="outline" className="font-mono text-xs flex-shrink-0 w-40 justify-center bg-white">
                                            {template.codeName}
                                        </Badge>
                                        
                                        <span className="font-medium text-slate-900 truncate flex-1 ml-3">
                                            {template.titleTemplate}
                                        </span>
                                        
                                        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onEdit(template)
                                                }}
                                                className={`h-8 w-8 text-slate-400 ${themeStyle.editHover}`}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onDelete(template.pushCodeId)
                                                }}
                                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <AccordionContent className="px-4 pb-4 pt-0">
                                        <div className={`bg-white border ${themeStyle.contentBorder} rounded-lg p-3`}>
                                            <p className="text-xs text-slate-500 mb-1">내용 템플릿</p>
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                                {template.contentTemplate}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                )}
            </ScrollArea>
        </div>
    )
}

export default TemplatesTab