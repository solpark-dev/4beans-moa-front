// src/services/logic/admin/adminUserListLogic.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminUsers } from "@/api/adminUserApi";
import { useAdminUserStore } from "@/store/admin/adminUserStore";

export const useAdminUserListLogic = () => {
  const navigate = useNavigate();

  const {
    users,
    page,
    size,
    totalPages,
    totalCount,
    filters,
    loading,
    error,
    setFilter,
    setPage,
    setData,
    setLoading,
    setError,
    resetFilters,
  } = useAdminUserStore();

  const loadUsers = async (override) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = override?.page ?? page;
      const params = {
        page: currentPage,
        size,
        q: filters.q || undefined,
        status: filters.status === "ALL" ? undefined : filters.status,
        regDateFrom: filters.joinStart || undefined,
        regDateTo: filters.joinEnd || undefined,
      };

      const body = await fetchAdminUsers(params);

      if (!body.success) {
        throw new Error(
          body.error?.message || "회원 목록 조회에 실패했습니다."
        );
      }

      setData(body.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (value) => {
    setFilter("q", value);
  };

  const handleStatusChange = (value) => {
    setFilter("status", value);
  };

  const handleJoinStartChange = (value) => {
    setFilter("joinStart", value);
  };

  const handleJoinEndChange = (value) => {
    setFilter("joinEnd", value);
  };

  const handleSearchSubmit = async () => {
    setPage(1);
    await loadUsers({ page: 1 });
  };

  const handleSearchEnter = async (value) => {
    const trimmed = value.trim();
    if (trimmed === "") {
      resetFilters();
      await loadUsers({ page: 1 });
      return;
    }
    await handleSearchSubmit();
  };

  const handlePageClick = async (pageNumber) => {
    if (pageNumber === page) return;
    setPage(pageNumber);
    await loadUsers({ page: pageNumber });
  };

  const changePageBlock = async (type) => {
    const pageUnit = 5;
    const currentPage = page;
    const total = totalPages || 1;
    let targetPage = currentPage;

    if (type === "first") {
      targetPage = 1;
    } else if (type === "last") {
      targetPage = total;
    } else {
      const currentBlock = Math.floor((currentPage - 1) / pageUnit);
      if (type === "prevBlock") {
        if (currentBlock === 0) return;
        targetPage = currentBlock * pageUnit;
        if (targetPage < 1) targetPage = 1;
      } else if (type === "nextBlock") {
        const nextBlockStart = currentBlock * pageUnit + pageUnit + 1;
        if (nextBlockStart > total) return;
        targetPage = nextBlockStart;
      }
    }

    if (targetPage !== currentPage) {
      setPage(targetPage);
      await loadUsers({ page: targetPage });
    }
  };

  const getPageNumbers = () => {
    const pageUnit = 5;
    const currentBlock = Math.floor((page - 1) / pageUnit);
    const start = currentBlock * pageUnit + 1;
    const end = Math.min(start + pageUnit - 1, totalPages || 1);
    const pages = [];
    for (let p = start; p <= end; p += 1) {
      pages.push(p);
    }
    return pages;
  };

  const handleEmailClick = (userId) => {
    navigate(`/admin/users/${encodeURIComponent(userId)}`);
  };

  const handleReset = async () => {
    resetFilters();
    await loadUsers({ page: 1 });
  };

  useEffect(() => {
    loadUsers({ page: 1 });
  }, []);

  return {
    users,
    page,
    size,
    totalPages,
    totalCount,
    filters,
    loading,
    error,
    handleSearchInputChange,
    handleStatusChange,
    handleJoinStartChange,
    handleJoinEndChange,
    handleSearchSubmit,
    handleSearchEnter,
    handlePageClick,
    changePageBlock,
    getPageNumbers,
    handleEmailClick,
    handleReset,
  };
};
