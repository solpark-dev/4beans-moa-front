// src/hooks/headerLogic.js
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function useHeaderLogic() {
  const { user, fetchSession, logout: storeLogout } = useAuthStore();

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const logout = async () => {
    await storeLogout();
    window.location.href = "/";
  };

  return {
    user,
    logout,
    isAdmin: user?.role === "ADMIN",
  };
}
