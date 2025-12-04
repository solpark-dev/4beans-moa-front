// src/store/authStore.js
import { create } from "zustand";
import httpClient from "@/api/httpClient";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  accessTokenExpiresIn: localStorage.getItem("accessTokenExpiresIn")
    ? Number(localStorage.getItem("accessTokenExpiresIn"))
    : null,
  loading: true,

  setTokens: ({ accessToken, refreshToken, accessTokenExpiresIn }) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }

    if (accessTokenExpiresIn) {
      localStorage.setItem(
        "accessTokenExpiresIn",
        String(accessTokenExpiresIn)
      );
    } else {
      localStorage.removeItem("accessTokenExpiresIn");
    }

    set({
      accessToken: accessToken ?? get().accessToken,
      refreshToken: refreshToken ?? get().refreshToken,
      accessTokenExpiresIn: accessTokenExpiresIn ?? get().accessTokenExpiresIn,
    });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpiresIn");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresIn: null,
      loading: false,
    });
  },

  fetchSession: async () => {
    const { accessToken, clearAuth } = get();

    if (!accessToken) {
      set({ user: null, loading: false });
      return;
    }

    try {
      const res = await httpClient.get("/users/me");
      if (res.success && res.data) {
        set({ user: res.data, loading: false });
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    }
  },

  logout: async () => {
    try {
      await httpClient.post("/auth/logout");
    } catch {
      // 로그아웃 요청이 실패해도 클라이언트 세션은 무조건 초기화
    } finally {
      get().clearAuth();
    }
  },
}));
