import { useEffect, useState } from "react";
import { fetchCurrentUser, logout as requestLogout } from "@/api/authApi";

export function useHeaderLogic() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    const isOAuthCallback = path.startsWith("/oauth/");

    if (isOAuthCallback) {
      return;
    }

    fetchCurrentUser()
      .then((body) => {
        if (body.success && body.data) {
          setUser(body.data);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const logout = async () => {
    try {
      const res = await requestLogout();
      const ok = typeof res.success !== "undefined" ? res.success : true;
      if (!ok && res.error?.message) {
        alert(res.error.message);
      }
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  return { user, logout };
}
