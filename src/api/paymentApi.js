import httpClient from "./httpClient";

export const getMyPayments = async () => {
    try {
        const response = await httpClient.get("/v1/payments/my");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch payments:", error);
        throw error;
    }
};
