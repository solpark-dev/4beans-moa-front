import httpClient from "./httpClient";

export const getMySettlements = async () => {
    try {
        const response = await httpClient.get("/settlements/my");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch settlements:", error);
        throw error;
    }
};
