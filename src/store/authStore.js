import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import httpClient from "@/api/httpClient";
import { useLoginStore } from "./user/loginStore";

const PASSWORD_STORAGE_KEYS = [
  "login-password",
  "password",
  "pwd",
  "user-password",
  "pwd-remember",
];

export const purgeLoginPasswords = () => {
  [localStorage, sessionStorage].forEach((storage) => {
    if (!storage) return;
    PASSWORD_STORAGE_KEYS.forEach((key) => {
      try {
        storage.removeItem(key);
      } catch {
        // ignore
      }
    });
  });

  try {
    useLoginStore.getState().setField("password", "");
    useLoginStore.getState().setField("otpCode", "");
  } catch {
    // ignore store reset errors
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresIn: null,
      loading: false,

      setTokens: ({ accessToken, refreshToken, accessTokenExpiresIn }) => {
        set({
          accessToken,
          refreshToken,
          accessTokenExpiresIn: Number(accessTokenExpiresIn),
        });
        get().fetchSession();
      },

      setUser: (user) => set({ user }),
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          accessTokenExpiresIn: null,
          loading: false,
        });
        localStorage.removeItem("auth-storage");
      },
      fetchSession: async () => {
        const { accessToken, clearAuth } = get();

        if (!accessToken) {
          set({ user: null, loading: false });
          return;
        }

        set({ loading: true });

        try {
          const res = await httpClient.get("/users/me");

          if (res.success && res.data) {
            set({ user: res.data, loading: false });
          } else {
            clearAuth();
          }
        } catch (error) {
          console.error("Session Fetch Error:", error);
          clearAuth();
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        try {
          await httpClient.post("/auth/logout");
        } catch (error) {
          console.error("Logout Error:", error);
        } finally {
          purgeLoginPasswords();
          get().clearAuth();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
