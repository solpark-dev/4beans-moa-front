// src/api/httpClient.js
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const httpClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

let isTokenRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpClient.interceptors.request.use(
  async (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("No access token found.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    if (
      status === 401 &&
      originalRequest.url !== "/auth/refresh" &&
      !originalRequest._retry
    ) {
      if (isTokenRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isTokenRefreshing = true;

      const { refreshToken, clearAuth, setTokens } = useAuthStore.getState();

      if (!refreshToken) {
        clearAuth();
        processQueue(error, null);
        return Promise.reject(error);
      }

      try {
        const refreshRes = await axios.post("/api/auth/refresh", null, {
          withCredentials: true,
          headers: {
            "Refresh-Token": refreshToken,
            "Content-Type": "application/json; charset=UTF-8",
          },
        });

        const apiRes = refreshRes.data;

        if (!apiRes.success) {
          clearAuth();
          processQueue(
            new Error(apiRes.error?.message || "토큰 갱신에 실패했습니다."),
            null
          );
          return Promise.reject(error);
        }

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          accessTokenExpiresIn,
        } = apiRes.data || {};

        setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || refreshToken,
          accessTokenExpiresIn,
        });

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        clearAuth();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isTokenRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
