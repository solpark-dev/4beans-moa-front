// src/hooks/user/useLoginHistory.js
import { useEffect, useState } from "react";
import httpClient from "@/api/httpClient";

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("ko-KR");
};

export const useLoginHistory = (initialSize = 10) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(initialSize);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (targetPage = 1) => {
    try {
      setLoading(true);
      const res = await httpClient.get("/users/login-history/me", {
        params: {
          page: targetPage,
          size,
        },
      });

      const { success, data } = res;
      if (!success || !data) {
        setItems([]);
        setTotalCount(0);
        return;
      }

      const content = data.content ?? [];
      const total = data.totalCount ?? data.totalElements ?? 0;

      setItems(
        content.map((it) => ({
          ...it,
          loginAtFormatted: formatDateTime(it.loginAt),
          successText: it.success ? "성공" : "실패",
        }))
      );
      setPage(data.page ?? targetPage);
      setSize(data.size ?? size);
      setTotalCount(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, [size]);

  const pageCount = totalCount > 0 ? Math.ceil(totalCount / size) : 1;

  const blockSize = 5;
  const currentBlock = Math.floor((page - 1) / blockSize);
  const beginPage = currentBlock * blockSize + 1;
  const endPage = Math.min(beginPage + blockSize - 1, pageCount);

  const pages = [];
  for (let p = beginPage; p <= endPage; p += 1) {
    pages.push(p);
  }

  const goPage = (target) => {
    if (target < 1 || target > pageCount || target === page) return;
    fetchPage(target);
  };

  const goFirst = () => goPage(1);
  const goPrev = () => goPage(page - 1);
  const goNextBlock = () => {
    if (endPage < pageCount) {
      goPage(endPage + 1);
    }
  };
  const goLast = () => goPage(pageCount);

  return {
    state: {
      items,
      page,
      size,
      totalCount,
      pageCount,
      pages,
      beginPage,
      endPage,
      loading,
    },
    actions: {
      goFirst,
      goPrev,
      goPage,
      goNextBlock,
      goLast,
      setSize,
      reload: () => fetchPage(page),
    },
  };
};
