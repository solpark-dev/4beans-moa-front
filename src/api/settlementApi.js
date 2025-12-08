import httpClient from "./httpClient";

export const getMySettlements = async () => {
    try {
        const apiResponse = await httpClient.get("/settlements/my");
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to fetch settlements:", error);
        throw error;
    }
};
