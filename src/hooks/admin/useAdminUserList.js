import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminUsers } from "@/api/adminUserApi";
import { useAdminUserStore } from "@/store/admin/adminUserStore";

export const useAdminUserListLogic = () => {
  const navigate = useNavigate();

  const {
    users,
    page,
    size,
    sort,
    totalPages,
    totalCount,
    filters,
    loading,
    error,
    setFilter,
    setPage,
    setSort,
    setData,
    setLoading,
    setError,
    resetFilters,
  } = useAdminUserStore();

  const [searchValue, setSearchValue] = useState(filters.q || "");
  const loadUsers = async (override) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = override?.page ?? page;
      const currentSort = override?.sort ?? sort;
      const currentStatus =
        override?.status !== undefined ? override.status : filters.status;

      const params = {
        page: currentPage,
        size,
        sort: currentSort,
        q: filters.q || undefined,
        status: currentStatus === "ALL" ? undefined : currentStatus,
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setFilter("q", value);
  };

  const handleSearchKeyDown = async (e) => {
    if (e.key === "Enter") {
      const trimmed = searchValue.trim();
      if (trimmed === "") {
        resetFilters();
        setSearchValue("");
        await loadUsers({ page: 1 });
        return;
      }
      setPage(1);
      await loadUsers({ page: 1 });
    }
  };

  const handleStatusChange = async (value) => {
    setFilter("status", value);
    setPage(1);
    await loadUsers({ page: 1, status: value });
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

  const handlePageClick = async (pageNumber) => {
    if (pageNumber === page) return;
    setPage(pageNumber);
    await loadUsers({ page: pageNumber });
  };

  const handleSortToggle = async (field) => {
    const sortParts = sort ? sort.split(",") : [];
    const currentField = sortParts[0] || "";
    const currentDir = sortParts[1] || "desc";

    const isSameField = currentField === field;
    const nextDir = isSameField && currentDir === "desc" ? "asc" : "desc";

    const primaryField = field;
    const secondaryField =
      field === "lastLoginDate" ? "regDate" : "lastLoginDate";

    const newSort = `${primaryField},${nextDir},${secondaryField},desc`;

    setSort(newSort);
    await loadUsers({ sort: newSort, page: 1 });
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

  const handleEmailClick = (userId) => {
    navigate(`/admin/users/${encodeURIComponent(userId)}`);
  };

  const handleReset = async () => {
    resetFilters();
    setSearchValue("");
    await loadUsers({ page: 1, sort: "regDate,desc" });
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

  const formatDate = (value) => {
    if (!value) return "-";
    return value.length > 10 ? value.substring(0, 10) : value;
  };

  useEffect(() => {
    loadUsers({ page: 1 });
  }, []);

  return {
    users,
    page,
    size,
    sort,
    totalPages,
    totalCount,
    filters,
    searchValue,
    loading,
    error,
    pageNumbers: getPageNumbers(),
    handlers: {
      handleSearchChange,
      handleSearchKeyDown,
      handleStatusChange,
      handleJoinStartChange,
      handleJoinEndChange,
      handleSearchSubmit,
      handlePageClick,
      handleSortToggle,
      changePageBlock,
      handleEmailClick,
      handleReset,
    },
    utils: {
      formatDate,
    },
  };
};
