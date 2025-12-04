import httpClient from "./httpClient";

export const getMyDeposits = async () => {
    try {
        const response = await httpClient.get("/api/v1/deposits/my");
        return response.data;
    } catch (error) {
        throw error;
    }
};
