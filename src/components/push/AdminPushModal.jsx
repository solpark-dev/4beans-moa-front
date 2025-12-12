import { useState, useEffect } from "react";
import {
  Bell,
  X,
  FileText,
  History,
  Send,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAdminPush from "@/hooks/push/useAdminPush";

// ===== 날짜 포맷 =====
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ===== localStorage 키 =====
const HISTORY_PAGE_SIZE_KEY = "admin_push_history_page_size";

// ===== 메인 모달 =====
export default function AdminPushModal({ isOpen, onClose }) {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    // 템플릿
    templates,
    editingTemplate,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    handleAddTemplate,
    handleEditTemplate,
    handleSaveTemplate,
    handleDeleteTemplate,
    setEditingTemplate,
    // 발송 내역
    history,
    historyPage,
    historyTotalPages,
    historyTotalCount,
    historyFilters,
    handleHistoryFilterChange,
    handleHistorySearch,
    handleHistoryPageChange,
    handleHistoryPageSizeChange,
    // 수동 발송
    users,
    usersTotalCount,
    usersPage,
    usersTotalPages,
    userSearchKeyword,
    selectedUsers,
    sendForm,
    handleUserSearch,
    handleUsersPageChange,
    handleSelectUser,
    handleSelectAllUsers,
    handleRemoveUser,
    handleClearSelectedUsers,
    handleSendFormChange,
    handleSendPush,
  } = useAdminPush();

  // 페이지 사이즈 상태 (localStorage에서 복원)
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem(HISTORY_PAGE_SIZE_KEY);
    return saved ? parseInt(saved, 10) : 20;
  });

  // 페이지 사이즈 변경 핸들러
  const handlePageSizeChange = (newSize) => {
    const size = parseInt(newSize, 10);
    setPageSize(size);
    localStorage.setItem(HISTORY_PAGE_SIZE_KEY, size.toString());
    if (handleHistoryPageSizeChange) {
      handleHistoryPageSizeChange(size);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0 bg-white rounded-2xl overflow-hidden">
        {/* 헤더 */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  푸시 알림 관리
                </DialogTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  템플릿 관리 · 발송 내역 · 수동 발송
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start gap-1 px-6 py-3 bg-slate-50 border-b border-slate-200 rounded-none h-auto flex-shrink-0">
            <TabsTrigger
              value="templates"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium"
            >
              <FileText className="w-4 h-4" />
              템플릿 관리
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium"
            >
              <History className="w-4 h-4" />
              발송 내역
            </TabsTrigger>
            <TabsTrigger
              value="send"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium"
            >
              <Send className="w-4 h-4" />
              수동 발송
            </TabsTrigger>
          </TabsList>

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="templates" className="h-full m-0">
              <TemplatesTab
                templates={templates}
                isLoading={isLoading}
                onAdd={handleAddTemplate}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
              />
            </TabsContent>

            <TabsContent value="history" className="h-full m-0">
              <HistoryTab
                history={history}
                isLoading={isLoading}
                page={historyPage}
                totalPages={historyTotalPages}
                totalCount={historyTotalCount}
                pageSize={pageSize}
                filters={historyFilters}
                templates={templates}
                onFilterChange={handleHistoryFilterChange}
                onSearch={handleHistorySearch}
                onPageChange={handleHistoryPageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </TabsContent>

            <TabsContent value="send" className="h-full m-0">
              <SendTab
                users={users}
                usersTotalCount={usersTotalCount}
                usersPage={usersPage}
                usersTotalPages={usersTotalPages}
                searchKeyword={userSearchKeyword}
                selectedUsers={selectedUsers}
                sendForm={sendForm}
                isLoading={isLoading}
                onSearch={handleUserSearch}
                onUsersPageChange={handleUsersPageChange}
                onSelectUser={handleSelectUser}
                onSelectAllUsers={handleSelectAllUsers}
                onRemoveUser={handleRemoveUser}
                onClearSelectedUsers={handleClearSelectedUsers}
                onFormChange={handleSendFormChange}
                onSend={handleSendPush}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* 템플릿 편집 모달 */}
        <TemplateEditModal
          isOpen={isTemplateModalOpen}
          onClose={() => {
            setIsTemplateModalOpen(false);
            setEditingTemplate(null);
          }}
          template={editingTemplate}
          onSave={handleSaveTemplate}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}

// ===== 템플릿 관리 탭 (아코디언 방식) =====
function TemplatesTab({ templates, isLoading, onAdd, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState("");

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <p className="text-sm text-slate-500">
          총 <span className="font-semibold text-slate-700">{templates.length}</span>개의 템플릿
        </p>
        <Button onClick={onAdd} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
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
            onValueChange={(val) => setExpandedId(val || "")}
            className="p-4 space-y-2"
          >
            {templates.map((template) => {
              const isExpanded = expandedId === template.pushCodeId.toString();
              return (
                <AccordionItem
                  key={template.pushCodeId}
                  value={template.pushCodeId.toString()}
                  className={`border border-slate-200 rounded-xl overflow-hidden transition-colors ${
                    isExpanded ? "bg-slate-50" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {/* 헤더 영역 */}
                  <div
                    className="flex items-center w-full px-4 py-3 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? "" : template.pushCodeId.toString())}
                  >
                    {/* 코드 뱃지 */}
                    <Badge variant="outline" className="font-mono text-xs flex-shrink-0 w-40 justify-center bg-white">
                      {template.codeName}
                    </Badge>
                    
                    {/* 제목 */}
                    <span className="font-medium text-slate-900 truncate flex-1 ml-3">
                      {template.titleTemplate}
                    </span>
                    
                    {/* 수정/삭제 버튼 */}
                    <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(template);
                        }}
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(template.pushCodeId);
                        }}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 펼친 상태: 내용 */}
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="bg-white border border-slate-200 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">내용 템플릿</p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">
                        {template.contentTemplate}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </ScrollArea>
    </div>
  );
}

// ===== 템플릿 편집 모달 =====
function TemplateEditModal({ isOpen, onClose, template, onSave, isLoading }) {
  const [form, setForm] = useState({
    codeName: "",
    titleTemplate: "",
    contentTemplate: "",
  });

  // template이 변경되면 form 초기화
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (template) {
      setForm({
        codeName: template.codeName || "",
        titleTemplate: template.titleTemplate || "",
        contentTemplate: template.contentTemplate || "",
      });
    } else {
      setForm({
        codeName: "",
        titleTemplate: "",
        contentTemplate: "",
      });
    }
  }, [template]);

  const handleSubmit = async () => {
    if (!form.codeName || !form.titleTemplate || !form.contentTemplate) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    await onSave({
      ...template,
      ...form,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {template?.pushCodeId ? "템플릿 수정" : "새 템플릿 추가"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              푸시 코드
            </label>
            <Input
              value={form.codeName}
              onChange={(e) => setForm({ ...form, codeName: e.target.value.toUpperCase() })}
              placeholder="예: PAY_SUCCESS"
              className="font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">영문 대문자와 언더스코어(_)만 사용</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              제목 템플릿
            </label>
            <Input
              value={form.titleTemplate}
              onChange={(e) => setForm({ ...form, titleTemplate: e.target.value })}
              placeholder="예: 결제 완료"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              내용 템플릿
            </label>
            <Textarea
              value={form.contentTemplate}
              onChange={(e) => setForm({ ...form, contentTemplate: e.target.value })}
              placeholder="예: {productName} 결제가 완료되었습니다. 금액: {amount}원"
              rows={4}
            />
            <p className="text-xs text-slate-400 mt-1">
              {"{변수명}"} 형식으로 동적 값 사용 가능
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ===== 발송 내역 탭 =====
function HistoryTab({
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
  onPageSizeChange,
}) {
  const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50, 100];

  return (
    <div className="h-full flex flex-col">
      {/* 필터 */}
      <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3 flex-shrink-0">
        <Select
          value={filters.pushCode || "all"}
          onValueChange={(v) => onFilterChange("pushCode", v === "all" ? "" : v)}
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
          onChange={(e) => onFilterChange("receiverId", e.target.value)}
          placeholder="수신자 ID"
          className="w-40"
        />

        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
          className="w-36"
        />
        <span className="text-slate-400">~</span>
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
          className="w-36"
        />

        <Button onClick={onSearch} size="sm">
          <Search className="w-4 h-4 mr-1" />
          검색
        </Button>
      </div>

      {/* 목록 */}
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
                  <tr key={item.pushId} className="border-b border-slate-100 hover:bg-slate-50">
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
                      {item.isRead === "Y" ? (
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

      {/* 하단: 페이지 사이즈 선택 + 페이지네이션 */}
      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
        {/* 페이지 사이즈 선택 */}
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

        {/* 페이지네이션 */}
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
  );
}

// ===== 수동 발송 탭 =====
function SendTab({
  users,
  usersTotalCount,
  usersPage,
  usersTotalPages,
  searchKeyword,
  selectedUsers,
  sendForm,
  isLoading,
  onSearch,
  onUsersPageChange,
  onSelectUser,
  onSelectAllUsers,
  onRemoveUser,
  onClearSelectedUsers,
  onFormChange,
  onSend,
}) {
  // 현재 페이지의 모든 유저가 선택되었는지 확인
  const isAllCurrentPageSelected = users.length > 0 && users.every(
    (user) => selectedUsers.some((u) => u.userId === user.userId)
  );

  return (
    <div className="h-full flex">
      {/* 왼쪽: 수신자 선택 */}
      <div className="w-1/2 border-r border-slate-200 flex flex-col">
        {/* 검색 */}
        <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <p className="text-sm font-medium text-slate-700 mb-2">수신자 선택</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchKeyword}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="이름, 이메일로 검색"
              className="pl-9"
            />
          </div>
        </div>

        {/* 전체 선택 헤더 */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllCurrentPageSelected}
              onCheckedChange={(checked) => onSelectAllUsers(users, checked)}
            />
            <span className="text-sm text-slate-600">
              현재 페이지 전체 선택
            </span>
          </div>
          <span className="text-xs text-slate-400">
            총 {usersTotalCount || 0}명
          </span>
        </div>

        {/* 유저 리스트 */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <User className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">사용자가 없습니다</p>
              </div>
            ) : (
              users.map((user) => {
                const isSelected = selectedUsers.some((u) => u.userId === user.userId);
                return (
                  <div
                    key={user.userId}
                    className={`p-3 rounded-lg mb-1 flex items-center gap-3 transition-colors ${
                      isSelected
                        ? "bg-indigo-50 border border-indigo-200"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectUser(user)}
                    />
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{user.nickname}</p>
                      <p className="text-xs text-slate-500 truncate">{user.userId}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* 페이지네이션 */}
        {usersTotalPages > 1 && (
          <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUsersPageChange(usersPage - 1)}
              disabled={usersPage <= 1}
              className="h-7 w-7"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <span className="text-xs text-slate-600 px-2">
              {usersPage} / {usersTotalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUsersPageChange(usersPage + 1)}
              disabled={usersPage >= usersTotalPages}
              className="h-7 w-7"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* 선택된 수신자 */}
        {selectedUsers.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500">
                선택됨 ({selectedUsers.length}명)
              </p>
              <button
                onClick={onClearSelectedUsers}
                className="text-xs text-red-500 hover:text-red-700"
              >
                전체 해제
              </button>
            </div>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {selectedUsers.map((user) => (
                <Badge
                  key={user.userId}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  {user.nickname}
                  <button
                    onClick={() => onRemoveUser(user.userId)}
                    className="hover:bg-slate-300 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 오른쪽: 메시지 작성 */}
      <div className="w-1/2 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <p className="text-sm font-medium text-slate-700">메시지 작성</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* 제목 */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                제목
              </label>
              <Input
                value={sendForm.title}
                onChange={(e) => onFormChange("title", e.target.value)}
                placeholder="푸시 알림 제목"
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                내용
              </label>
              <Textarea
                value={sendForm.content}
                onChange={(e) => onFormChange("content", e.target.value)}
                placeholder="푸시 알림 내용을 입력하세요"
                rows={5}
              />
            </div>

            {/* 안내 문구 */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-700">
                💡 선택한 모든 수신자에게 동일한 메시지가 발송됩니다.
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* 발송 버튼 */}
        <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0">
          <Button
            onClick={onSend}
            disabled={isLoading || selectedUsers.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-1" />
            )}
            {selectedUsers.length}명에게 발송
          </Button>
        </div>
      </div>
    </div>
  );
}