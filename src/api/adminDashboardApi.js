import httpClient from "@/api/httpClient";

// 관리자 대시보드 통계 조회
export const getDashboardStats = async () => {
    const response = await httpClient.get("/admin/dashboard/stats");
    return response;
};
