import httpClient from "./httpClient";

const adminPushApi = {
  // ===== 푸시 코드(템플릿) =====
  
  // 템플릿 목록 조회
  getPushCodeList: async () => {
    const response = await httpClient.get("/push/admin/codes");
    return response;
  },

  // 템플릿 추가
  addPushCode: async (data) => {
    const response = await httpClient.post("/push/admin/codes", data);
    return response;
  },

  // 템플릿 수정
  updatePushCode: async (pushCodeId, data) => {
    const response = await httpClient.put(`/push/admin/codes/${pushCodeId}`, data);
    return response;
  },

  // 템플릿 삭제
  deletePushCode: async (pushCodeId) => {
    const response = await httpClient.delete(`/push/admin/codes/${pushCodeId}`);
    return response;
  },

  // ===== 발송 내역 =====

  // 발송 내역 조회 (페이지네이션)
  getPushHistory: async (page = 1, size = 20, filters = {}) => {
    const params = {
      page,
      size,
      pushCode: filters.pushCode || undefined,
      receiverId: filters.receiverId || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    };
    const response = await httpClient.get("/push/admin/history", { params });
    return response;
  },

  // ===== 사용자 목록 =====

  // 사용자 검색 (프론트에서 페이지네이션 처리)
  getUserList: async (page = 1, size = 10, keyword = "") => {
    const response = await httpClient.get("/push/admin/search", {
      params: { keyword: keyword || undefined },
    });
    
    const allUsers = response || [];
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const pagedUsers = allUsers.slice(startIndex, endIndex);
    
    return {
      content: pagedUsers,
      page: page,
      totalPages: Math.ceil(allUsers.length / size) || 1,
      totalCount: allUsers.length,
    };
  },

  // ===== 수동 발송 =====

  // 관리자 푸시 발송
  sendAdminPush: async (data) => {
    const response = await httpClient.post("/push/admin/send", data);
    return response;
  },
};

export default adminPushApi;