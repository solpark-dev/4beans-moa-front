import httpClient from "./httpClient";

const API_BASE_URL = "/parties";
const PRODUCT_API_URL = "/product";

export const createParty = (partyData) => {
    return httpClient.post(`${API_BASE_URL}`, partyData);
};

export const getPartyList = (params) => {
    return httpClient.get(`${API_BASE_URL}`, { params });
};

export const getPartyDetail = (id) => {
    return httpClient.get(`${API_BASE_URL}/${id}`);
};

export const getProducts = () => {
    return httpClient.get(`${PRODUCT_API_URL}`);
};

export const updateOttAccount = (partyId, ottData) => {
    return httpClient.patch(`${API_BASE_URL}/${partyId}/ott-account`, ottData);
};

export const joinParty = (partyId, paymentData) => {
    return httpClient.post(`${API_BASE_URL}/${partyId}/join`, paymentData);
};

export const leaveParty = (partyId) => {
    return httpClient.post(`${API_BASE_URL}/${partyId}/leave`);
};

export const getMyParties = async () => {
    try {
        const response = await httpClient.get("/parties/my");
        // httpClient interceptor returns response.data, so we might just need response here if the backend returns the list directly.
        // However, looking at getMyParties in the original code:
        // const response = await httpClient.get("/parties/my");
        // return response.data;
        // If httpClient returns response.data, then 'response' here IS the data.
        // Let's check httpClient.js again.
        // httpClient.interceptors.response.use((response) => response.data, ...)
        // So httpClient.get returns the body directly.
        // But wait, the original getMyParties was:
        // const response = await httpClient.get("/parties/my");
        // return response.data;
        // This implies the original code might have been expecting axios response object OR the interceptor wasn't working as I thought.
        // Let's look at the interceptor in httpClient.js:
        // (response) => response.data
        // So yes, it returns data.
        // If the backend returns ApiResponse<List<PartyListResponse>>, then 'response' is that JSON.
        // If the original code was `return response.data`, it might be trying to access a `data` field inside the JSON response (ApiResponse structure).
        // Let's assume standard usage for now.
        return response;
    } catch (error) {
        console.error("Failed to fetch my parties:", error);
        throw error;
    }
};

export const getPartyMembers = (partyId) => {
    return httpClient.get(`${API_BASE_URL}/${partyId}/members`);
};

export const processLeaderDeposit = (partyId, paymentData) => {
    return httpClient.post(`${API_BASE_URL}/${partyId}/leader-deposit`, paymentData);
};

