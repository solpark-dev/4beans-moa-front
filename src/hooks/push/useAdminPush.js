import { useState, useEffect, useCallback } from "react";
import adminPushApi from "@/api/adminPushApi";
import { useAuthStore } from "@/store/authStore";

// localStorage 키
const HISTORY_PAGE_SIZE_KEY = "admin_push_history_page_size";

export const useAdminPush = () => {
  // ===== 공통 상태 =====
  const [activeTab, setActiveTab] = useState("templates");
  const [isLoading, setIsLoading] = useState(false);

  // ===== 템플릿 관리 상태 =====
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // ===== 발송 내역 상태 =====
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalCount, setHistoryTotalCount] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(() => {
    const saved = localStorage.getItem(HISTORY_PAGE_SIZE_KEY);
    return saved ? parseInt(saved, 10) : 20;
  });
  const [historyFilters, setHistoryFilters] = useState({
    pushCode: "",
    receiverId: "",
    startDate: "",
    endDate: "",
  });

  // ===== 수동 발송 상태 =====
  const [users, setUsers] = useState([]);
  const [usersTotalCount, setUsersTotalCount] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [userSearchKeyword, setUserSearchKeyword] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendForm, setSendForm] = useState({
    sendType: "CUSTOM",
    pushCode: "",
    title: "",
    content: "",
    params: {},
  });

  // ===== 템플릿 관리 =====

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminPushApi.getPushCodeList();
      setTemplates(response || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddTemplate = useCallback(() => {
    setEditingTemplate({
      codeName: "",
      titleTemplate: "",
      contentTemplate: "",
    });
    setIsTemplateModalOpen(true);
  }, []);

  const handleEditTemplate = useCallback((template) => {
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  }, []);

  const handleSaveTemplate = useCallback(async (templateData) => {
    setIsLoading(true);
    try {
      if (templateData.pushCodeId) {
        await adminPushApi.updatePushCode(templateData.pushCodeId, {
          codeName: templateData.codeName,
          titleTemplate: templateData.titleTemplate,
          contentTemplate: templateData.contentTemplate,
        });
      } else {
        await adminPushApi.addPushCode({
          codeName: templateData.codeName,
          titleTemplate: templateData.titleTemplate,
          contentTemplate: templateData.contentTemplate,
        });
      }
      await fetchTemplates();
      setIsTemplateModalOpen(false);
      setEditingTemplate(null);
      return { success: true };
    } catch (error) {
      console.error("Failed to save template:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [fetchTemplates]);

  const handleDeleteTemplate = useCallback(async (pushCodeId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    
    setIsLoading(true);
    try {
      await adminPushApi.deletePushCode(pushCodeId);
      await fetchTemplates();
    } catch (error) {
      console.error("Failed to delete template:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTemplates]);

  // ===== 발송 내역 =====

  const fetchHistory = useCallback(async (page = 1, pageSize = historyPageSize) => {
    setIsLoading(true);
    try {
      const response = await adminPushApi.getPushHistory(page, pageSize, historyFilters);
      setHistory(response.content || []);
      setHistoryPage(response.page || 1);
      setHistoryTotalPages(response.totalPages || 1);
      setHistoryTotalCount(response.total || 0);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [historyFilters, historyPageSize]);

  const handleHistoryFilterChange = useCallback((key, value) => {
    setHistoryFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleHistorySearch = useCallback(() => {
    fetchHistory(1, historyPageSize);
  }, [fetchHistory, historyPageSize]);

  const handleHistoryPageChange = useCallback((page) => {
    fetchHistory(page, historyPageSize);
  }, [fetchHistory, historyPageSize]);

  const handleHistoryPageSizeChange = useCallback((newSize) => {
    const size = parseInt(newSize, 10);
    setHistoryPageSize(size);
    localStorage.setItem(HISTORY_PAGE_SIZE_KEY, size.toString());
    fetchHistory(1, size);
  }, [fetchHistory]);

  // ===== 수동 발송 - 유저 목록 =====

  const fetchUsers = useCallback(async (page = 1, keyword = "") => {
    setIsLoading(true);
    try {
      const response = await adminPushApi.getUserList(page, 10, keyword);
      setUsers(response.content || []);
      setUsersPage(response.page || 1);
      setUsersTotalPages(response.totalPages || 1);
      setUsersTotalCount(response.totalCount || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setUsersTotalCount(0);
      setUsersTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUserSearch = useCallback((keyword) => {
    setUserSearchKeyword(keyword);
    setUsersPage(1);
    fetchUsers(1, keyword);
  }, [fetchUsers]);

  const handleUsersPageChange = useCallback((page) => {
    setUsersPage(page);
    fetchUsers(page, userSearchKeyword);
  }, [fetchUsers, userSearchKeyword]);

  // ===== 수동 발송 - 유저 선택 =====

  const handleSelectUser = useCallback((user) => {
    setSelectedUsers(prev => {
      const exists = prev.find(u => u.userId === user.userId);
      if (exists) {
        return prev.filter(u => u.userId !== user.userId);
      }
      return [...prev, user];
    });
  }, []);

  const handleSelectAllUsers = useCallback((usersToSelect, checked) => {
    if (checked) {
      setSelectedUsers(prev => {
        const existingIds = new Set(prev.map(u => u.userId));
        const newUsers = usersToSelect.filter(u => !existingIds.has(u.userId));
        return [...prev, ...newUsers];
      });
    } else {
      const idsToRemove = new Set(usersToSelect.map(u => u.userId));
      setSelectedUsers(prev => prev.filter(u => !idsToRemove.has(u.userId)));
    }
  }, []);

  const handleRemoveUser = useCallback((userId) => {
    setSelectedUsers(prev => prev.filter(u => u.userId !== userId));
  }, []);

  const handleClearSelectedUsers = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  // ===== 수동 발송 - 폼 & 발송 =====

  const handleSendFormChange = useCallback((key, value) => {
    setSendForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSendPush = useCallback(async () => {
    if (selectedUsers.length === 0) {
      alert("수신자를 선택해주세요.");
      return { success: false };
    }

    if (sendForm.sendType === "CUSTOM") {
      if (!sendForm.title || !sendForm.content) {
        alert("제목과 내용을 입력해주세요.");
        return { success: false };
      }
    } else {
      if (!sendForm.pushCode) {
        alert("템플릿을 선택해주세요.");
        return { success: false };
      }
    }

    setIsLoading(true);
    try {
      const requestData = {
        sendType: sendForm.sendType,
        receiverIds: selectedUsers.map(u => u.userId),
        pushCode: sendForm.pushCode,
        title: sendForm.title,
        content: sendForm.content,
        params: sendForm.params,
      };

      const response = await adminPushApi.sendAdminPush(requestData);
      
      setSelectedUsers([]);
      setSendForm({
        sendType: "CUSTOM",
        pushCode: "",
        title: "",
        content: "",
        params: {},
      });
      
      alert(`${response.count}명에게 푸시를 발송했습니다.`);
      return { success: true };
    } catch (error) {
      console.error("Failed to send push:", error);
      alert("발송에 실패했습니다.");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [selectedUsers, sendForm]);

  // ===== 탭 변경 시 데이터 로드 =====

    useEffect(() => {
    const { accessToken } = useAuthStore.getState();
    
    // 토큰 없으면 로드 안 함
    if (!accessToken) {
        console.log("No token, skipping fetch");
        return;
    }

    if (activeTab === "templates") {
        fetchTemplates();
    } else if (activeTab === "history") {
        fetchHistory(1, historyPageSize);
    } else if (activeTab === "send") {
        fetchUsers(1, "");
    }
    }, [activeTab, fetchTemplates, fetchHistory, fetchUsers, historyPageSize]);

  return {
    activeTab,
    setActiveTab,
    isLoading,
    templates,
    editingTemplate,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    handleAddTemplate,
    handleEditTemplate,
    handleSaveTemplate,
    handleDeleteTemplate,
    setEditingTemplate,
    history,
    historyPage,
    historyTotalPages,
    historyTotalCount,
    historyPageSize,
    historyFilters,
    handleHistoryFilterChange,
    handleHistorySearch,
    handleHistoryPageChange,
    handleHistoryPageSizeChange,
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
  };
};

export default useAdminPush;