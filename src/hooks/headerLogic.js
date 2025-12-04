import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export function useHeaderLogic() {
  const { user, fetchSession, logout: storeLogout, accessToken } = useAuthStore();
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(true);
  useEffect(() => {
    if (accessToken && !user) {
      fetchSession();
    }
  }, [accessToken, user, fetchSession]);

  const logout = async () => {
    await storeLogout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleAdminSwitch = () => {
    setIsAdminMode((prev) => !prev);
    alert(isAdminMode ? "일반 관리자 모드로 전환" : "슈퍼 관리자 모드로 전환");
  };

  return {
    user,
    logout,
    isAdmin: user?.role === "ADMIN" || user?.email === "admin@admin.com",
    isAdminMode,
    handleAdminSwitch,
  };
}