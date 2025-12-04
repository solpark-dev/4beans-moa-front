import httpClient from "./httpClient";

export const getMyDeposits = async () => {
    try {
        const response = await httpClient.get("/deposits/my");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch deposits:", error);
        throw error;
    }
};
