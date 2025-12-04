import axios from "axios";
import httpClient from "./httpClient";

const API_BASE_URL = "/api/parties";
const PRODUCT_API_URL = "/api/product";

export const createParty = (partyData) => {
    return fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(partyData),
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Failed to create party");
        }
        return response.json();
    });
};

export const getPartyList = (params) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}?${queryString}`, {
        method: "GET",
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch party list");
        }
        return response.json();
    });
};

export const getPartyDetail = (id) => {
    return fetch(`${API_BASE_URL}/${id}`, {
        method: "GET",
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch party detail");
        }
        return response.json();
    });
};

export const getProducts = () => {
    return fetch(`${PRODUCT_API_URL}`, {
        method: "GET",
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        return response.json();
    });
};

export const updateOttAccount = (partyId, ottData) => {
    return fetch(`${API_BASE_URL}/${partyId}/ott-account`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ottData),
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Failed to update OTT account");
        }
        return response.json();
    });
};

export const joinParty = (partyId, paymentData) => {
    return fetch(`${API_BASE_URL}/${partyId}/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((err) => {
                throw new Error(err.message || "Failed to join party");
            });
        }
        return response.json();
    });
};

export const leaveParty = (partyId) => {
    return fetch(`${API_BASE_URL}/${partyId}/leave`, {
        method: "POST",
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((err) => {
                throw new Error(err.message || "Failed to leave party");
            });
        }
        // return response.json(); // void 반환일 수 있음
    });
};

export const getMyParties = async () => {
    try {
        const response = await httpClient.get("/parties/my");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch my parties:", error);
        throw error;
    }
};

export const getPartyMembers = (partyId) => {
    return fetch(`${API_BASE_URL}/${partyId}/members`, {
        method: "GET",
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch party members");
        }
        return response.json();
    });
};

export const processLeaderDeposit = (partyId, paymentData) => {
    return fetch(`${API_BASE_URL}/${partyId}/leader-deposit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((err) => {
                throw new Error(err.message || "Failed to process leader deposit");
            });
        }
        return response.json();
    });
};
