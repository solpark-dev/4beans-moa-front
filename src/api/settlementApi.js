import httpClient from "./httpClient";

export const getMySettlements = async () => {
    try {
        const response = await httpClient.get("/api/v1/settlements/my");
        return response.data;
    } catch (error) {
        throw error;
    }
};
