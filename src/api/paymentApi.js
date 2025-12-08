import httpClient from "./httpClient";

export const getMyPayments = async () => {
    try {
        // httpClient baseURL이 /api이므로 /v1/payments/my로 호출
        // httpClient가 이미 response.data를 반환하므로 그것이 ApiResponse
        const apiResponse = await httpClient.get("/v1/payments/my");
        // ApiResponse 형식: { success: true, data: [...], error: null }
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to fetch payments:", error);
        throw error;
    }
};
