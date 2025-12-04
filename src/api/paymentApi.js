import httpClient from "./httpClient";

export const getMyPayments = async () => {
    try {
        const response = await httpClient.get("/api/v1/payments/my");
        return response.data;
    } catch (error) {
        throw error;
    }
};
